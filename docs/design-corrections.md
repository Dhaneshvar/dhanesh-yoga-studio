# Dhanesh Yoga Design & UX Corrections Log

This is the standing implementation checklist for the website and mobile app. New visual or UX work must follow it.

## Brand, accessibility and visual clarity

- Use the Dhanesh Yoga logo and favicon consistently; do not use generic placeholder branding.
- Maintain readable foreground/background contrast in light and dark themes, including navigation, alerts and dashboard text.
- Add meaningful `alt` text, labels, hover/focus states and keyboard-accessible controls.
- Keep the guided-meditation control visually distinct from chat/help controls.
- Use a clear seated-practitioner/lotus icon for guided meditation. Do not use abstract dots, unrelated glyphs or a copied third-party asset.
- The web icon is an original SVG. The mobile equivalent is `mobile/src/components/MeditationIcon.tsx`.

## Layout and motion

- Floating controls must remain fixed, reachable and non-overlapping on desktop and mobile. The return-to-top button must remain visible above other floating controls.
- Respect `prefers-reduced-motion`; never let animation prevent reading, booking or navigation.
- Keep text centred and unclipped in the yoga hero and ensure dark/light hero treatments match the active theme.
- Route changes should show the studio loader rather than a blank screen.

## Data and trust

- Never show invented programme, schedule, instructor, attendance, finance or notification data as if it were live.
- Use friendly empty states for unavailable configuration; do not expose database/schema errors to visitors.
- Preserve role boundaries: practitioners book; instructors require admin approval; admins manage studio data.
- Activity analytics are aggregate only: last active, visit count and page views. Do not collect IP/device fingerprints in the client.

## Mobile parity

- Every new website feature must be assessed for its Expo/mobile equivalent before release.
- Reuse the same icon meaning, brand palette, empty/error states and accessibility labels on mobile.
- Mobile-specific layouts may differ, but never remove essential actions such as booking, notifications, attendance or account access.

## Current follow-up work

- Replace remaining legacy mock admin pages with live Supabase-backed views before exposing them in navigation.
- Use Material UI for the new operational dashboards and retain a consistent Dhanesh Yoga visual theme.
- Require a licensed asset or an original asset before adding any external illustration, photo, icon or vector.
