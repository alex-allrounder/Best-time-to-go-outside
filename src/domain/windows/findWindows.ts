import { buildChecklist } from '@/domain/checklist'
import { buildReason } from '@/domain/reason'
import { computeWindowStats } from '@/domain/stats'
import type { Activity, PlanSettings, RulesConfig, ScoredHour, TimeWindow } from '@/domain/types'
import { verdictFor } from '@/domain/verdict'
import { mean, roundTo } from '@/lib/number'

/** Forecast data is hourly, so a 30-minute outing still occupies one hourly slot. */
export function windowLengthHours(durationMinutes: number): number {
  return Math.max(1, Math.ceil(durationMinutes / 60))
}

export function buildWindow(
  hours: ScoredHour[],
  activity: Activity,
  rules: RulesConfig,
): TimeWindow {
  const scores = hours.map((h) => h.score ?? 0)
  // Round before judging so the shown score and its colour always agree.
  const score = roundTo(mean(scores), 1)
  const stats = computeWindowStats(hours)
  const first = hours[0]
  const last = hours[hours.length - 1]
  if (!first || !last) throw new Error('A window needs at least one hour')

  return {
    startHour: first.hour,
    endHour: last.hour + 1,
    hours,
    score,
    peakScore: Math.max(...scores),
    verdict: verdictFor(score, rules.verdict),
    reason: buildReason(hours, stats, rules.reasons),
    checklist: buildChecklist(stats, activity, rules.checklist),
    stats,
  }
}

/** Every window of the requested length inside free time where all hours are scorable. */
export function buildCandidateWindows(
  hours: readonly ScoredHour[],
  settings: PlanSettings,
  rules: RulesConfig,
): TimeWindow[] {
  const byHour = new Map(hours.map((h) => [h.hour, h]))
  const length = windowLengthHours(settings.durationMinutes)
  const { startHour, endHour } = settings.freeTime
  const windows: TimeWindow[] = []

  for (let start = startHour; start + length <= endHour; start++) {
    const slice: ScoredHour[] = []
    for (let h = start; h < start + length; h++) {
      const hour = byHour.get(h)
      if (!hour || hour.status !== 'scored') break
      slice.push(hour)
    }
    if (slice.length === length) windows.push(buildWindow(slice, settings.activity, rules))
  }
  return windows
}

/** Lower average first, then the less extreme worst hour, then the earlier start. */
export function compareWindows(a: TimeWindow, b: TimeWindow): number {
  return a.score - b.score || a.peakScore - b.peakScore || a.startHour - b.startHour
}

function overlaps(a: TimeWindow, b: TimeWindow): boolean {
  return a.startHour < b.endHour && b.startHour < a.endHour
}

/** Best window plus runner-ups that don't overlap anything already picked. */
export function pickWindows(
  candidates: readonly TimeWindow[],
  maxAlternatives: number,
): { best: TimeWindow | null; alternatives: TimeWindow[] } {
  const picked: TimeWindow[] = []
  for (const window of [...candidates].sort(compareWindows)) {
    if (picked.length > maxAlternatives) break
    if (picked.every((p) => !overlaps(p, window))) picked.push(window)
  }
  const [best = null, ...alternatives] = picked
  return { best, alternatives }
}
