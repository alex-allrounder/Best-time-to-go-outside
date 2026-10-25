import type { Activity, DurationMinutes, PlanSettings } from '@/domain/types'

/** App wiring and defaults. Scoring rules live in rules.ts. */
export const appConfig = {
  api: {
    forecastUrl: 'https://api.open-meteo.com/v1/forecast',
    geocodingUrl: 'https://geocoding-api.open-meteo.com/v1/search',
  },
  forecast: {
    staleTimeMs: 30 * 60 * 1000,
  },
  search: {
    debounceMs: 300,
    minQueryLength: 2,
    maxResults: 6,
  },
  geolocation: {
    timeoutMs: 10_000,
    maximumAgeMs: 10 * 60 * 1000,
  },
  recentPlaces: { max: 5 },
  storageKeys: {
    settings: 'uvgo:v1:settings',
    place: 'uvgo:v1:place',
    recentPlaces: 'uvgo:v1:recent-places',
    theme: 'uvgo:theme',
  },
  durationOptions: [30, 60, 120, 180] satisfies DurationMinutes[],
  activityOptions: ['active', 'relaxed', 'sun'] satisfies Activity[],
  defaultSettings: {
    freeTime: { startHour: 13, endHour: 19 },
    durationMinutes: 60,
    activity: 'relaxed',
  } satisfies PlanSettings,
} as const
