# Elements — advanced interactive periodic table

Phase 1 of the roadmap in `periodic-table-website-spec.md`: a flat 118-element
grid with a live, continuous property heatmap, replacing static category
colors with any measurable property on demand.

## Running it

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build a static production bundle (deployable to Vercel/Netlify/Cloudflare
Pages/any static host, no backend needed):

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

## Project structure

```
periodic-table-app/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # top-level state: selected property, selected element
    ├── index.css                # Tailwind + base styles
    ├── data/
    │   └── elements.json        # all 118 elements, generated from primary sources
    ├── components/
    │   ├── TableGrid.jsx         # CSS-grid layout of all element cells
    │   ├── ElementCell.jsx       # single cell, colored by active property
    │   ├── PropertySelector.jsx  # dropdown + live gradient legend
    │   └── ElementDetailPanel.jsx# slide-in panel with full element data
    └── utils/
        └── colorScale.js         # category palette + d3 sequential scales for heatmap
```

## Design notes

- **No fixed accent color.** The only saturated color in the UI comes from
  the data itself — the heatmap gradient — everything else (background,
  chrome, text) stays graphite/near-black. This was a deliberate choice so
  the visualization is always the most colorful thing on screen, not a brand
  accent competing with it.
- **Typeface roles:** Fjalla One (condensed display) for headings and
  element symbols, IBM Plex Mono for all numeric/data values, Inter for
  body copy. The mono face is doing real work here — it's what makes columns
  of atomic data feel tabular and precise rather than like generic UI text.
- **Missing data is never silently defaulted.** Elements without a measured
  value for the selected property (mostly synthetic superheavy elements)
  render with a diagonal hatch pattern instead of a color, so the heatmap
  never implies false precision.

## Known gaps in `elements.json`

A few values for elements past atomic number 103 are marked `null` because
they are not reliably measured (only predicted or entirely unknown) as of
this writing — density, melting point, and boiling point in particular are
missing or highly uncertain for several transactinides. This is intentional;
do not backfill these with guessed numbers without labeling them as
predictions in the UI (see the roadmap's "predicted vs. measured" open
question).

## Next phases (see spec doc)

2. Animated 3D orbital viewer (`react-three-fiber`) with an Aufbau build-up
   animation and atomic-number scrubber.
3. 3D property-landscape table view, reusing the same property selector.
4. Per-element crystal structure viewer + isotope table.
5. Search, comparison mode, alternate layouts (left-step, spiral), mobile
   polish, shareable deep links.
