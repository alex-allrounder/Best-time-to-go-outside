import { CalendarX2 } from 'lucide-react'
import { StatusMessage } from '@/components/shared/StatusMessage'
import { VerdictBadge } from '@/components/shared/verdict'
import { Skeleton } from '@/components/ui/skeleton'
import type { DayPlan, PlanSettings } from '@/domain/types'
import { emptyReasonCopy } from '@/features/forecast/emptyReasonCopy'
import { cn } from '@/lib/utils'

const cardClass = 'rounded-3xl bg-card p-5 text-card-foreground shadow-card'

interface VerdictCardProps {
  plan: DayPlan
  settings: PlanSettings
  className?: string
}

export function VerdictCard({ plan, settings, className }: VerdictCardProps) {
  const { best, emptyReason } = plan

  if (!best) {
    const copy = emptyReasonCopy(emptyReason ?? 'no-continuous-window', settings)
    return (
      <section aria-label="Result" className={cn(cardClass, className)}>
        <StatusMessage icon={CalendarX2} title={copy.title} description={copy.description} />
      </section>
    )
  }

  return (
    <section aria-label="Verdict" aria-live="polite" className={cn(cardClass, className)}>
      {/* Keyed so the one authored motion moment replays when the answer changes. */}
      <div
        key={`${best.startHour}-${best.verdict}-${best.reason}`}
        className="flex animate-in flex-col gap-3 duration-500 ease-out fade-in slide-in-from-bottom-1 motion-reduce:animate-none"
      >
        <div className="flex items-center justify-between gap-3">
          <VerdictBadge verdict={best.verdict} size="lg" />
          <span className="text-sm text-muted-foreground tabular">
            Score {best.score.toFixed(1)}
          </span>
        </div>
        <p className="text-lg leading-snug font-medium text-pretty">{best.reason}</p>
        <p className="text-sm text-muted-foreground">
          Lower scores are better. Tap an hour below to see why.
        </p>
      </div>
    </section>
  )
}

export function VerdictCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(cardClass, 'flex flex-col gap-3', className)} aria-hidden>
      <Skeleton className="h-8 w-40 rounded-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}
