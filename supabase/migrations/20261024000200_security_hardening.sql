-- Security hardening for production data access.

-- Trainers may not administer the whole catalogue. Programmes are managed by
-- administrators; trainers can only manage sessions assigned to themselves.
drop policy if exists "staff manage programs" on public.programs;
drop policy if exists "staff manage sessions" on public.class_sessions;
drop policy if exists "published programs are public" on public.programs;
drop policy if exists "public sessions are readable" on public.class_sessions;

create policy "published programs are public" on public.programs
  for select using (is_published or public.is_admin());

create policy "admins manage programs" on public.programs
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "public sessions are readable" on public.class_sessions
  for select using (
    (is_public and status = 'scheduled')
    or public.is_admin()
    or (trainer_id = auth.uid())
  );

create policy "admins manage sessions" on public.class_sessions
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "trainers manage assigned sessions" on public.class_sessions
  for all to authenticated
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

-- Anonymous contact and feedback forms remain available, but each requester is
-- rate-limited in a short window to prevent database-filling spam.
create table if not exists public.public_submission_rate_limits (
  rate_key text primary key,
  window_started_at timestamptz not null default now(),
  submission_count integer not null default 0 check (submission_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.public_submission_rate_limits enable row level security;
revoke all on public.public_submission_rate_limits from anon, authenticated;

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

  request_headers := coalesce(nullif(current_setting('request.headers', true), '')::jsonb, '{}'::jsonb);
  requester := coalesce(
    request_headers ->> 'x-forwarded-for',
    request_headers ->> 'cf-connecting-ip',
    auth.uid()::text,
    'unknown'
  );
  rate_key_value := p_kind || ':' || encode(digest(requester::text, 'sha256'::text), 'hex');

  insert into public.public_submission_rate_limits (rate_key, window_started_at, submission_count, updated_at)
  values (rate_key_value, now(), 1, now())
  on conflict (rate_key) do update
  set
    window_started_at = case
      when public.public_submission_rate_limits.window_started_at <= now() - interval '10 minutes' then now()
      else public.public_submission_rate_limits.window_started_at
    end,
    submission_count = case
      when public.public_submission_rate_limits.window_started_at <= now() - interval '10 minutes' then 1
      else public.public_submission_rate_limits.submission_count + 1
    end,
    updated_at = now()
  returning window_started_at, submission_count into current_window, current_count;

  return current_window > now() - interval '10 minutes' and current_count <= 5;
end;
$$;

revoke all on function public.allow_public_submission(text) from public;
grant execute on function public.allow_public_submission(text) to anon, authenticated;

drop policy if exists "anyone can create contact enquiries" on public.contact_enquiries;
drop policy if exists "anyone can create feedback" on public.feedback;

create policy "rate limited contact enquiries" on public.contact_enquiries
  for insert to anon, authenticated
  with check (
    public.allow_public_submission('contact')
    and status = 'new'
    and (user_id is null or user_id = auth.uid())
  );

create policy "rate limited feedback" on public.feedback
  for insert to anon, authenticated
  with check (
    public.allow_public_submission('feedback')
    and status = 'new'
    and (user_id is null or user_id = auth.uid())
  );

-- Keep helper functions callable by RLS, but do not rely on the default PUBLIC
-- execute privilege. They return only the caller's own authorization state.
revoke all on function public.is_admin() from public;
revoke all on function public.is_trainer_or_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_trainer_or_admin() to anon, authenticated;
