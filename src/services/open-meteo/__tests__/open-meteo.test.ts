import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/services/open-meteo/client'
import { fetchForecast } from '@/services/open-meteo/forecast'
import { searchPlaces } from '@/services/open-meteo/geocoding'
import forecastLondon from './fixtures/forecast-london.json'
import geocodingLahore from './fixtures/geocoding-lahore.json'

function mockFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => vi.unstubAllGlobals())

describe('fetchForecast', () => {
  it('requests the hourly fields in the location timezone', async () => {
    const fetchMock = mockFetch(forecastLondon)
    await fetchForecast({ latitude: 51.5, longitude: -0.12 })

    const url = new URL(fetchMock.mock.calls[0]![0] as string)
    expect(url.searchParams.get('timezone')).toBe('auto')
    expect(url.searchParams.get('hourly')).toContain('uv_index')
    expect(url.searchParams.get('forecast_days')).toBe('1')
  })

  it('maps the response to whole-number hours read from local time strings', async () => {
    mockFetch(forecastLondon)
    const forecast = await fetchForecast({ latitude: 51.5, longitude: -0.12 })

    expect(forecast.timezone).toBe('Europe/London')
    expect(forecast.hours).toHaveLength(24)
    forecast.hours.forEach((h, i) => {
      expect(h.hour).toBe(i)
      expect(Number.isInteger(h.uvIndex)).toBe(true)
      expect(Number.isInteger(h.feelsLike)).toBe(true)
    })
    expect(forecast.hours[11]).toMatchObject({ uvIndex: 1, isDay: true })
    expect(forecast.hours[0]).toMatchObject({ isDay: false, rainChance: 100 })
  })

  it('treats null values as 0', async () => {
    const withNull = structuredClone(forecastLondon)
    ;(withNull.hourly.uv_index as (number | null)[])[12] = null
    mockFetch(withNull)
    const forecast = await fetchForecast({ latitude: 51.5, longitude: -0.12 })
    expect(forecast.hours[12]?.uvIndex).toBe(0)
  })

  it('surfaces the API error reason', async () => {
    mockFetch({ error: true, reason: 'Latitude must be in range of -90 to 90°.' }, 400)
    await expect(fetchForecast({ latitude: 999, longitude: 0 })).rejects.toThrow(
      'Latitude must be in range',
    )
  })

  it('rejects malformed responses', async () => {
    mockFetch({ hourly: {} })
    await expect(fetchForecast({ latitude: 0, longitude: 0 })).rejects.toBeInstanceOf(ApiError)
  })
})

describe('searchPlaces', () => {
  it('maps results to places with a readable description', async () => {
    mockFetch(geocodingLahore)
    const [first] = await searchPlaces('lahore')
    expect(first).toEqual({
      id: 'geo-1172451',
      name: 'Lahore',
      description: 'Punjab, Pakistan',
      latitude: 31.558,
      longitude: 74.35071,
      source: 'search',
    })
  })

  it('returns an empty list when the API omits results', async () => {
    mockFetch({ generationtime_ms: 0.05 })
    await expect(searchPlaces('zzqqxx')).resolves.toEqual([])
  })
})
