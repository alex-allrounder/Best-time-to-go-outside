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
import { Footer } from '@/app/Footer'

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

  const planner = (
    <PlannerCard
      settings={settings}
      onChange={update}
      onReset={resetSettings}
      className={
        headline.kind === 'ready' || headline.kind === 'loading'
          ? 'md:col-start-2 md:row-span-2 md:row-start-1 md:self-start'
          : 'md:col-span-2'
      }
    />
  )

  return (
    <div className="flex min-h-dvh flex-col">
      <SkyHeader
        place={location.place}
        settings={settings}
        state={headline}
        locating={location.locating}
        onOpenSearch={() => location.setSheetOpen(true)}
        onLocate={location.locateMe}
      />

      <main className="mx-auto -mt-10 grid w-full max-w-3xl flex-1 grid-cols-1 content-start gap-3 px-4 pb-6 *:min-w-0 sm:px-6 md:grid-cols-2 md:gap-4">
        {headline.kind === 'ready' && (
          <>
            <VerdictCard
              plan={headline.plan}
              settings={settings}
              className="md:col-start-1 md:row-start-1"
            />
            {planner}
            <DayTimeline
              hours={headline.plan.hours}
              best={headline.plan.best}
              nowHour={headline.nowHour}
              activity={settings.activity}
              className="md:col-span-2"
            />
            {headline.plan.best && (
              <>
                <ChecklistCard
                  items={headline.plan.best.checklist}
                  className="md:col-start-1 md:row-start-2"
                />
                <RunnerUpsCard windows={headline.plan.alternatives} className="md:col-span-2" />
              </>
            )}
          </>
        )}
        {headline.kind === 'loading' && (
          <>
            <VerdictCardSkeleton />
            {planner}
          </>
        )}
        {(headline.kind === 'no-place' || headline.kind === 'error') && planner}
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
