import { appConfig } from '@/config/app.config'
import type { DayForecast } from '@/domain/types'
import { buildUrl, getJson } from '@/services/open-meteo/client'
import { toDayForecast } from '@/services/open-meteo/mappers'
import { forecastResponseSchema } from '@/services/open-meteo/schemas'

const HOURLY_FIELDS = [
  'uv_index',
  'precipitation_probability',
  'apparent_temperature',
  'wind_speed_10m',
  'is_day',
].join(',')

export interface Coordinates {
  latitude: number
  longitude: number
}

/** Today's hourly forecast in the location's own timezone. */
export async function fetchForecast(
  { latitude, longitude }: Coordinates,
  signal?: AbortSignal,
): Promise<DayForecast> {
  const url = buildUrl(appConfig.api.forecastUrl, {
    latitude,
    longitude,
    hourly: HOURLY_FIELDS,
    timezone: 'auto',
    forecast_days: 1,
  })
  return toDayForecast(await getJson(url, forecastResponseSchema, signal))
}
