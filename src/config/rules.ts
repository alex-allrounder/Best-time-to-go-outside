import type { RulesConfig } from '@/domain/types'

/**
 * Every scoring rule, threshold and verdict band in one place.
 * The domain logic reads nothing else, so tuning the app means editing this file only.
 *
 * Scores are "penalty points": lower is better.
 */

const UV_MODERATE = 3
const UV_HIGH = 6
const UV_VERY_HIGH = 8
const RAIN_LIKELY = 30
const HOT_FEELS_LIKE = 30
const WARM_FEELS_LIKE = 25
const CHILLY_FEELS_LIKE = 5
const FREEZING_FEELS_LIKE = 0
const WINDY_KMH = 40

export const rules = {
  uv: {
    // The highest band whose `min` is <= the UV index applies. Keep bands ascending.
    bands: [
      { min: 0, points: 0 },
      { min: UV_MODERATE, points: 2 },
      { min: UV_HIGH, points: 4 },
      { min: UV_VERY_HIGH, points: 6 },
    ],
    activityMultiplier: { active: 1, relaxed: 1, sun: 1.5 },
  },

  rain: {
    bands: [
      { min: 0, points: 0 },
      { min: RAIN_LIKELY, points: 2 },
      { min: 60, points: 5 },
    ],
  },

  // Applies when feels-like >= minFeelsLike. Active replaces the default +3 with +5.
  heat: { minFeelsLike: HOT_FEELS_LIKE, points: { active: 5, relaxed: 3, sun: 3 } },

  // Applies when feels-like is strictly below the threshold.
  cold: { belowFeelsLike: FREEZING_FEELS_LIKE, points: 2 },

  wind: { minSpeedKmh: WINDY_KMH, points: 3 },

  // Bands are contiguous so averages like 2.5 or 5.4 always land somewhere:
  // good: score < 3 · ok: 3 <= score < 6 · bad: score >= 6
  verdict: { goodBelow: 3, okBelow: 6 },

  windows: { maxAlternatives: 2 },

  // Evaluated over the chosen window: max UV / rain / feels-like and min feels-like.
  checklist: [
    {
      id: 'sunscreen',
      label: 'Sunscreen',
      detail: 'SPF 30+, reapply every 2 hours',
      when: ({ stats }) => stats.maxUv >= UV_MODERATE,
    },
    {
      id: 'hat-sunglasses',
      label: 'Hat and sunglasses',
      detail: 'Shade your face and eyes',
      when: ({ stats }) => stats.maxUv >= UV_HIGH,
    },
    {
      id: 'rain-jacket',
      label: 'Rain jacket',
      detail: 'Showers are possible',
      when: ({ stats }) => stats.maxRainChance >= RAIN_LIKELY,
    },
    {
      id: 'water',
      label: 'Water',
      detail: 'Stay hydrated',
      when: ({ stats, activity }) => activity === 'active' || stats.maxFeelsLike >= WARM_FEELS_LIKE,
    },
    {
      id: 'warm-layer',
      label: 'Warm layer',
      detail: 'It will feel chilly',
      when: ({ stats }) => stats.minFeelsLike < CHILLY_FEELS_LIKE,
    },
  ],

  reasons: {
    // The reason line names the factors that cost the most points, up to this many.
    maxParts: 2,
    factors: {
      uv: ({ maxUv }) =>
        maxUv >= UV_VERY_HIGH
          ? `UV ${maxUv}, avoid direct sun`
          : maxUv >= UV_HIGH
            ? `UV ${maxUv}, cover up and use sunscreen`
            : `UV ${maxUv}, use sunscreen`,
      rain: ({ maxRainChance }) => `${maxRainChance}% chance of rain`,
      heat: ({ maxFeelsLike }) => `Feels like ${maxFeelsLike}°C`,
      cold: ({ minFeelsLike }) => `Feels like ${minFeelsLike}°C, dress warm`,
      wind: ({ maxWindSpeed }) => `Wind up to ${maxWindSpeed} km/h`,
    },
    none: 'Low UV, dry and comfortable',
  },
} satisfies RulesConfig
