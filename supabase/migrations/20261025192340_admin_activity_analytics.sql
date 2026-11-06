-- Privacy-conscious admin engagement analytics. These records store only
-- aggregate visit/page counts and last-active timestamps; no IP or device data.

alter table public.profiles add column if not exists last_active_at timestamptz;

create table if not exists public.user_activity_daily (
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_date date not null default current_date,
  visit_count integer not null default 0 check (visit_count >= 0),
  page_views integer not null default 0 check (page_views >= 0),
  last_active_at timestamptz not null default now(),
  primary key (user_id, activity_date)
);

create index if not exists user_activity_daily_recent_idx
  on public.user_activity_daily(activity_date desc, user_id);

alter table public.user_activity_daily enable row level security;
revoke all on public.user_activity_daily from anon, authenticated;
grant select on public.user_activity_daily to authenticated;

create policy "users view own activity" on public.user_activity_daily for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create or replace function public.record_my_activity()
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return; end if;
  insert into public.user_activity_daily(user_id, activity_date, visit_count, page_views, last_active_at)
  values (auth.uid(), current_date, 1, 1, now())
  on conflict (user_id, activity_date) do update set
    page_views = public.user_activity_daily.page_views + 1,
    visit_count = public.user_activity_daily.visit_count + case when public.user_activity_daily.last_active_at < now() - interval '30 minutes' then 1 else 0 end,
    last_active_at = now();
  update public.profiles set last_active_at = now() where id = auth.uid();
end;
$$;

create or replace function public.admin_list_users()
returns table(
  id uuid, full_name text, phone text, role public.app_role, email text,
  created_at timestamptz, last_active_at timestamptz, visits_30_days bigint, page_views_30_days bigint
)
language sql security definer set search_path = public, auth as $$
  select p.id, p.full_name, p.phone, p.role, u.email, p.created_at, p.last_active_at,
    coalesce(sum(a.visit_count) filter (where a.activity_date >= current_date - 29), 0)::bigint,
    coalesce(sum(a.page_views) filter (where a.activity_date >= current_date - 29), 0)::bigint
  from public.profiles p
  join auth.users u on u.id = p.id
  left join public.user_activity_daily a on a.user_id = p.id
  where public.is_admin()
  group by p.id, u.email;
$$;

revoke all on function public.record_my_activity() from public;
revoke all on function public.admin_list_users() from public;
grant execute on function public.record_my_activity() to authenticated;
grant execute on function public.admin_list_users() to authenticated;
