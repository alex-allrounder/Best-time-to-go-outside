import { ListOrdered } from 'lucide-react'
import { SectionCard } from '@/components/shared/SectionCard'
import { verdictMeta } from '@/components/shared/verdictMeta'
import type { TimeWindow } from '@/domain/types'
import { formatHourRange } from '@/lib/time'
import { cn } from '@/lib/utils'

export function RunnerUpsCard({
  windows,
  className,
}: {
  windows: TimeWindow[]
  className?: string
}) {
  return (
    <SectionCard title="Other good times" icon={ListOrdered} className={className}>
      {windows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No other window fits your free time without overlapping the best one.
        </p>
      ) : (
        <ul className="-my-2 divide-y divide-border">
          {windows.map((w) => {
            const { icon: Icon, label, text } = verdictMeta[w.verdict]
            return (
              <li key={w.startHour} className="flex items-center gap-3 py-3">
                <Icon aria-hidden className={cn('size-5 shrink-0', text)} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="font-semibold tabular">
                    {formatHourRange(w.startHour, w.endHour)}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    <span className="sr-only">{label}. </span>
                    {w.reason}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground tabular">{w.score.toFixed(1)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}
