# Dhanesh Yoga mobile app

This is the isolated Expo React Native client for Dhanesh Yoga Studio. It shares the production Supabase project with the website but has its own native UI, dependencies, and app configuration.

## Local setup

```bash
cd mobile
copy .env.example .env
npm install
npm start
```

Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `mobile/.env`. Never add a service-role key to this file or to a mobile build.

## First database activation

The mobile client reads the same Supabase project configured in the repository's root `.env`. The local `supabase/config.toml` must point to that same project. A project owner should authenticate the Supabase CLI once, then apply the committed migrations from the repository root:

```bash
npx supabase@latest login
npx supabase@latest link --project-ref fljnilgkpqawyjztaenn
npx supabase@latest db push
```

This creates the live `programs`, `class_sessions`, bookings, profiles, and supporting security policies. It does not add sample records. Keep the publishable key in the app; never put the CLI access token or a service-role key in `.env`.

The app opens to a branded animated loading screen, then authentication or the signed-in student tabs: Home, Programmes, Schedule, Bookings, and Account. Programme, class, booking, trainer, profile, health-intake, contact, and feedback records use Supabase; there is no invented programme or schedule data in the mobile client. The asana library is bundled educational content so it remains available on slow or offline connections.

Student features include:

- system, light, and dark themes;
- reduced-motion support, animated screen/list entrances, and subtle haptic feedback;
- native class reminders that are scheduled after a class is booked and removed when it is cancelled, without ever delaying the booking result;
- an optional daily practice reminder with selectable time;
- persistent notification, theme, and accessibility preferences;
- complete account, emergency-contact, health-note, experience, and goal details;
- password recovery, trainer discovery, contact, feedback, and asana guidance.

Notifications are local device reminders and do not require a push-notification server. The user is asked for notification permission only when enabling reminders or after reserving a class while reminders are enabled.

## Reliability, privacy, and security

- Live Supabase requests have a bounded timeout and plain-language recovery message; pull to refresh retries any read safely.
- The booking RPC is the authority for capacity and prevents duplicate reservations. If a connection drops after booking, the app checks **My bookings** before asking the student to retry, so it does not create a second reservation.
- Session tokens use the native encrypted Keychain (iOS) or Keystore-backed storage (Android). Do not put a Supabase service-role key, staff password, or any other secret in an `EXPO_PUBLIC_*` variable.
- Class notifications deliberately avoid class/location details on the lock screen. They open My bookings instead.
- Local reminders are best-effort device reminders. Android/iOS battery-saving modes, a powered-off device, or OS notification settings can delay them; this is intentionally not an exact-alarm permission, which would be inappropriate for routine yoga reminders.

The production app reports its store version and native build number under **Settings → Support & information**. Update the human-facing `expo.version` before a release; EAS production builds auto-increment their remote build number.

## Supabase authentication setup

In **Supabase Dashboard → Authentication → URL Configuration**, add this Redirect URL before testing password recovery on a native build:

```text
dhaneshyoga://**
```

Keep the website URL(s) in the same allow-list. Password-reset emails then return to the app's `/reset-password` route. Email delivery and confirmation behavior still follow the project's Supabase Auth settings.

## Checks

```bash
npx expo lint
npx eslint .
npx tsc --noEmit
npx expo-doctor
```

## Native builds

The included `eas.json` provides an installable Android preview APK and production store profiles. After signing in to an Expo account, initialize this app once and build it:

```bash
npx eas-cli init
npx eas-cli build --profile preview --platform android
npx eas-cli build --profile production --platform all
```

`eas-cli init` adds the Expo project identity to `app.json`; do not invent or copy a project ID from another app. App Store and Play Store submission also require the owner's real store accounts, signing credentials, privacy details, screenshots, and final store listing content.

Because `expo-notifications`, `expo-system-ui`, `expo-secure-store`, and `expo-haptics` contain native modules, rebuild the native app after changing their configuration. Release Android builds enable code minification and resource shrinking; publish the production **AAB** rather than an APK so Google Play can deliver device-specific splits. Remote push notifications are intentionally not enabled; adding them later requires an EAS project ID, APNs/FCM credentials, a secure server sender, and a protected device-token table.
