import { CalendarClock, Moon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SectionCard } from '@/components/shared/SectionCard'
import { verdictMeta } from '@/components/shared/verdictMeta'
import type { Activity, ScoredHour, TimeWindow } from '@/domain/types'
import { HourDetailSheet } from '@/features/forecast/components/HourDetailSheet'
import { formatHour } from '@/lib/time'
import { cn } from '@/lib/utils'

/** Fixed column width so the free-time band and best-window ring can be positioned exactly. */
const CELL_PX = 52

function describeHour(h: ScoredHour, isNow: boolean): string {
  const time = isNow ? `Now, ${formatHour(h.hour)}` : formatHour(h.hour)
  const free = h.inFreeTime ? ', in your free time' : ''
  if (h.status === 'past') return `${time}, already passed`
  if (h.status === 'dark') return `${time}, dark${free}`
  return `${time}, ${verdictMeta[h.verdict!].label}, UV ${h.uvIndex}${free}. Show details`
}

function HourCell({
  hour,
  isNow,
  inBest,
  onSelect,
}: {
  hour: ScoredHour
  isNow: boolean
  inBest: boolean
  onSelect: () => void
}) {
  const meta = hour.verdict ? verdictMeta[hour.verdict] : null
  const Icon = meta?.icon

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={describeHour(hour, isNow)}
      style={{ width: CELL_PX }}
      className={cn(
        'group relative z-10 flex shrink-0 flex-col items-center gap-2 rounded-2xl py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring',
        hour.status === 'past' && 'opacity-45',
      )}
    >
      <span
        className={cn(
          'text-xs tabular',
          isNow || inBest ? 'font-semibold text-foreground' : 'text-muted-foreground',
        )}
      >
        {isNow ? 'Now' : String(hour.hour).padStart(2, '0')}
      </span>
      <span
        aria-hidden
        className={cn(
          'grid h-14 w-9 place-items-center rounded-full transition-transform duration-150 ease-out group-active:scale-[0.94]',
          meta && `${meta.fill} ring-1 ring-black/10 ring-inset`,
          hour.status === 'dark' &&
            'border border-dashed border-muted-foreground/50 text-muted-foreground',
          hour.status === 'past' && 'bg-muted',
        )}
      >
        {Icon && <Icon className="size-4" strokeWidth={2.5} />}
        {hour.status === 'dark' && <Moon className="size-4" />}
      </span>
      <span className="text-xs text-muted-foreground tabular">
        {hour.status === 'scored' ? `UV ${hour.uvIndex}` : '–'}
      </span>
    </button>
  )
}

function Legend() {
  const item = 'flex items-center gap-1.5'
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
      {(['good', 'ok', 'bad'] as const).map((v) => {
        const { icon: Icon, label, fill } = verdictMeta[v]
        return (
          <li key={v} className={item}>
            <span className={cn('grid size-4 place-items-center rounded-full', fill)}>
              <Icon aria-hidden className="size-2.5" strokeWidth={3} />
            </span>
            {label}
          </li>
        )
      })}
      <li className={item}>
        <Moon aria-hidden className="size-4" />
        Dark
      </li>
      <li className={item}>
        <span aria-hidden className="h-3 w-5 rounded-sm bg-plan" />
        Your free time
      </li>
      <li className={item}>
        <span aria-hidden className="h-3 w-5 rounded-sm ring-2 ring-foreground ring-inset" />
        Best time
      </li>
    </ul>
  )
}

interface DayTimelineProps {
  hours: ScoredHour[]
  best: TimeWindow | null
  nowHour: number
  activity: Activity
  className?: string
}

export function DayTimeline({ hours, best, nowHour, activity, className }: DayTimelineProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<ScoredHour | null>(null)
  // Kept separate from `selected` so the sheet keeps its content while it animates closed.
  const [sheetOpen, setSheetOpen] = useState(false)

  const indexOf = (hour: number) => hours.findIndex((h) => h.hour === hour)
  const freeIndexes = hours.flatMap((h, i) => (h.inFreeTime ? [i] : []))
  const freeStart = freeIndexes[0]
  const bestStart = best ? indexOf(best.startHour) : -1
  const bestLength = best ? best.endHour - best.startHour : 0

  // Bring the best window into view whenever the answer changes; without one, show the free
  // time so its dark or past hours explain why.
  const focusIndex = bestStart >= 0 ? bestStart : (freeStart ?? Math.max(0, indexOf(nowHour)))
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const span = (bestStart >= 0 ? bestLength : Math.min(freeIndexes.length, 4)) * CELL_PX
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({
      left: Math.max(0, focusIndex * CELL_PX - (el.clientWidth - span) / 2),
      behavior: reduce ? 'auto' : 'smooth',
    })
  }, [focusIndex, bestStart, bestLength, freeIndexes.length])

  return (
    <SectionCard title="Today, hour by hour" icon={CalendarClock} className={className}>
      <div
        ref={scrollerRef}
        className="-mx-4 scrollbar-none overflow-x-auto overscroll-x-contain px-4 sm:-mx-5 sm:px-5"
      >
        <div className="relative flex" style={{ width: hours.length * CELL_PX }}>
          {freeStart !== undefined && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 rounded-2xl bg-plan"
              style={{ left: freeStart * CELL_PX, width: freeIndexes.length * CELL_PX }}
            />
          )}
          {bestStart >= 0 && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 z-20 rounded-2xl ring-2 ring-foreground transition-[left,width] duration-300 ease-out ring-inset motion-reduce:transition-none"
              style={{ left: bestStart * CELL_PX, width: bestLength * CELL_PX }}
            />
          )}
          {hours.map((h, i) => (
            <HourCell
              key={h.time}
              hour={h}
              isNow={h.hour === nowHour}
              inBest={bestStart >= 0 && i >= bestStart && i < bestStart + bestLength}
              onSelect={() => {
                setSelected(h)
                setSheetOpen(true)
              }}
            />
          ))}
        </div>
      </div>
      <Legend />
      <HourDetailSheet
        hour={selected}
        open={sheetOpen}
        activity={activity}
        onOpenChange={setSheetOpen}
      />
    </SectionCard>
  )
}
