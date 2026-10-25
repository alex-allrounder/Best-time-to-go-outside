import { z } from 'zod/mini'

const series = z.array(z.nullable(z.number()))

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
  country: z.optional(z.string()),
  admin1: z.optional(z.string()),
})

export type GeocodingResult = z.infer<typeof geocodingResultSchema>

// The API omits `results` entirely when nothing matches.
export const geocodingResponseSchema = z.object({
  results: z._default(z.array(geocodingResultSchema), []),
})
