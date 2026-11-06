-- Follow-up for the already-applied security migration.
-- Registration intent is not authorization: an instructor request remains a
-- student account until an administrator approves it.

create or replace function public.allow_public_submission(p_kind text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  request_headers jsonb;
  requester text;
  rate_key_value text;
  current_window timestamptz;
  current_count integer;
begin
  if p_kind not in ('contact', 'feedback') then
    raise exception 'Invalid submission type';
  end if;

  request_headers := coalesce(
    nullif(current_setting('request.headers', true), '')::jsonb,
    '{}'::jsonb
  );
  requester := coalesce(
    request_headers ->> 'x-forwarded-for',
    request_headers ->> 'cf-connecting-ip',
    auth.uid()::text,
    'unknown'
  );
  rate_key_value := p_kind || ':' || encode(
    extensions.digest(requester::text, 'sha256'::text),
    'hex'
  );

  insert into public.public_submission_rate_limits
    (rate_key, window_started_at, submission_count, updated_at)
  values (rate_key_value, now(), 1, now())
  on conflict (rate_key) do update
  set
    window_started_at = case
      when public.public_submission_rate_limits.window_started_at <= now() - interval '10 minutes'
        then now()
      else public.public_submission_rate_limits.window_started_at
    end,
    submission_count = case
      when public.public_submission_rate_limits.window_started_at <= now() - interval '10 minutes'
        then 1
      else public.public_submission_rate_limits.submission_count + 1
    end,
    updated_at = now()
  returning window_started_at, submission_count
  into current_window, current_count;

  return current_window > now() - interval '10 minutes'
    and current_count <= 5;
end;
$$;

revoke all on function public.allow_public_submission(text) from public;
grant execute on function public.allow_public_submission(text) to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_account_type text;
begin
  requested_account_type := lower(coalesce(new.raw_user_meta_data ->> 'account_type', 'practitioner'));

  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  );

  if requested_account_type = 'instructor' then
    insert into public.trainer_applications
      (applicant_id, specialization, years_experience, bio)
    values (
      new.id,
      'Pending instructor details',
      0,
      'Instructor application started during account registration; studio review is required.'
    );
  end if;

  return new;
end;
$$;

create or replace function public.review_trainer_application(
  p_application_id uuid,
  p_decision text,
  p_specialization text default null,
  p_years_experience smallint default 0,
  p_bio text default null
)
returns public.trainer_applications
language plpgsql
security definer
set search_path = public
as $$
declare
  application_row public.trainer_applications;
  reviewed_application public.trainer_applications;
  applicant_name text;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Administrator access required';
  end if;
  if p_decision not in ('approve', 'reject') then
    raise exception 'Invalid trainer application decision';
  end if;

  select * into application_row
  from public.trainer_applications
  where id = p_application_id
  for update;

  if not found or application_row.status <> 'pending' then
    raise exception 'Trainer application is not pending';
  end if;

  if p_decision = 'approve' then
    if nullif(trim(coalesce(p_specialization, '')), '') is null then
      raise exception 'Specialization is required when approving an instructor';
    end if;
    if coalesce(p_years_experience, 0) < 0 then
      raise exception 'Years of experience cannot be negative';
    end if;

    select full_name into applicant_name
    from public.profiles
    where id = application_row.applicant_id;

    update public.profiles
    set role = 'trainer', updated_at = now()
    where id = application_row.applicant_id;

    insert into public.trainer_profiles
      (id, display_name, specialization, years_experience, bio, is_active)
    values (
      application_row.applicant_id,
      coalesce(nullif(trim(applicant_name), ''), 'Yoga Instructor'),
      trim(p_specialization),
      coalesce(p_years_experience, 0),
      nullif(trim(coalesce(p_bio, '')), ''),
      true
    )
    on conflict (id) do update set
      display_name = excluded.display_name,
      specialization = excluded.specialization,
      years_experience = excluded.years_experience,
      bio = excluded.bio,
      is_active = true,
      updated_at = now();

    update public.trainer_applications
    set status = 'approved', reviewed_by = auth.uid(), reviewed_at = now(), rejection_reason = null,
        specialization = trim(p_specialization), years_experience = coalesce(p_years_experience, 0),
        bio = nullif(trim(coalesce(p_bio, '')), ''), updated_at = now()
    where id = p_application_id
    returning * into reviewed_application;
  else
    update public.trainer_applications
    set status = 'rejected', reviewed_by = auth.uid(), reviewed_at = now(),
        rejection_reason = nullif(trim(coalesce(p_bio, '')), ''), updated_at = now()
    where id = p_application_id
    returning * into reviewed_application;
  end if;

  return reviewed_application;
end;
$$;

revoke all on function public.review_trainer_application(uuid, text, text, smallint, text) from public;
grant execute on function public.review_trainer_application(uuid, text, text, smallint, text) to authenticated;
