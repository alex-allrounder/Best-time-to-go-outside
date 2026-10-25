import { Armchair, Footprints, Sun } from 'lucide-react'
import type { Activity, DurationMinutes } from '@/domain/types'
import type { SegmentOption } from '@/features/planner/components/SegmentedControl'

export const durationOptions: readonly SegmentOption<`${DurationMinutes}`>[] = [
  { value: '30', label: '30 min' },
  { value: '60', label: '1 h' },
  { value: '120', label: '2 h' },
  { value: '180', label: '3 h' },
]

export const activityOptions: readonly SegmentOption<Activity>[] = [
  { value: 'active', label: 'Active', icon: Footprints },
  { value: 'relaxed', label: 'Relaxed', icon: Armchair },
  { value: 'sun', label: 'In the sun', icon: Sun },
]

export const activityLabels: Record<Activity, string> = {
  active: 'Active',
  relaxed: 'Relaxed',
  sun: 'Long in the sun',
}
