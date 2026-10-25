import { ArrowRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FreeTime } from '@/domain/types'
import { formatHour } from '@/lib/time'

const START_HOURS = Array.from({ length: 24 }, (_, h) => h)
const END_HOURS = Array.from({ length: 24 }, (_, h) => h + 1)

interface HourSelectProps {
  label: string
  value: number
  hours: number[]
  isDisabled: (hour: number) => boolean
  onChange: (hour: number) => void
}

function HourSelect({ label, value, hours, isDisabled, onChange }: HourSelectProps) {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger
        aria-label={label}
        className="w-full rounded-xl text-base tabular data-[size=default]:h-11"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-72">
        {hours.map((hour) => (
          <SelectItem
            key={hour}
            value={String(hour)}
            disabled={isDisabled(hour)}
            className="py-2 text-base tabular"
          >
            {formatHour(hour)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface FreeTimeRangeProps {
  value: FreeTime
  onChange: (value: FreeTime) => void
}

/** Whole-hour range; the end can never be at or before the start. */
export function FreeTimeRange({ value, onChange }: FreeTimeRangeProps) {
  const { startHour, endHour } = value
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <HourSelect
        label="Free from"
        value={startHour}
        hours={START_HOURS}
        isDisabled={() => false}
        onChange={(start) => onChange({ startHour: start, endHour: Math.max(endHour, start + 1) })}
      />
      <ArrowRight aria-hidden className="size-4 text-muted-foreground" />
      <HourSelect
        label="Free until"
        value={endHour}
        hours={END_HOURS}
        isDisabled={(end) => end <= startHour}
        onChange={(end) => onChange({ startHour, endHour: end })}
      />
    </div>
  )
}
