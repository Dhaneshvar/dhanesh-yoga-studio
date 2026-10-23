# Dhanesh Yoga Studio

A responsive yoga-studio website built with React, TypeScript and Vite. The homepage opens with an immersive yoga-room sequence: a mat unfolds, instructors demonstrate a guided practice, the mat is packed away, and the experience transitions into the main studio content.

## Highlights

- Animated yoga-studio welcome experience with light and dark themes
- Responsive navigation, multilingual UI and accessible controls
- Age-specific yoga programs, asana library and weekly schedule
- Student, trainer and administrator dashboard routes
- Supabase authentication and data integration
- Separate concept preview at `/concept/yoga-mat`

## Technology

- React 18 and TypeScript
- Vite
- Tailwind CSS and shadcn/ui
- Framer Motion
- React Router
- TanStack Query
- Supabase

## Local development

Requirements: Node.js 20 or newer and npm.

```bash
git clone https://github.com/Dhaneshvar/dhanesh-yoga-studio.git
cd dhanesh-yoga-studio
npm install
```

Copy `.env.example` to `.env` and provide the public Supabase project settings:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
VITE_SUPABASE_PROJECT_ID=your-project-ref
```

Start the development server:

```bash
npm run dev
```

The default local URL is `http://127.0.0.1:5173`. The port may change when another process is already using it.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run preview
```

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Animated welcome and complete marketing homepage |
| `/programs` | Yoga programs by audience and age |
| `/asanas` | Asana library |
| `/schedule` | Weekly class schedule |
| `/gallery` | Studio gallery |
| `/contact` | Contact page |
| `/login` and `/register` | Account access |
| `/dashboard/*` | Student and trainer workspace |
| `/admin/*` | Administration workspace |
| `/concept/yoga-mat` | Standalone animation preview |

## Deployment

The frontend builds to `dist/` and can be deployed to Vercel, Railway or Render. Configure the three `VITE_SUPABASE_*` variables in the hosting provider rather than committing a local `.env` file. See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for provider settings and release checks.

## Security

- Never commit `.env` or Supabase service-role keys.
- Only the Supabase publishable/anonymous key belongs in the browser application.
- Configure Row Level Security policies before accepting production user data.

## Lovable

This project originated in Lovable and remains connected to its project workflow. Local Git commits pushed to this repository can be synchronized with Lovable.
