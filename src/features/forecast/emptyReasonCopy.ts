import type { EmptyReason, PlanSettings } from '@/domain/types'
import { formatDuration, formatHourRange } from '@/lib/time'

interface EmptyCopy {
  title: string
  description: string
}

/** Plain explanations for why no window could be recommended, with the way out. */
export function emptyReasonCopy(reason: EmptyReason, settings: PlanSettings): EmptyCopy {
  const duration = formatDuration(settings.durationMinutes)
  const range = formatHourRange(settings.freeTime.startHour, settings.freeTime.endHour)

  switch (reason) {
    case 'invalid-free-time':
      return {
        title: 'Check your free time',
        description: 'The end time needs to be after the start time.',
      }
    case 'free-time-too-short':
      return {
        title: `${range} is shorter than ${duration}`,
        description: 'Pick a shorter outing or widen your free time.',
      }
    case 'already-passed':
      return {
        title: `${range} has already passed today`,
        description: 'Move your free time later in the day.',
      }
    case 'no-daylight':
      return {
        title: `It's dark during ${range}`,
        description: 'Dark hours are skipped. Choose free time between sunrise and sunset.',
      }
    case 'no-daylight-left':
      return {
        title: `No daylight left in ${range}`,
        description: 'The sun has set for today. Check again tomorrow or try another place.',
      }
    case 'no-continuous-window':
      return {
        title: `Less than ${duration} of daylight in a row`,
        description: 'Try a shorter outing or free time that starts earlier.',
      }
  }
}
