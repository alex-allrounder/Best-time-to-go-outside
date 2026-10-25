import { z } from 'zod'

const series = z.array(z.number().nullable())

export const forecastResponseSchema = z.object({
  timezone: z.string(),
  utc_offset_seconds: z.number(),
  hourly: z.object({
    time: z.array(z.string()),
    uv_index: series,
    precipitation_probability: series,
    apparent_temperature: series,
    wind_speed_10m: series,
    is_day: series,
  }),
})

export type ForecastResponse = z.infer<typeof forecastResponseSchema>

export const geocodingResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string().optional(),
  admin1: z.string().optional(),
})

export type GeocodingResult = z.infer<typeof geocodingResultSchema>

// The API omits `results` entirely when nothing matches.
export const geocodingResponseSchema = z.object({
  results: z.array(geocodingResultSchema).default([]),
})
