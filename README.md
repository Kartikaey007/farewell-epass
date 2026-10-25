# Montfort World School Farewell E-Pass

A dark, premium farewell entry system for Montfort World School with:
- student pass generation
- QR-based entry pass
- organizer dashboard with PIN access
- live QR code scanning for gate entry
- browser-based storage for demo mode

## Quick start

1. Open the student portal:
   - `docs/index.html`
2. Open the organizer portal:
   - `docs/organizer.html`
3. Default organizer PIN:
   - `montfort2026`

## Local run

From the repo root:

```bash
cd docs
python3 -m http.server 8000
```

Then open:
- `http://localhost:8000/index.html`
- `http://localhost:8000/organizer.html`

## GitHub Pages deployment

This repo is configured for GitHub Pages using the `/docs` folder.

1. Go to GitHub repo settings.
2. Open `Pages`.
3. Choose `Deploy from a branch`.
4. Set branch to `main` and folder to `/docs`.
5. Save.

Your site will be available at:
`https://<your-username>.github.io/<repo-name>/`

## Backend upgrade path

This version is a fully functional front-end prototype with local browser storage. For a real multi-device backend, connect the app to Supabase or Firebase and keep the same frontend.

### Supabase setup

1. Create a new Supabase project.
2. Create table `farewell_passes` with fields:
   - `id` text primary key
   - `name` text
   - `phone` text
   - `created_at` timestamptz
   - `scanned_at` timestamptz nullable
   - `status` text default 'Pending'
3. Replace the default local-only logic in `app.js` and `organizer.js` with your Supabase client calls.

## Notes

- The app is designed for the Montfort World School farewell event.
- The logo sits in `docs/logo.svg` and can be replaced with the school’s official brand image.
- QR scans work in browser camera mode for organizer validation.
