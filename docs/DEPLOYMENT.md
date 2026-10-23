# Deployment guide

## Required environment variables

Configure these variables in the hosting dashboard for every production and preview environment:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
VITE_SUPABASE_PROJECT_ID=your-project-ref
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

1. Create a Static Site from the GitHub repository.
2. Use `npm ci && npm run build` as the build command.
3. Set the publish directory to `dist`.
4. Add the required environment variables.
5. Configure the rewrite rule `/* -> /index.html` for React Router routes.

## Supabase production checklist

- Add the deployed site URL and authentication callback URLs in Supabase Auth settings.
- Enable Row Level Security on application tables.
- Review insert, select, update and delete policies for each user role.
- Test signup, login, logout and password recovery from the deployed domain.
- Verify database errors and temporary network failures are shown safely to users.

## Release checklist

```bash
npm ci
npx tsc --noEmit
npm run lint
npm run build
```

After deployment, verify the homepage animation, theme switcher, navigation, authentication, dashboard access and mobile layout.
