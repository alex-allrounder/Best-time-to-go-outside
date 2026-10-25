import { CloudRain, Moon, Sun, Thermometer, Wind, History, type LucideIcon } from 'lucide-react'
import { VerdictBadge } from '@/components/shared/verdict'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { rules } from '@/config/rules'
import type { Activity, FactorId, ScoredHour } from '@/domain/types'
import { activityLabels } from '@/features/planner/options'
import { formatHourRange } from '@/lib/time'

interface MetricRow {
  label: string
  icon: LucideIcon
  value: (h: ScoredHour) => string
  /** Factors whose points this row sums; heat and cold share the feels-like reading. */
  factors: FactorId[]
}

const rows: MetricRow[] = [
  { label: 'UV index', icon: Sun, value: (h) => String(h.uvIndex), factors: ['uv'] },
  { label: 'Rain chance', icon: CloudRain, value: (h) => `${h.rainChance}%`, factors: ['rain'] },
  {
    label: 'Feels like',
    icon: Thermometer,
    value: (h) => `${h.feelsLike}°C`,
    factors: ['heat', 'cold'],
  },
  { label: 'Wind', icon: Wind, value: (h) => `${h.windSpeed} km/h`, factors: ['wind'] },
]

const formatPoints = (points: number) => (points === 0 ? '0' : `+${Number(points.toFixed(1))}`)

interface HourDetailSheetProps {
  hour: ScoredHour | null
  open: boolean
  activity: Activity
  onOpenChange: (open: boolean) => void
}

export function HourDetailSheet({ hour, open, activity, onOpenChange }: HourDetailSheetProps) {
  const uvMultiplier = rules.uv.activityMultiplier[activity]
  const { goodBelow, okBelow } = rules.verdict

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-lg pb-[env(safe-area-inset-bottom)]">
        {hour && (
          <>
            <DrawerHeader className="flex-row items-center justify-between gap-3 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left">
              <div>
                <DrawerTitle className="text-lg tabular">
                  {formatHourRange(hour.hour, hour.hour + 1)}
                </DrawerTitle>
                <DrawerDescription>{activityLabels[activity]}</DrawerDescription>
              </div>
              {hour.verdict && <VerdictBadge verdict={hour.verdict} />}
            </DrawerHeader>

            <div className="flex flex-col gap-4 px-4 pb-6">
              {hour.status !== 'scored' && (
                <p className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-sm">
                  {hour.status === 'dark' ? (
                    <Moon aria-hidden className="size-4" />
                  ) : (
                    <History aria-hidden className="size-4" />
                  )}
                  {hour.status === 'dark'
                    ? 'Dark hours are skipped when finding your best time.'
                    : 'This hour has passed, so it is skipped.'}
                </p>
              )}

              <table className="w-full text-base">
                <caption className="sr-only">Score breakdown</caption>
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="pb-1 text-left font-normal">
                      <span className="sr-only">Condition</span>
                    </th>
                    <th scope="col" className="pb-1 text-right font-normal">
                      Reading
                    </th>
                    <th scope="col" className="pb-1 text-right font-normal">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map(({ label, icon: Icon, value, factors }) => {
                    const points = hour.breakdown
                      .filter((b) => factors.includes(b.factor))
                      .reduce((sum, b) => sum + b.points, 0)
                    return (
                      <tr key={label}>
                        <th scope="row" className="py-3 text-left font-normal">
                          <span className="flex items-center gap-3">
                            <Icon aria-hidden className="size-5 text-muted-foreground" />
                            {label}
                          </span>
                        </th>
                        <td className="py-3 text-right tabular">{value(hour)}</td>
                        <td className="w-16 py-3 text-right font-semibold tabular">
                          {formatPoints(points)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                {hour.score !== null && (
                  <tfoot>
                    <tr className="border-t-2 border-border">
                      <th scope="row" colSpan={2} className="pt-3 text-left font-semibold">
                        Score
                      </th>
                      <td className="pt-3 text-right text-lg font-semibold tabular">
                        {hour.score.toFixed(1)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>

              <p className="text-sm text-pretty text-muted-foreground">
                {uvMultiplier !== 1 &&
                  `UV points count ×${uvMultiplier} for ${activityLabels[activity].toLowerCase()}. `}
                Under {goodBelow} is Good, {goodBelow} to {okBelow - 0.1} is OK with protection,{' '}
                {okBelow} or more is Not recommended.
              </p>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
