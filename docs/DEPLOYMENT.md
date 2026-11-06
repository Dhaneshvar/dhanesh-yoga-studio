# Deployment guide

## Required environment variables

Configure these variables in the hosting dashboard for every production and preview environment:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
VITE_SUPABASE_PROJECT_ID=your-project-ref
VITE_SITE_URL=https://your-studio.onrender.com
```

Do not add a Supabase service-role key to this frontend project.

## Build settings

| Setting | Value |
| --- | --- |
| Runtime | Node.js 20+ |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |

## Vercel

1. Import the GitHub repository.
2. Select the Vite framework preset.
3. Add the required environment variables.
4. Confirm the build command is `npm run build` and output directory is `dist`.
5. Deploy and test authentication callbacks using the deployed domain.

## Railway

1. Create a service from the GitHub repository.
2. Add the required environment variables.
3. Use `npm ci && npm run build` as the build command.
4. Serve the production build with a static hosting service or `npm run preview -- --host 0.0.0.0 --port $PORT`.

## Render

1. Push this repository to GitHub. The committed `render.yaml` Blueprint contains the correct Vite build, `dist` publish directory, security headers, and React Router fallback.
2. In Render, choose **New → Blueprint** and select the GitHub repository.
3. Enter the four variables above when Render requests them. Set `VITE_SITE_URL` to the final `https://...onrender.com` address, or your custom domain after it is connected.
4. Create the Static Site. Render builds with `npm ci && npm run build`, serves `dist`, and automatically deploys future pushes to the selected branch.
5. In Supabase Auth, add the exact Render URL to **Site URL** and **Redirect URLs** before testing sign-up or password recovery.

`render.yaml` intentionally contains variable names only—never paste secrets into Git. Vite variables are embedded during the static build, so change a value in Render and redeploy to apply it.

## Supabase production checklist

- The application backend is Supabase (Postgres, Auth, Row Level Security and Realtime). Do not create a second Node server on Render for it; Render hosts the static frontend only.
- From this repository, after linking the intended project, deploy schema changes with `npx supabase db push`. This applies the committed SQL migrations in `supabase/migrations/` to that linked Supabase project.
- Run `npx supabase migration list` afterward and confirm every local migration also appears on the remote side before going live.
- Add the deployed site URL and authentication callback URLs in Supabase Auth settings.
- Enable Row Level Security on application tables.
- Review insert, select, update and delete policies for each user role.
- Test signup, login, logout and password recovery from the deployed domain.
- Verify database errors and temporary network failures are shown safely to users.

The former Lovable MCP scaffold was removed because the public site does not call it and it contained a separate static data copy. Studio content is now served only through the Supabase-backed application paths.

## Release checklist

```bash
npm ci
npx tsc --noEmit
npm run lint
npm run build
```

After deployment, verify the homepage animation, theme switcher, navigation, authentication, dashboard access and mobile layout.
