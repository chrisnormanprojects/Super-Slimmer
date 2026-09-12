# Super Slimmer v0.5.0

A mobile-first, installable UK food-reference app.

## What it does
- Searches a built-in reference catalogue covering Free Food, Speed Free Food, Healthy Extras, current secondary Swip references and clearly flagged historical values.
- Adds 198 current 2026 category-reference records across sauces, dairy, cereals, drinks, snacks, treats, spreads, meat/fish and alcohol.
- Includes curated branded references with source dates and confidence labels.
- Keeps historical values separate and visibly marked for rechecking.
- Searches live packaged UK foods through Open Food Facts with no API key.
- Looks up products by EAN/UPC barcode.
- Lets the user save a personally confirmed classification, value, portion and note on-device.
- Exports/imports the personal saved library as JSON.
- Works as a PWA on GitHub Pages.

## Data model
Every non-personal reference carries a classification and provenance. Current independent sources are labelled `current-secondary`; older material is labelled `historical`. Historical values are never presented as current.

The calorie ÷ 20 shorthand remains only as a clearly labelled fallback. It does not decide Free Food, Speed Food or Healthy Extra status.

## Main sources
- Public Slimming World guidance for broad plan structure and Free/Healthy Extra information.
- She Cooks She Eats 2026 category and product pages for current secondary reference values.
- SWLads for current Free/Speed reference lists.
- Historical Slimming World magazine material for legacy discovery records only.
- Open Food Facts for live barcode/product/nutrition data.
- UK CoFID for future generic-food nutrition expansion.

## Important design decision
The app does not scrape or bypass Slimming World's members-only database. Slimming World states that only it can designate official values. Super Slimmer therefore identifies secondary and historical information clearly and lets users store values they have personally confirmed.

## Files
- `index.html` — app shell
- `app.js` — main search/classification logic
- `reference-data.js` — expanded 2026 public-reference catalogue
- `styles.css` — UI
- `sw.js` — offline cache/service worker

## GitHub Pages
Serve the repository root with GitHub Pages. The service-worker cache is currently `super-slimmer-v5` so existing installs refresh to the expanded catalogue.
