import type { HourForecast, WindowStats } from '@/domain/types'

export function computeWindowStats(hours: readonly HourForecast[]): WindowStats {
  const pick = (fn: (h: HourForecast) => number) => hours.map(fn)
  return {
    maxUv: Math.max(...pick((h) => h.uvIndex)),
    maxRainChance: Math.max(...pick((h) => h.rainChance)),
    maxFeelsLike: Math.max(...pick((h) => h.feelsLike)),
    minFeelsLike: Math.min(...pick((h) => h.feelsLike)),
    maxWindSpeed: Math.max(...pick((h) => h.windSpeed)),
  }
}
