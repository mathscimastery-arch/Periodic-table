import { useMemo, useState } from 'react'
import elements from './data/elements.json'
import TableGrid from './components/TableGrid.jsx'
import PropertySelector from './components/PropertySelector.jsx'
import ElementDetailPanel from './components/ElementDetailPanel.jsx'
import { buildScale, computeDomain } from './utils/colorScale.js'

export default function App() {
  const [propertyKey, setPropertyKey] = useState('category')
  const [selectedElement, setSelectedElement] = useState(null)

  const domain = useMemo(() => {
    if (propertyKey === 'category') return null
    return computeDomain(elements, propertyKey)
  }, [propertyKey])

  const scale = useMemo(() => (domain ? buildScale(domain) : null), [domain])

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 sm:px-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">118 elements, mapped live</p>
        <h1 className="font-display text-3xl sm:text-4xl">Elements</h1>
      </header>

      <PropertySelector propertyKey={propertyKey} onChange={setPropertyKey} domain={domain} />

      <TableGrid
        elements={elements}
        propertyKey={propertyKey}
        scale={scale}
        selectedElement={selectedElement}
        onSelect={setSelectedElement}
      />

      <footer className="font-mono text-xs text-white/30">
        Phase 1 of 5 — flat grid + property heatmap. Animated orbitals, the 3D landscape view, and crystal
        structures arrive in later phases per the project spec.
      </footer>

      <ElementDetailPanel element={selectedElement} onClose={() => setSelectedElement(null)} />
    </div>
  )
}
