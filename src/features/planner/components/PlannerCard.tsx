import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { SectionCard } from '@/components/shared/SectionCard'
import { Button } from '@/components/ui/button'
import { appConfig } from '@/config/app.config'
import type { DurationMinutes, PlanSettings } from '@/domain/types'
import { FreeTimeRange } from '@/features/planner/components/FreeTimeRange'
import { SegmentedControl } from '@/features/planner/components/SegmentedControl'
import { activityOptions, durationOptions } from '@/features/planner/options'

function Field({ label, children }: { label: string; children: ReactNode }) {
  const id = useId()
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-2">
      <span id={id} className="text-sm font-medium">
        {label}
      </span>
      {children}
    </div>
  )
}

interface PlannerCardProps {
  settings: PlanSettings
  onChange: (patch: Partial<PlanSettings>) => void
  onReset: () => void
  className?: string
}

export function PlannerCard({ settings, onChange, onReset, className }: PlannerCardProps) {
  const isDefault = JSON.stringify(settings) === JSON.stringify(appConfig.defaultSettings)

  return (
    <SectionCard
      title="Your plan"
      icon={SlidersHorizontal}
      className={className}
      action={
        !isDefault && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="-my-1 h-8 text-muted-foreground"
          >
            <RotateCcw aria-hidden />
            Reset
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Free time">
          <FreeTimeRange
            value={settings.freeTime}
            onChange={(freeTime) => onChange({ freeTime })}
          />
        </Field>
        <Field label="How long">
          <SegmentedControl
            label="How long"
            value={`${settings.durationMinutes}`}
            options={durationOptions}
            onChange={(v) => onChange({ durationMinutes: Number(v) as DurationMinutes })}
          />
        </Field>
        <Field label="Activity">
          <SegmentedControl
            label="Activity"
            value={settings.activity}
            options={activityOptions}
            onChange={(activity) => onChange({ activity })}
          />
        </Field>
      </div>
    </SectionCard>
  )
}
