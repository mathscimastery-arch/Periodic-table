# Advanced interactive periodic table — product & technical spec

## 1. Vision

Ptable.com is comprehensive but visually flat: a static grid, a few overlay colors, and a text-heavy detail panel. The differentiator for this project is **making periodicity visible and explorable in motion**, not just looking it up. Three pillars, in priority order (per your input):

1. **Animated orbitals** — watch electron configuration build up, element by element, in 3D.
2. **Trend heatmaps** — the whole table becomes a live, continuously-colored map of any property, with smooth transitions between properties.
3. **3D views** — a literal third dimension (property-as-height "landscape" table, plus 3D crystal structures) that a flat table can't show.

Everything else (isotopes, comparisons, alternate layouts, search) is real but secondary — scoped into later phases so the first release is small and excellent rather than broad and shallow.

## 2. Core feature specs

### 2.1 Animated orbital viewer

**What it does:** click any element → a 3D panel renders that atom's actual electron configuration as a stack of orbital shells. Each subshell (s, p, d, f) is drawn as a translucent probability-cloud shape, color-coded by shell, with small glowing points representing electrons.

**Interactions:**
- Drag to rotate the atom freely; scroll to zoom.
- "Build" animation: a play button steps through the Aufbau sequence — electrons appear one at a time in filling order (1s → 2s → 2p → 3s...) with a brief highlight and a running configuration string (`1s² 2s² 2p⁴`) typing out underneath.
- Toggle between "shells" view (Bohr-style rings, simpler, good for beginners) and "orbitals" view (actual s/p/d/f cloud shapes, for advanced users).
- Scrub through atomic number with a slider and watch the whole electron structure morph continuously from H to Og — this is the single most differentiating feature versus ptable.com, which has nothing like it.

**Why it matters pedagogically:** most people are told the Aufbau principle and the n+l (Madelung) filling rule as a memorization exercise. Watching it animate removes the memorization — you *see* why 4s fills before 3d.

**Technical approach:** Three.js via `react-three-fiber`. Orbital shapes are precomputed low-poly meshes (not live wavefunction solving — that's overkill and slow) using standard parametric approximations of s/p/d/f angular shapes, scaled per shell. Store one mesh set per orbital type, reused across all elements (just recolored/rescaled), not per-element meshes — keeps the bundle small.

### 2.2 Trend heatmaps

**What it does:** replace the static category colors (alkali metal = purple, noble gas = teal, etc.) with a continuous, chooseable color scale — pick a property from a dropdown (electronegativity, atomic radius, ionization energy, density, melting point, first discovered, abundance in Earth's crust, etc.) and every cell smoothly recolors to reflect that property's value, with a legend gradient bar.

**Interactions:**
- Switching properties triggers a smooth cell-by-cell color transition (CSS/WebGL interpolation, ~400ms), not a hard cut — this makes trends visually "sweep" across the table, which is far more intuitive than reading a chart.
- Hover any cell → exact value + where it ranks (e.g. "3rd highest electronegativity").
- A secondary "trend arrows" overlay (toggleable) draws faint directional arrows across periods/groups showing which way the property generally increases, so beginners get the classic textbook arrows without memorizing them.
- Missing/unmeasured data (common for synthetic superheavy elements) is shown as a distinct hatched pattern, never a misleading default color.

**Technical approach:** table grid stays as SVG/HTML for text-crispness and accessibility; color values driven by a normalized D3 color scale (`d3-scale-chromatic`) computed client-side from the property dataset. This is cheap — no need for a heavy charting library for the grid itself.

### 2.3 3D views

**a) Property-landscape table (the headline 3D feature).**
The standard 2D grid is rendered as a 3D terrain: x/y position stays exactly the group/period grid, and z-height for each cell is driven by whatever property is selected (same dropdown as the heatmap, so heatmap color and 3D height can literally be the same data shown two ways). Free-orbit camera. Example: select "ionization energy" and noble gases visibly rise up as sharp peaks at the right edge of each period — you *see* the trend as topology instead of reading a chart.

**b) Per-element crystal structure viewer.**
For solid elements at room temperature, render the actual unit cell (BCC, FCC, HCP, diamond cubic, etc.) as a small rotatable 3D lattice inside the element detail panel, with atoms as spheres and unit-cell edges as wireframe. This is a real physical fact ptable.com doesn't show interactively at all.

**Technical approach:** same `react-three-fiber` scene infrastructure as the orbital viewer, so there's one 3D rendering layer serving three features (orbitals, landscape, crystal structures) instead of three separate systems.

## 3. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React + Vite | Fast dev loop, huge ecosystem, easy to hand off/extend later |
| 3D rendering | Three.js via `react-three-fiber` + `drei` helpers | Declarative 3D in React; `drei` gives free camera controls, text-in-3D, etc. |
| Heatmap color scales | `d3-scale-chromatic` | Purpose-built perceptually-reasonable color ramps |
| State/data | Static JSON + React Context (no backend needed for v1) | The periodic table doesn't change; no reason to pay for a database yet |
| Styling | Tailwind CSS | Fast iteration, consistent spacing/design tokens |
| Animation | Framer Motion (2D UI) + native Three.js tweening (3D) | Split cleanly: DOM animations vs scene animations |
| Hosting | Static hosting (Vercel/Netlify/Cloudflare Pages) | Whole site is static assets + client-side JS — no server needed for v1 |

