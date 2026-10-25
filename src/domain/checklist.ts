import type { Activity, ChecklistItem, RulesConfig, WindowStats } from '@/domain/types'

export function buildChecklist(
  stats: WindowStats,
  activity: Activity,
  checklist: RulesConfig['checklist'],
): ChecklistItem[] {
  return checklist
    .filter((rule) => rule.when({ stats, activity }))
    .map(({ id, label, detail }) => ({ id, label, detail }))
}
