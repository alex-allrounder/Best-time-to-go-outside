import type { RulesConfig, Verdict } from '@/domain/types'

export function verdictFor(score: number, bands: RulesConfig['verdict']): Verdict {
  if (score < bands.goodBelow) return 'good'
  if (score < bands.okBelow) return 'ok'
  return 'bad'
}
