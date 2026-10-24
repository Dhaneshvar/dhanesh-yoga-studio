# Supabase database activation

The application code expects the schema in `supabase/migrations/20261024000100_studio_core.sql`.

## Apply it once

1. Open the Dhanesh Yoga Studio project in Supabase.
2. Go to **SQL Editor** and select **New query**.
3. Open the migration file, copy its complete contents, paste it into the query editor and choose **Run**.
4. Confirm that the query finishes without errors.

This creates the tables, authentication profile trigger, Row Level Security policies and the transactional booking functions. It intentionally inserts no sample content.

## Create the first administrator

1. Create the studio owner's account at `/register`.
2. In Supabase SQL Editor, run the following once, replacing the email address with the account owner's email:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'owner@example.com');
```

3. Sign out and sign in again. That account can now open `/admin/sessions` to add the real programmes and classes.

## Important

- Do not put a secret key, service-role key, database password or connection string in `.env` for this browser application.
- Use the publishable key only. Database access is protected by Row Level Security.
- Add real programmes and sessions through the admin interface; the migration does not create demo content.
- In **Authentication → URL Configuration**, set the Site URL to the deployed address and add both the deployed URL and `http://127.0.0.1:4173` as redirect URLs for local testing.
- In **Authentication → Providers → Email**, decide whether accounts must confirm their email address before their first sign-in. Keeping confirmation enabled is recommended for a public studio site; configure the email template and sender before launch.
