import { colorForElement } from '../utils/colorScale.js'

export default function ElementCell({ element, propertyKey, scale, isSelected, onSelect }) {
  const color = colorForElement(element, propertyKey, scale)
  const hasData = color !== null

  const gridColumn = element.seriesIndex !== null ? 4 + element.seriesIndex : element.group
  const gridRow = element.seriesIndex !== null ? (element.category === 'lanthanide' ? 9 : 10) : element.period

  return (
    <button
      onClick={() => onSelect(element)}
      className={`relative flex flex-col justify-between rounded-[3px] p-1 text-left transition-all duration-300 border ${
        isSelected ? 'border-white z-10 scale-105' : 'border-black/20 hover:border-white/60 hover:z-10 hover:scale-105'
      }`}
      style={{
        gridColumn,
        gridRow,
        backgroundColor: hasData ? color : 'transparent',
        backgroundImage: hasData
          ? 'none'
          : 'repeating-linear-gradient(45deg, #1c2431, #1c2431 3px, #141a24 3px, #141a24 6px)',
      }}
      title={`${element.name} (${element.symbol})`}
    >
      <span
        className="font-mono text-[9px] leading-none text-white/90"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.7)' }}
      >
        {element.atomicNumber}
      </span>
      <span
        className="font-display text-[13px] leading-none text-white"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.7)' }}
      >
        {element.symbol}
      </span>
    </button>
  )
}
