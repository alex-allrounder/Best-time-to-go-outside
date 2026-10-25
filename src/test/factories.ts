import type { HourForecast } from '@/domain/types'

/** A mild, dry, daytime hour that scores 0 unless overridden. */
export function makeHour(hour: number, overrides: Partial<HourForecast> = {}): HourForecast {
  return {
    time: `2026-06-01T${String(hour).padStart(2, '0')}:00`,
    hour,
    uvIndex: 1,
    rainChance: 0,
    feelsLike: 18,
    windSpeed: 10,
    isDay: hour >= 6 && hour < 21,
    ...overrides,
  }
}

/** 24 hours; `overrides` maps an hour to the fields that differ from the default. */
export function makeDay(overrides: Record<number, Partial<HourForecast>> = {}): HourForecast[] {
  return Array.from({ length: 24 }, (_, h) => makeHour(h, overrides[h]))
}
