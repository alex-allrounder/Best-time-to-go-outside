import { factors, type ScoreContext } from '@/domain/scoring/factors'
import type { FactorScore, HourForecast } from '@/domain/types'

export interface HourScore {
  score: number
  breakdown: FactorScore[]
}

export function scoreHour(hour: HourForecast, ctx: ScoreContext): HourScore {
  const breakdown = factors.map((factor) => ({
    factor: factor.id,
    value: factor.value(hour),
    points: factor.score(hour, ctx),
  }))
  const score = breakdown.reduce((sum, item) => sum + item.points, 0)
  return { score, breakdown }
}
