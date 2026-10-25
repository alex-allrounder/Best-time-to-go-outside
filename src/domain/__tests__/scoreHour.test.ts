import { describe, expect, it } from 'vitest'
import { rules } from '@/config/rules'
import { pointsForBands } from '@/domain/scoring/factors'
import { scoreHour } from '@/domain/scoring/scoreHour'
import type { Activity, FactorId, HourForecast } from '@/domain/types'
import { verdictFor } from '@/domain/verdict'
import { makeHour } from '@/test/factories'

function pointsFor(factor: FactorId, overrides: Partial<HourForecast>, activity: Activity = 'relaxed') {
  const { breakdown } = scoreHour(makeHour(12, overrides), { activity, rules })
  return breakdown.find((b) => b.factor === factor)?.points
}

describe('pointsForBands', () => {
  it('returns 0 below the first band and the highest matching band otherwise', () => {
    const bands = [
      { min: 30, points: 2 },
      { min: 60, points: 5 },
    ]
    expect(pointsForBands(29, bands)).toBe(0)
    expect(pointsForBands(30, bands)).toBe(2)
    expect(pointsForBands(59, bands)).toBe(2)
    expect(pointsForBands(60, bands)).toBe(5)
  })
})

describe('UV factor', () => {
  it.each([
    [0, 0],
    [2, 0],
    [3, 2],
    [5, 2],
    [6, 4],
    [7, 4],
    [8, 6],
    [11, 6],
  ])('UV %i scores %i', (uvIndex, expected) => {
    expect(pointsFor('uv', { uvIndex })).toBe(expected)
  })

  it('multiplies by 1.5 for "Long in the sun"', () => {
    expect(pointsFor('uv', { uvIndex: 5 }, 'sun')).toBe(3)
    expect(pointsFor('uv', { uvIndex: 8 }, 'sun')).toBe(9)
    expect(pointsFor('uv', { uvIndex: 8 }, 'active')).toBe(6)
  })
})

describe('rain factor', () => {
  it.each([
    [29, 0],
    [30, 2],
    [59, 2],
    [60, 5],
    [100, 5],
  ])('%i%% scores %i', (rainChance, expected) => {
    expect(pointsFor('rain', { rainChance })).toBe(expected)
  })
})

describe('temperature factors', () => {
  it('adds +3 at 30°C feels-like, +5 instead for Active', () => {
    expect(pointsFor('heat', { feelsLike: 29 })).toBe(0)
    expect(pointsFor('heat', { feelsLike: 30 }, 'relaxed')).toBe(3)
    expect(pointsFor('heat', { feelsLike: 30 }, 'sun')).toBe(3)
    expect(pointsFor('heat', { feelsLike: 30 }, 'active')).toBe(5)
  })

  it('adds +2 strictly below 0°C feels-like', () => {
    expect(pointsFor('cold', { feelsLike: 0 })).toBe(0)
    expect(pointsFor('cold', { feelsLike: -1 })).toBe(2)
  })
})

describe('wind factor', () => {
  it('adds +3 from 40 km/h', () => {
    expect(pointsFor('wind', { windSpeed: 39 })).toBe(0)
    expect(pointsFor('wind', { windSpeed: 40 })).toBe(3)
  })
})

describe('scoreHour', () => {
  it('sums all factors and reports each one', () => {
    const result = scoreHour(
      makeHour(12, { uvIndex: 6, rainChance: 40, feelsLike: 31, windSpeed: 45 }),
      { activity: 'active', rules },
    )
    expect(result.score).toBe(4 + 2 + 5 + 3)
    expect(result.breakdown.map((b) => b.factor)).toEqual(['uv', 'rain', 'heat', 'cold', 'wind'])
  })
})

describe('verdictFor', () => {
  it.each([
    [0, 'good'],
    [2.9, 'good'],
    [3, 'ok'],
    [5.9, 'ok'],
    [6, 'bad'],
    [12, 'bad'],
  ] as const)('%d → %s', (score, verdict) => {
    expect(verdictFor(score, rules.verdict)).toBe(verdict)
  })
})
