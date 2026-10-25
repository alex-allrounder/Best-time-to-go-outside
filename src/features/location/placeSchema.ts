import { z } from 'zod'
import type { Place } from '@/domain/types'

export const placeSchema: z.ZodType<Place> = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  source: z.enum(['search', 'geolocation']),
})
