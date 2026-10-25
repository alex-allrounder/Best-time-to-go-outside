import { describe, expect, it } from 'vitest'
import { rules } from '@/config/rules'
import { planDay } from '@/domain/planDay'
import type { HourForecast, PlanSettings } from '@/domain/types'
import { makeDay } from '@/test/factories'

const base: PlanSettings = {
  freeTime: { startHour: 13, endHour: 19 },
  durationMinutes: 60,
  activity: 'relaxed',
}

function plan(
  overrides: Record<number, Partial<HourForecast>> = {},
  settings: Partial<PlanSettings> = {},
  nowHour: number | null = null,
) {
  return planDay({ hours: makeDay(overrides), settings: { ...base, ...settings }, nowHour, rules })
}

describe('planDay', () => {
  it('picks the lowest-scoring hour inside free time', () => {
    const result = plan({
      13: { uvIndex: 7 },
      14: { uvIndex: 6 },
      15: { uvIndex: 4 },
      16: { uvIndex: 1, rainChance: 10 },
      17: { uvIndex: 3 },
      18: { uvIndex: 3 },
      // Better than anything, but outside free time:
      9: { uvIndex: 0 },
    })
    expect(result.best?.startHour).toBe(16)
    expect(result.best?.endHour).toBe(17)
    expect(result.best?.verdict).toBe('good')
  })

  it('averages the hours of a multi-hour window and rounds to one decimal', () => {
    // Window 13–16: UV 6,6,3 → points 4,4,2 → avg 3.33 → 3.3
    const result = plan(
      { 13: { uvIndex: 6 }, 14: { uvIndex: 6 }, 15: { uvIndex: 3 }, 16: { uvIndex: 6 } },
      { freeTime: { startHour: 13, endHour: 17 }, durationMinutes: 180 },
    )
    expect(result.best?.startHour).toBe(13)
    expect(result.best?.score).toBe(3.3)
    expect(result.best?.verdict).toBe('ok')
  })

  it('treats a 30-minute outing as one hourly slot', () => {
    const result = plan({}, { durationMinutes: 30 })
    expect(result.best && result.best.endHour - result.best.startHour).toBe(1)
  })

  it('breaks ties by the less extreme worst hour, then the earlier start', () => {
    // 2-hour windows (points): 13→[4,0] 14→[0,4] 15→[4,2] 16→[2,2]
    // 13, 14 and 16 all average 2; 16 has the mildest worst hour, 13 beats 14 by starting earlier.
    const result = plan(
      {
        13: { uvIndex: 6 },
        14: { uvIndex: 1 },
        15: { uvIndex: 6 },
        16: { uvIndex: 3 },
        17: { uvIndex: 3 },
      },
      { freeTime: { startHour: 13, endHour: 18 }, durationMinutes: 120 },
    )
    expect(result.best?.startHour).toBe(16)
    expect(result.alternatives.map((w) => w.startHour)).toEqual([13])
  })

  it('returns runner-ups that do not overlap the best window', () => {
    const result = plan({}, { durationMinutes: 120 })
    const all = [result.best!, ...result.alternatives]
    expect(all).toHaveLength(3)
    expect(all.map((w) => w.startHour)).toEqual([13, 15, 17])
  })

  it('excludes dark hours', () => {
    const result = plan({}, { freeTime: { startHour: 19, endHour: 23 } })
    expect(result.hours.find((h) => h.hour === 22)?.status).toBe('dark')
    expect(result.best?.startHour).toBe(19)
    expect(result.alternatives.map((w) => w.startHour)).toEqual([20])
  })

  it('excludes hours that have already passed', () => {
    const result = plan({}, {}, 16)
    expect(result.hours.find((h) => h.hour === 15)?.status).toBe('past')
    expect(result.best?.startHour).toBe(16)
  })

  it('judges the "Long in the sun" activity more strictly', () => {
    const sunny = { 13: { uvIndex: 5 }, 14: { uvIndex: 5 } }
    const free = { freeTime: { startHour: 13, endHour: 15 }, durationMinutes: 120 as const }
    expect(plan(sunny, { ...free, activity: 'relaxed' }).best?.verdict).toBe('good')
    expect(plan(sunny, { ...free, activity: 'sun' }).best?.verdict).toBe('ok')
  })

  it('builds a reason and checklist for the chosen window', () => {
    const result = plan(
      { 13: { uvIndex: 5, rainChance: 40, feelsLike: 26 } },
      { freeTime: { startHour: 13, endHour: 14 } },
    )
    expect(result.best?.reason).toBe('UV 5, use sunscreen · 40% chance of rain')
    expect(result.best?.checklist.map((c) => c.id)).toEqual(['sunscreen', 'rain-jacket', 'water'])
  })

  describe('empty states', () => {
    it('flags invalid free time', () => {
      expect(plan({}, { freeTime: { startHour: 15, endHour: 15 } }).emptyReason).toBe(
        'invalid-free-time',
      )
    })

    it('flags free time shorter than the duration', () => {
      const result = plan({}, { freeTime: { startHour: 13, endHour: 14 }, durationMinutes: 120 })
      expect(result.emptyReason).toBe('free-time-too-short')
    })

    it('flags free time that has already passed', () => {
      expect(plan({}, {}, 20).emptyReason).toBe('already-passed')
    })

    it('flags free time with no daylight', () => {
      expect(plan({}, { freeTime: { startHour: 21, endHour: 24 } }).emptyReason).toBe(
        'no-daylight',
      )
    })

    it('flags daylight that is too short for the duration', () => {
      const result = plan({}, { freeTime: { startHour: 19, endHour: 24 }, durationMinutes: 180 })
      expect(result.emptyReason).toBe('no-continuous-window')
    })
  })
})