No backend is required for the visual-first v1. A backend only becomes worth adding in a later phase if you want accounts, saved comparisons, or an AI Q&A layer.

## 4. Data model

One JSON object per element, e.g.:

```json
{
  "atomicNumber": 8,
  "symbol": "O",
  "name": "Oxygen",
  "category": "reactive-nonmetal",
  "electronConfiguration": ["1s2", "2s2", "2p4"],
  "properties": {
    "electronegativity": 3.44,
    "atomicRadiusPm": 60,
    "ionizationEnergyKjMol": 1313.9,
    "densityGCm3": 0.001429,
    "meltingPointK": 54.36,
    "boilingPointK": 90.19,
    "discoveredYear": 1774,
    "crustAbundancePpm": 461000
  },
  "crystalStructure": { "type": "cubic", "latticeConstantPm": null },
  "isotopes": [
    { "massNumber": 16, "abundancePercent": 99.76, "stable": true },
    { "massNumber": 18, "abundancePercent": 0.20, "stable": true }
  ],
  "oxidationStates": [-2, -1, 1, 2],
  "state": "gas",
  "uses": ["respiration", "combustion", "steel production"]
}
```

**Data sourcing:** no single free source has everything cleanly. Realistic plan:
- Base structural + electron-config data: existing open-source periodic table JSON datasets (several exist on GitHub, MIT/CC-licensed) as a starting skeleton.
- Cross-check and fill gaps (isotopes, crystal structure, oxidation states) from NIST and IUPAC public data.
- Never scrape ptable.com itself or copy its text/layout — build the dataset independently from primary sources to avoid any copying concerns.

## 5. Component architecture

```
<App>
 ├─ <TableView>              — the main grid, switchable between flat/landscape modes
 │   ├─ <ElementCell>        — one cell, color-driven by active property
 │   ├─ <PropertySelector>   — dropdown driving both heatmap color and 3D height
 │   └─ <Landscape3D>        — react-three-fiber scene, only mounted in 3D mode
 ├─ <ElementDetailPanel>     — slide-in panel on cell click
 │   ├─ <OrbitalViewer3D>    — animated electron structure
 │   ├─ <CrystalViewer3D>    — unit cell (solids only)
 │   └─ <PropertyList>       — text data, isotopes table
 └─ <TopBar>                 — search, layout switcher (future phase)
```

Keeping the 3D scenes as separately-mounted components (not always rendered) matters for performance — Three.js scenes are expensive to keep alive when not visible.

## 6. Performance considerations

- Lazy-load the Three.js bundle only when a 3D view is actually opened (dynamic `import()`), so the initial page load for someone who just wants to glance at the table stays fast.
- Reuse geometry/material objects across elements (instancing) rather than creating new meshes per element.
- Debounce the property-switch color transition so rapid dropdown changes don't queue up animations.
- Provide a "reduce motion" toggle that disables the build-up animation and landscape transitions for accessibility and low-power devices.

## 7. Phased roadmap

**Phase 1 — MVP (flat table + heatmap):**
Static grid, category coloring, property-driven heatmap with legend, basic click-through detail panel (text data only, no 3D yet). This alone is already a step up from most static tables and gets something real in front of users fast.

**Phase 2 — Orbital viewer:**
Add the 3D orbital shell/orbital viewer with the build-up animation and atomic-number scrubber.

**Phase 3 — 3D landscape table:**
Add the toggle between flat grid and 3D property-landscape view, reusing the same property selector from Phase 1.

**Phase 4 — Crystal structures + isotopes:**
Per-element unit cell viewer; isotope table with abundance and stability indicators.

**Phase 5 — Breadth features:**
Search/filter, side-by-side element comparison, alternate table layouts (left-step, spiral) as a switchable view, mobile polish, shareable deep links (`/element/oxygen`), accessibility audit.

## 8. Open questions to settle before Phase 1 starts

- **Audience:** built primarily for students learning chemistry, or for a broader science-enthusiast/reference audience? This affects how much explanatory scaffolding (tooltips, "what is electronegativity" info) belongs in the UI versus assuming prior knowledge.
- **Depth of superheavy element data:** elements past ~104 have sparse or predicted-only data for many properties — decide up front how to visually represent "predicted" vs "measured" values so the heatmap and 3D landscape don't silently treat guesses as facts.
- **Monetization/hosting model:** purely free/open project, or eventually something with an account layer — this affects whether Phase 1 architecture should leave room for a backend later.

---

This spec is intentionally ordered so Phase 1 alone is shippable and already differentiated (heatmap alone beats most existing tables), with each phase adding one more of the three visual pillars you prioritized, rather than trying to build all of it before anything is usable.
