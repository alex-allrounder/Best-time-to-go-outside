import { describe, expect, it } from 'vitest'
import { rules } from '@/config/rules'
import { buildChecklist } from '@/domain/checklist'
import { buildReason } from '@/domain/reason'
import { scoreHours } from '@/domain/planDay'
import { computeWindowStats } from '@/domain/stats'
import type { Activity, HourForecast, WindowStats } from '@/domain/types'
import { makeHour } from '@/test/factories'

const calm: WindowStats = {
  maxUv: 1,
  maxRainChance: 0,
  maxFeelsLike: 18,
  minFeelsLike: 18,
  maxWindSpeed: 10,
}

function checklistIds(stats: Partial<WindowStats>, activity: Activity = 'relaxed') {
  return buildChecklist({ ...calm, ...stats }, activity, rules.checklist).map((c) => c.id)
}

describe('buildChecklist', () => {
  it('is empty for calm weather and a relaxed outing', () => {
    expect(checklistIds({})).toEqual([])
  })

  it.each([
    [{ maxUv: 3 }, ['sunscreen']],
    [{ maxUv: 6 }, ['sunscreen', 'hat-sunglasses']],
    [{ maxRainChance: 30 }, ['rain-jacket']],
    [{ maxFeelsLike: 25 }, ['water']],
    [{ minFeelsLike: 4 }, ['warm-layer']],
    [{ minFeelsLike: 5 }, []],
  ] as const)('%o → %o', (stats, expected) => {
    expect(checklistIds(stats)).toEqual(expected)
  })

  it('always suggests water for Active', () => {
    expect(checklistIds({}, 'active')).toEqual(['water'])
  })
})

function reasonFor(hours: HourForecast[], activity: Activity = 'relaxed') {
  const settings = {
    freeTime: { startHour: 0, endHour: 24 },
    durationMinutes: 60 as const,
    activity,
  }
  const scored = scoreHours(hours, settings, null, rules)
  return buildReason(scored, computeWindowStats(hours), rules.reasons)
}

describe('buildReason', () => {
  it('says conditions are comfortable when nothing costs points', () => {
    expect(reasonFor([makeHour(12)])).toBe('Low UV, dry and comfortable')
  })

  it('names the costliest factors first', () => {
    expect(reasonFor([makeHour(12, { uvIndex: 3, rainChance: 70 })])).toBe(
      '70% chance of rain · UV 3, use sunscreen',
    )
  })

  it('mentions at most two factors', () => {
    const hour = makeHour(12, { uvIndex: 9, rainChance: 70, windSpeed: 50 })
    expect(reasonFor([hour])).toBe('UV 9, avoid direct sun · 70% chance of rain')
  })

  it('uses the extreme value across the window', () => {
    const hours = [makeHour(12, { uvIndex: 4 }), makeHour(13, { uvIndex: 7 })]
    expect(reasonFor(hours)).toBe('UV 7, cover up and use sunscreen')
  })
})
