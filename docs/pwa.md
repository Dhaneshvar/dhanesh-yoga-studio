# Dhanesh Yoga PWA

The website is installable as a Progressive Web App in production builds.

## Local verification

Service workers are intentionally disabled by `npm run dev` so development does not keep stale assets. Test the PWA with:

```bash
npm run build
npm run preview
```

Open the preview URL in Chrome or Edge, then check DevTools → Application → Manifest and Service Workers. The install option appears only when the browser considers the site installable and the app has not been dismissed previously.

The service worker caches the public application shell and static assets. Supabase REST and Auth requests are explicitly excluded, so private sessions, bookings, profiles, and other database data are never served from an offline cache.

For a deployed site, serve the built `dist` directory over HTTPS and preserve the SPA rewrite to `/index.html` for client-side routes.
