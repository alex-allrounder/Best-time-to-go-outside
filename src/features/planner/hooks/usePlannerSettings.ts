import { useCallback } from 'react'
import { z } from 'zod'
import { appConfig } from '@/config/app.config'
import type { PlanSettings } from '@/domain/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const hour = z.number().int().min(0).max(24)

const settingsSchema: z.ZodType<PlanSettings> = z.object({
  freeTime: z.object({ startHour: hour, endHour: hour }),
  durationMinutes: z.union([z.literal(30), z.literal(60), z.literal(120), z.literal(180)]),
  activity: z.enum(['active', 'relaxed', 'sun']),
})

export function usePlannerSettings() {
  const [settings, setSettings, resetSettings] = useLocalStorage(
    appConfig.storageKeys.settings,
    settingsSchema,
    appConfig.defaultSettings,
  )

  const update = useCallback(
    (patch: Partial<PlanSettings>) => setSettings((prev) => ({ ...prev, ...patch })),
    [setSettings],
  )

  return { settings, update, resetSettings }
}
