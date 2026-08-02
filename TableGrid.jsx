import ElementCell from './ElementCell.jsx'

export default function TableGrid({ elements, propertyKey, scale, selectedElement, onSelect }) {
  return (
    <div
      className="grid gap-[3px]"
      style={{
        gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
        gridTemplateRows: 'repeat(10, minmax(0, 1fr))',
      }}
    >
      {elements.map((el) => (
        <ElementCell
          key={el.atomicNumber}
          element={el}
          propertyKey={propertyKey}
          scale={scale}
          isSelected={selectedElement?.atomicNumber === el.atomicNumber}
          onSelect={onSelect}
        />
      ))}
      {/* Row 8 is left as a visual gap between the main table and the f-block rows below */}
      <div style={{ gridColumn: '1 / span 3', gridRow: 9 }} className="flex items-center px-1 font-mono text-[10px] text-white/30">
        57–71
      </div>
      <div style={{ gridColumn: '1 / span 3', gridRow: 10 }} className="flex items-center px-1 font-mono text-[10px] text-white/30">
        89–103
      </div>
    </div>
  )
}
