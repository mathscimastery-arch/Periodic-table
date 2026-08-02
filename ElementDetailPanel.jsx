import { categoryColor } from '../utils/colorScale.js'

const FIELD_LABELS = {
  electronegativity: ['Electronegativity', ''],
  atomicRadiusPm: ['Atomic radius', 'pm'],
  ionizationEnergyKjMol: ['Ionization energy', 'kJ/mol'],
  densityGCm3: ['Density', 'g/cm\u00b3'],
  meltingPointK: ['Melting point', 'K'],
  boilingPointK: ['Boiling point', 'K'],
  discoveredYear: ['Discovered', ''],
}

export default function ElementDetailPanel({ element, onClose }) {
  const open = Boolean(element)

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-30 h-full w-full max-w-sm overflow-y-auto border-l border-line bg-ink-900 p-6 transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        {element && (
          <>
            <button
              onClick={onClose}
              className="mb-6 font-mono text-xs uppercase tracking-wider text-white/50 hover:text-white"
            >
              ← Close
            </button>

            <div
              className="mb-4 flex h-20 w-20 items-center justify-center rounded-lg"
              style={{ backgroundColor: categoryColor(element.category) }}
            >
              <span className="font-display text-3xl text-black/85">{element.symbol}</span>
            </div>

            <h2 className="font-display text-2xl">{element.name}</h2>
            <p className="mb-6 font-mono text-sm text-white/50">
              Z = {element.atomicNumber} · {element.category.replace(/-/g, ' ')}
            </p>

            <dl className="mb-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4 font-mono text-sm">
              <dt className="text-white/50">Atomic mass</dt>
              <dd>{element.atomicMass}</dd>
              <dt className="text-white/50">State (STP)</dt>
              <dd className="capitalize">{element.state}</dd>
              <dt className="text-white/50">Block</dt>
              <dd className="uppercase">{element.block}</dd>
              <dt className="text-white/50">Period / group</dt>
              <dd>
                {element.period} / {element.group ?? '—'}
              </dd>
            </dl>

            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-white/50">
              Electron configuration
            </h3>
            <p className="mb-6 rounded bg-ink-800 px-3 py-2 font-mono text-sm">
              {element.electronConfiguration}
            </p>

            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-white/50">Properties</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 font-mono text-sm">
              {Object.entries(FIELD_LABELS).map(([key, [label, unit]]) => {
                const value = element.properties[key]
                return (
                  <div key={key} className="contents">
                    <dt className="text-white/50">{label}</dt>
                    <dd>{value !== null && value !== undefined ? `${value} ${unit}`.trim() : '— unmeasured'}</dd>
                  </div>
                )
              })}
            </dl>

            <p className="mt-8 text-xs text-white/30">
              3D orbital viewer and isotope data arrive in phase 2 of the roadmap.
            </p>
          </>
        )}
      </aside>
    </>
  )
}
