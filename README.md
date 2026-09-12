# Super Slimmer v0.1.0

A mobile-first, installable static web app for fast UK food lookup.

## What it does
- Search a small offline starter library of generic foods.
- Search live packaged UK foods through Open Food Facts (no API key).
- Look up a product directly by EAN/UPC barcode.
- Calculate a clearly labelled calorie-based estimate (20 kcal ≈ 1 point, rounded to the nearest 0.5).
- Save a personal confirmed value, portion and note against any product on the device.
- Browse broad food categories.
- Export/import your personal confirmed-value library as JSON.
- Install as a PWA from HTTPS/GitHub Pages.
- Uses BarcodeDetector for camera scanning when the browser supports it; otherwise manual barcode entry works.

## Important design decision
The app does NOT scrape or copy Slimming World's members-only product/value database. Slimming World's terms state that its estimator is for members' personal use and that only Slimming World can designate official values. This project therefore treats any calculated number as an estimate and lets the user record values they have personally confirmed.

## Data sources
- Open Food Facts: open collaborative product/barcode/nutrition database.
- UK CoFID: government food composition dataset, suitable for expanding generic/loose foods.
- Slimming World public website: used only for high-level public plan information/disclaimer context.

## Run locally
Use any local HTTP server, e.g. `python3 -m http.server 8080`, then open `http://localhost:8080`.

## GitHub Pages
Upload all files to the root of a repository (or a `/docs` folder), then enable GitHub Pages. HTTPS enables installability and camera access where supported.
