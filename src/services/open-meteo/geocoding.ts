import { appConfig } from '@/config/app.config'
import type { Place } from '@/domain/types'
import { buildUrl, getJson } from '@/services/open-meteo/client'
import { toPlace } from '@/services/open-meteo/mappers'
import { geocodingResponseSchema } from '@/services/open-meteo/schemas'

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const url = buildUrl(appConfig.api.geocodingUrl, {
    name: query.trim(),
    count: appConfig.search.maxResults,
    language: 'en',
    format: 'json',
  })
  const { results } = await getJson(url, geocodingResponseSchema, signal)
  return results.map(toPlace)
}
