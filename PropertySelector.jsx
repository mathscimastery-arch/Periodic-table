import { PROPERTIES } from '../utils/colorScale.js'
import { interpolateViridis } from 'd3-scale-chromatic'

export default function PropertySelector({ propertyKey, onChange, domain }) {
  const active = PROPERTIES.find((p) => p.key === propertyKey)
  const isSequential = active.mode === 'sequential'

  const gradientStops = Array.from({ length: 12 }, (_, i) => interpolateViridis(i / 11)).join(', ')

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <label htmlFor="property-select" className="font-mono text-xs uppercase tracking-wider text-white/50">
          Map by
        </label>
        <select
          id="property-select"
          value={propertyKey}
          onChange={(e) => onChange(e.target.value)}
          className="rounded border border-line bg-ink-800 px-2 py-1.5 font-mono text-sm text-white/90 focus:outline-none focus:ring-1 focus:ring-white/40"
        >
          {PROPERTIES.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {isSequential && domain && (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-white/50">
            {Number.isFinite(domain[0]) ? domain[0].toLocaleString() : '—'}
          </span>
          <div
            className="h-2.5 w-40 rounded-full"
            style={{ background: `linear-gradient(to right, ${gradientStops})` }}
          />
          <span className="font-mono text-xs text-white/50">
            {Number.isFinite(domain[1]) ? domain[1].toLocaleString() : '—'} {active.unit}
          </span>
        </div>
      )}
    </div>
  )
}
