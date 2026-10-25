import type { Activity, Band, FactorId, HourForecast, RulesConfig } from '@/domain/types'

export interface ScoreContext {
  activity: Activity
  rules: RulesConfig
}

export interface ScoreFactor {
  id: FactorId
  label: string
  unit: string
  value: (hour: HourForecast) => number
  score: (hour: HourForecast, ctx: ScoreContext) => number
}

/** Points of the highest band whose `min` is <= value. Bands must be ascending. */
export function pointsForBands(value: number, bands: readonly Band[]): number {
  let points = 0
  for (const band of bands) {
    if (value >= band.min) points = band.points
  }
  return points
}

/**
 * Registry of everything that costs points. To add a factor (e.g. air quality),
 * add an entry here, its thresholds in rules.ts and a reason template.
 * Order matters: it breaks ties when choosing which factor the reason line mentions.
 */
export const factors: readonly ScoreFactor[] = [
  {
    id: 'uv',
    label: 'UV index',
    unit: '',
    value: (h) => h.uvIndex,
    score: (h, { activity, rules }) =>
      pointsForBands(h.uvIndex, rules.uv.bands) * rules.uv.activityMultiplier[activity],
  },
  {
    id: 'rain',
    label: 'Rain chance',
    unit: '%',
    value: (h) => h.rainChance,
    score: (h, { rules }) => pointsForBands(h.rainChance, rules.rain.bands),
  },
  {
    id: 'heat',
    label: 'Heat',
    unit: '°C',
    value: (h) => h.feelsLike,
    score: (h, { activity, rules }) =>
      h.feelsLike >= rules.heat.minFeelsLike ? rules.heat.points[activity] : 0,
  },
  {
    id: 'cold',
    label: 'Cold',
    unit: '°C',
    value: (h) => h.feelsLike,
    score: (h, { rules }) => (h.feelsLike < rules.cold.belowFeelsLike ? rules.cold.points : 0),
  },
  {
    id: 'wind',
    label: 'Wind',
    unit: ' km/h',
    value: (h) => h.windSpeed,
    score: (h, { rules }) => (h.windSpeed >= rules.wind.minSpeedKmh ? rules.wind.points : 0),
  },
]

export const factorById = Object.fromEntries(factors.map((f) => [f.id, f])) as Record<
  FactorId,
  ScoreFactor
>
