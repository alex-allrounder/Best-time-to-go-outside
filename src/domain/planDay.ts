import { scoreHour } from '@/domain/scoring/scoreHour'
import type {
  DayPlan,
  EmptyReason,
  FreeTime,
  HourForecast,
  HourStatus,
  PlanSettings,
  RulesConfig,
  ScoredHour,
} from '@/domain/types'
import { verdictFor } from '@/domain/verdict'
import { buildCandidateWindows, pickWindows, windowLengthHours } from '@/domain/windows/findWindows'

export interface PlanDayInput {
  hours: readonly HourForecast[]
  settings: PlanSettings
  /** Current hour at the location; earlier hours are excluded. Null disables the check. */
  nowHour: number | null
  rules: RulesConfig
}

export function isValidFreeTime({ startHour, endHour }: FreeTime): boolean {
  return (
    Number.isInteger(startHour) &&
    Number.isInteger(endHour) &&
    startHour >= 0 &&
    endHour <= 24 &&
    endHour > startHour
  )
}

function statusOf(hour: HourForecast, nowHour: number | null): HourStatus {
  if (nowHour !== null && hour.hour < nowHour) return 'past'
  if (!hour.isDay) return 'dark'
  return 'scored'
}

export function scoreHours(
  hours: readonly HourForecast[],
  settings: PlanSettings,
  nowHour: number | null,
  rules: RulesConfig,
): ScoredHour[] {
  const { startHour, endHour } = settings.freeTime
  return hours.map((hour) => {
    const status = statusOf(hour, nowHour)
    const { score, breakdown } = scoreHour(hour, { activity: settings.activity, rules })
    const counts = status === 'scored'
    return {
      ...hour,
      status,
      score: counts ? score : null,
      verdict: counts ? verdictFor(score, rules.verdict) : null,
      breakdown,
      inFreeTime: hour.hour >= startHour && hour.hour < endHour,
    }
  })
}

function explainEmpty(hours: readonly ScoredHour[]): EmptyReason {
  const free = hours.filter((h) => h.inFreeTime)
  const upcoming = free.filter((h) => h.status !== 'past')
  if (free.length > 0 && upcoming.length === 0) return 'already-passed'
  if (upcoming.every((h) => h.status === 'dark')) {
    // Daylight existed earlier in the free time but the sun has set since.
    return free.some((h) => h.status === 'past' && h.isDay) ? 'no-daylight-left' : 'no-daylight'
  }
  return 'no-continuous-window'
}

/** Scores every hour of the day and finds the best time window inside the user's free time. */
export function planDay({ hours, settings, nowHour, rules }: PlanDayInput): DayPlan {
  const scored = scoreHours(hours, settings, nowHour, rules)
  const empty = (emptyReason: EmptyReason): DayPlan => ({
    hours: scored,
    best: null,
    alternatives: [],
    emptyReason,
  })

  const { freeTime } = settings
  if (!isValidFreeTime(freeTime)) return empty('invalid-free-time')
  if (windowLengthHours(settings.durationMinutes) > freeTime.endHour - freeTime.startHour) {
    return empty('free-time-too-short')
  }

  const candidates = buildCandidateWindows(scored, settings, rules)
  const { best, alternatives } = pickWindows(candidates, rules.windows.maxAlternatives)
  if (!best) return empty(explainEmpty(scored))

  return { hours: scored, best, alternatives, emptyReason: null }
}
