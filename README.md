# Farewell E-Pass Portal

A dark-themed farewell guest pass system built as a working static demo for GitHub Pages.

## Features
- Generate student e-passes
- QR code preview for each pass
- Guest check-in verification by pass code
- Dashboard with checked-in and pending entries
- Local browser storage for demo persistence
- Dark-themed, campus-ready UI

## Run locally
Open the file directly in a browser or serve the folder locally:

```bash
cd docs
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages deployment
This project is designed to be deployed from the `docs/` folder in the repository.

In GitHub:
1. Go to your repository.
2. Open Settings > Pages.
3. Set Source to `Deploy from a branch`.
4. Choose `main` and folder `/docs`.
5. Save.

Your site will be published at:
`https://<username>.github.io/<repo-name>/`

## Notes
- This is a front-end demo and stores data in the browser (`localStorage`).
- It is ideal for a school farewell event, student registration desk, and gate check-in desk.
