import type { DayForecast, HourForecast, Place } from '@/domain/types'
import type { ForecastResponse, GeocodingResult } from '@/services/open-meteo/schemas'

/** Whole numbers keep scoring consistent with what the UI shows ("UV 3" is scored as 3). */
const whole = (value: number | null | undefined) => Math.round(value ?? 0)

export function toDayForecast(response: ForecastResponse): DayForecast {
  const { hourly } = response
  const hours: HourForecast[] = hourly.time.map((time, i) => ({
    time,
    // Times are location-local ("2026-10-25T13:00"); read the hour from the string
    // instead of `new Date()` so the browser's own timezone never leaks in.
    hour: Number(time.slice(11, 13)),
    uvIndex: whole(hourly.uv_index[i]),
    rainChance: whole(hourly.precipitation_probability[i]),
    feelsLike: whole(hourly.apparent_temperature[i]),
    windSpeed: whole(hourly.wind_speed_10m[i]),
    isDay: hourly.is_day[i] === 1,
  }))

  return {
    timezone: response.timezone,
    utcOffsetSeconds: response.utc_offset_seconds,
    hours,
  }
}

export function toPlace(result: GeocodingResult): Place {
  return {
    id: `geo-${result.id}`,
    name: result.name,
    description: [result.admin1, result.country].filter(Boolean).join(', '),
    latitude: result.latitude,
    longitude: result.longitude,
    source: 'search',
  }
}
