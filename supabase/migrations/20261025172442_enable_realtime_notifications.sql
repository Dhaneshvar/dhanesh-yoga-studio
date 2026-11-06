
-- Enable realtime for the rows used by the dashboard notification indicator.
-- Keep the existing RLS policies in control of which records each user can see.
grant select on public.contact_enquiries, public.feedback to authenticated;

do $$
declare
  realtime_publication oid;
  table_name text;
begin
  select oid into realtime_publication
  from pg_catalog.pg_publication
  where pubname = 'supabase_realtime';

  if realtime_publication is null then
    return;
  end if;

  foreach table_name in array array[
    'contact_enquiries',
    'feedback',
    'trainer_applications',
    'bookings'
  ] loop
    if not exists (
      select 1
      from pg_catalog.pg_publication_rel publication_rel
      join pg_catalog.pg_class relation on relation.oid = publication_rel.prrelid
      join pg_catalog.pg_namespace relation_schema on relation_schema.oid = relation.relnamespace
      where publication_rel.prpubid = realtime_publication
        and relation_schema.nspname = 'public'
        and relation.relname = table_name
    ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end
$$;
