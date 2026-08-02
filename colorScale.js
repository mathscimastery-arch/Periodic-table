import { scaleSequential } from 'd3-scale'
import { interpolateViridis } from 'd3-scale-chromatic'

// Properties available in the heatmap dropdown.
// key must match a field inside element.properties in elements.json
export const PROPERTIES = [
  { key: 'category', label: 'Category (default)', unit: '', mode: 'categorical' },
  { key: 'electronegativity', label: 'Electronegativity', unit: '(Pauling)', mode: 'sequential' },
  { key: 'atomicRadiusPm', label: 'Atomic radius', unit: 'pm', mode: 'sequential' },
  { key: 'ionizationEnergyKjMol', label: 'Ionization energy', unit: 'kJ/mol', mode: 'sequential' },
  { key: 'densityGCm3', label: 'Density', unit: 'g/cm³', mode: 'sequential' },
  { key: 'meltingPointK', label: 'Melting point', unit: 'K', mode: 'sequential' },
  { key: 'boilingPointK', label: 'Boiling point', unit: 'K', mode: 'sequential' },
  { key: 'discoveredYear', label: 'Year discovered', unit: '', mode: 'sequential' },
]

// Fixed palette for the default categorical view.
// Chosen as a desaturated set that still separates clearly against the dark background.
export const CATEGORY_COLORS = {
  'alkali-metal': '#e0757a',
  'alkaline-earth-metal': '#e0a557',
  'transition-metal': '#63a9d6',
  'post-transition-metal': '#63c2b0',
  metalloid: '#a4c968',
  'reactive-nonmetal': '#7fd48c',
  'noble-gas': '#b78ee0',
  lanthanide: '#e087b8',
  actinide: '#e0648e',
  unknown: '#5a6474',
}

export function categoryColor(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.unknown
}

// Compute [min, max] for a numeric property across all elements, ignoring nulls.
export function computeDomain(elements, propertyKey) {
  const values = elements
    .map((el) => el.properties[propertyKey])
    .filter((v) => v !== null && v !== undefined)
  return [Math.min(...values), Math.max(...values)]
}

// Returns a function (value) => hex color, built once per property/domain.
export function buildScale(domain) {
  return scaleSequential(interpolateViridis).domain(domain)
}

export function colorForElement(element, propertyKey, scale) {
  if (propertyKey === 'category') {
    return categoryColor(element.category)
  }
  const value = element.properties[propertyKey]
  if (value === null || value === undefined) {
    return null // caller should render the "no data" hatch pattern
  }
  return scale(value)
}
