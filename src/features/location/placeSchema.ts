import { z } from 'zod/mini'
import type { Place } from '@/domain/types'

export const placeSchema: z.ZodMiniType<Place> = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  latitude: z.number().check(z.gte(-90), z.lte(90)),
  longitude: z.number().check(z.gte(-180), z.lte(180)),
  source: z.enum(['search', 'geolocation']),
})
