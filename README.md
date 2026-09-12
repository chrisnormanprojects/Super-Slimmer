# Super Slimmer v0.6.0

A mobile-first, installable UK food-reference app.

## Current catalogue
- Generic Free Food and Speed Food reference library.
- 198 current 2026 category-reference records from public independent sources.
- 117 supermarket-specific June 2026 references covering Tesco, Aldi, Lidl, ASDA, Morrisons and Sainsbury’s.
- Curated branded references with source dates and confidence labels.
- Historical supermarket/magazine records kept separate and visibly marked for rechecking.
- Live Open Food Facts search and barcode lookup for products not yet in the curated catalogue.

## Classification model
Each record can be Free Food, Speed Free Food, Healthy Extra, Swips, or Needs Checking. Secondary references carry source URLs and dates. Historical values are never presented as current. The calorie ÷ 20 shorthand remains only as a fallback and never determines Free/Healthy Extra status.

## Supermarket data
The June 2026 supermarket layer currently covers Tesco, Aldi, Lidl, ASDA, Morrisons and Sainsbury’s. Product recipes and plan values can change, so these records are labelled `current-secondary` and should be checked in the official member app when accuracy is critical.

## Main sources
- Public Slimming World guidance for plan structure and current 2026 terminology.
- She Cooks She Eats 2026 food/category pages for current secondary references.
- SWLads June 2026 supermarket lists and current Free/Speed lists.
- Open Food Facts for live barcode/product/nutrition data.
- Historical Slimming World magazine material for legacy discovery records only.

## Important design decision
The app does not scrape or bypass Slimming World's members-only database. Super Slimmer is an independent personal reference tool and clearly identifies secondary and historical information.

## Files
- `index.html` — app shell and data load order
- `app.js` — main search/classification logic
- `reference-data.js` — expanded current 2026 reference catalogue
- `supermarket-data.js` — supermarket-specific June 2026 records
- `supermarket-bridge.js` — merges supermarket records into the searchable catalogue
- `styles.css` — UI
- `sw.js` — offline cache/service worker

The service-worker cache is `super-slimmer-v6`.
