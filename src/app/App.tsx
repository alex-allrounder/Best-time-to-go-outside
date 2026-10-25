import { Footer } from '@/app/Footer'
import { ChecklistCard } from '@/features/forecast/components/ChecklistCard'
import { DayTimeline } from '@/features/forecast/components/DayTimeline'
import { RunnerUpsCard } from '@/features/forecast/components/RunnerUpsCard'
import { SkyHeader, type HeadlineState } from '@/features/forecast/components/SkyHeader'
import { VerdictCard, VerdictCardSkeleton } from '@/features/forecast/components/VerdictCard'
import { useDayPlan } from '@/features/forecast/hooks/useDayPlan'
import { useForecast } from '@/features/forecast/hooks/useForecast'
import { LocationSheet } from '@/features/location/components/LocationSheet'
import { useLocationController } from '@/features/location/hooks/useLocationController'
import { PlannerCard } from '@/features/planner/components/PlannerCard'
import { usePlannerSettings } from '@/features/planner/hooks/usePlannerSettings'
import { pageContainer } from '@/lib/layout'
import { cn } from '@/lib/utils'

/**
 * Phone: one column (verdict, plan, timeline, what to take, other times).
 * Desktop (lg): the verdict moves into the sky beside the answer, the plan becomes a
 * one-row filter bar, the timeline runs full width, and the two lists sit side by side.
 */
export function App() {
  const location = useLocationController()
  const { settings, update, resetSettings } = usePlannerSettings()
  const forecast = useForecast(location.place)
  const result = useDayPlan(forecast.data, settings)

  let headline: HeadlineState
  if (!location.place) headline = { kind: 'no-place' }
  else if (forecast.isError && !forecast.data)
    headline = {
      kind: 'error',
      message: forecast.error.message,
      onRetry: () => void forecast.refetch(),
      retrying: forecast.isFetching,
    }
  else if (!result) headline = { kind: 'loading' }
  else headline = { kind: 'ready', plan: result.plan, nowHour: result.nowHour }

  let verdict = null
  if (headline.kind === 'ready') verdict = <VerdictCard plan={headline.plan} settings={settings} />
  else if (headline.kind === 'loading') verdict = <VerdictCardSkeleton />

  return (
    <div className="flex min-h-dvh flex-col">
      <SkyHeader
        place={location.place}
        settings={settings}
        state={headline}
        locating={location.locating}
        onOpenSearch={() => location.setSheetOpen(true)}
        onLocate={location.locateMe}
        aside={verdict}
      />

      <main
        className={cn(
          pageContainer,
          '-mt-10 grid flex-1 grid-cols-1 content-start gap-3 pb-6 *:min-w-0 lg:-mt-12 lg:grid-cols-2 lg:gap-4',
        )}
      >
        {verdict && <div className="lg:hidden">{verdict}</div>}
        <PlannerCard
          settings={settings}
          onChange={update}
          onReset={resetSettings}
          className="lg:col-span-2"
        />
        {headline.kind === 'ready' && (
          <>
            <DayTimeline
              hours={headline.plan.hours}
              best={headline.plan.best}
              nowHour={headline.nowHour}
              activity={settings.activity}
              className="lg:col-span-2"
            />
            {headline.plan.best && (
              <>
                <ChecklistCard items={headline.plan.best.checklist} className="lg:self-start" />
                <RunnerUpsCard windows={headline.plan.alternatives} className="lg:self-start" />
              </>
            )}
          </>
        )}
      </main>

      <Footer />
      <LocationSheet
        sheetOpen={location.sheetOpen}
        setSheetOpen={location.setSheetOpen}
        choosePlace={location.choosePlace}
        recentPlaces={location.recentPlaces}
        locateMe={location.locateMe}
        locating={location.locating}
      />
    </div>
  )
}
