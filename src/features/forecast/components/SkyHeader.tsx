import { ChevronDown, LoaderCircle, LocateFixed, MapPin, RefreshCw, Search } from 'lucide-react'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { DayPlan, Place, PlanSettings } from '@/domain/types'
import { activityLabels } from '@/features/planner/options'
import { formatDuration, formatHour, formatHourRange } from '@/lib/time'

export type HeadlineState =
  | { kind: 'no-place' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string; onRetry: () => void; retrying: boolean }
  | { kind: 'ready'; plan: DayPlan; nowHour: number }

interface SkyHeaderProps {
  place: Place | null
  settings: PlanSettings
  state: HeadlineState
  locating: boolean
  onOpenSearch: () => void
  onLocate: () => void
}

const onSky = 'text-sky-foreground hover:bg-white/15 hover:text-sky-foreground'

function Headline({
  state,
  settings,
  onOpenSearch,
  onLocate,
  locating,
}: Omit<SkyHeaderProps, 'place'>) {
  const plan = `${formatHourRange(settings.freeTime.startHour, settings.freeTime.endHour)} · ${formatDuration(settings.durationMinutes)} · ${activityLabels[settings.activity]}`

  switch (state.kind) {
    case 'no-place':
      return (
        <div className="flex flex-col gap-4">
          <p className="text-4xl font-semibold tracking-tight text-balance">
            When should you go outside today?
          </p>
          <p className="text-sky-muted">
            Share your location or search a city to find the best time in your free time.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onLocate}
              disabled={locating}
              className="h-11 rounded-full bg-white px-5 text-base text-sky hover:bg-white/90"
            >
              {locating ? (
                <LoaderCircle aria-hidden className="animate-spin" />
              ) : (
                <LocateFixed aria-hidden />
              )}
              Use my location
            </Button>
            <Button
              variant="outline"
              onClick={onOpenSearch}
              className="h-11 rounded-full border-white/60 bg-transparent px-5 text-base text-sky-foreground hover:bg-white/15 hover:text-sky-foreground"
            >
              <Search aria-hidden />
              Search city
            </Button>
          </div>
        </div>
      )

    case 'loading':
      return (
        <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading forecast">
          <Skeleton className="h-14 w-64 bg-white/20" />
          <Skeleton className="h-5 w-48 bg-white/20" />
        </div>
      )

    case 'error':
      return (
        <div className="flex flex-col items-start gap-3" role="alert">
          <p className="text-3xl font-semibold tracking-tight">Forecast unavailable</p>
          <p className="text-sky-muted">{state.message}</p>
          <Button
            onClick={state.onRetry}
            disabled={state.retrying}
            className="h-11 rounded-full bg-white px-5 text-base text-sky hover:bg-white/90"
          >
            <RefreshCw aria-hidden className={state.retrying ? 'animate-spin' : undefined} />
            Try again
          </Button>
        </div>
      )

    case 'ready': {
      const { best } = state.plan
      if (!best) {
        return (
          <div className="flex flex-col gap-1">
            <p className="text-[clamp(2.5rem,12vw,3rem)] leading-tight font-semibold tracking-tight">
              No good time
            </p>
            <p className="text-lg text-sky-muted tabular">{plan}</p>
          </div>
        )
      }
      const start = best.startHour === state.nowHour ? 'Now' : formatHour(best.startHour)
      return (
        <div className="flex flex-col gap-1">
          <p
            key={`${best.startHour}-${best.endHour}`}
            className="animate-in text-[clamp(2.25rem,12.5vw,3.75rem)] leading-none font-semibold tracking-tight whitespace-nowrap tabular duration-500 ease-out fade-in slide-in-from-bottom-1 motion-reduce:animate-none"
          >
            {start}–{formatHour(best.endHour)}
          </p>
          <p className="text-lg">Best time to go outside</p>
          <p className="text-sm text-sky-muted tabular">{plan}</p>
        </div>
      )
    }
  }
}

export function SkyHeader(props: SkyHeaderProps) {
  const { place, onOpenSearch, onLocate, locating } = props

  return (
    <header className="bg-sky pt-[env(safe-area-inset-top)] text-sky-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pt-3 pb-16 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            onClick={onOpenSearch}
            aria-label={place ? `Location: ${place.name}. Change location` : 'Choose a place'}
            className={`-ml-3 h-11 min-w-0 shrink gap-1.5 rounded-full px-3 text-lg font-semibold ${onSky}`}
          >
            <MapPin aria-hidden className="size-5" />
            <span className="truncate">{place?.name ?? 'Choose a place'}</span>
            <ChevronDown aria-hidden className="size-4 opacity-80" />
          </Button>
          <div className="flex shrink-0 items-center">
            {place && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onLocate}
                disabled={locating}
                aria-label="Use my location"
                className={`size-11 rounded-full ${onSky}`}
              >
                {locating ? (
                  <LoaderCircle aria-hidden className="size-5 animate-spin" />
                ) : (
                  <LocateFixed aria-hidden className="size-5" />
                )}
              </Button>
            )}
            <ThemeToggle className={onSky} />
          </div>
        </div>
        <Headline {...props} />
      </div>
    </header>
  )
}
