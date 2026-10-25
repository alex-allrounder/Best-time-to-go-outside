import { useMemo } from 'react'
import { rules } from '@/config/rules'
import { planDay } from '@/domain/planDay'
import type { DayForecast, DayPlan, PlanSettings } from '@/domain/types'
import { useNow } from '@/hooks/useNow'
import { hourAtOffset } from '@/lib/time'

export interface DayPlanResult {
  plan: DayPlan
  /** Current hour at the forecast location. */
  nowHour: number
}

/** Recomputes instantly when settings change; the forecast is fetched once per place. */
export function useDayPlan(
  forecast: DayForecast | undefined,
  settings: PlanSettings,
): DayPlanResult | null {
  const now = useNow()
  const nowHour = forecast ? hourAtOffset(forecast.utcOffsetSeconds, now) : null

  return useMemo(() => {
    if (!forecast || nowHour === null) return null
    return { plan: planDay({ hours: forecast.hours, settings, nowHour, rules }), nowHour }
  }, [forecast, settings, nowHour])
}
