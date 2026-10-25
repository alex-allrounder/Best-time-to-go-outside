import { factors } from '@/domain/scoring/factors'
import type { FactorId, RulesConfig, ScoredHour, WindowStats } from '@/domain/types'

/**
 * One-line explanation for a window: names the factors that cost the most points,
 * e.g. "UV 5, use sunscreen · 40% chance of rain".
 */
export function buildReason(
  hours: readonly ScoredHour[],
  stats: WindowStats,
  reasons: RulesConfig['reasons'],
): string {
  const totals = new Map<FactorId, number>()
  for (const hour of hours) {
    for (const { factor, points } of hour.breakdown) {
      totals.set(factor, (totals.get(factor) ?? 0) + points)
    }
  }

  // Array.sort is stable, so equal totals keep registry order.
  const top = factors
    .map((f) => ({ id: f.id, points: totals.get(f.id) ?? 0 }))
    .filter((f) => f.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, reasons.maxParts)

  if (top.length === 0) return reasons.none
  return top.map((f) => reasons.factors[f.id](stats)).join(' · ')
}
