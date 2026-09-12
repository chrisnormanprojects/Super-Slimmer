// Merge supermarket-specific references into the main searchable reference array before app.js starts.
window.SUPER_SLIMMER_REFERENCE_2026 = window.SUPER_SLIMMER_REFERENCE_2026 || [];
for (const r of (window.SUPER_SLIMMER_SUPERMARKETS_2026 || [])) {
  window.SUPER_SLIMMER_REFERENCE_2026.push({
    name: `${r.brand} — ${r.name}`,
    category: r.category,
    status: r.status,
    value: r.value,
    portion: r.portion,
    sourceUrl: r.sourceUrl,
    asOf: r.asOf || '2026-06',
    confidence: r.confidence || 'current-secondary',
    note: r.note || ''
  });
}
