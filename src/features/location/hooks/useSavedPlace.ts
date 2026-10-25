import { z } from 'zod/mini'
import { appConfig } from '@/config/app.config'
import type { Place } from '@/domain/types'
import { placeSchema } from '@/features/location/placeSchema'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const savedPlaceSchema = z.nullable(placeSchema)
const recentPlacesSchema = z.array(placeSchema)
const NO_PLACES: Place[] = []

/** The selected place plus a short most-recent-first list of searched cities. */
export function useSavedPlace() {
  const { storageKeys, recentPlaces: recentConfig } = appConfig
  const [place, setPlaceState] = useLocalStorage(storageKeys.place, savedPlaceSchema, null)
  const [recentPlaces, setRecentPlaces] = useLocalStorage(
    storageKeys.recentPlaces,
    recentPlacesSchema,
    NO_PLACES,
  )

  const selectPlace = (next: Place) => {
    setPlaceState(next)
    // "My location" changes with every fix, so only searched cities are worth remembering.
    if (next.source !== 'search') return
    setRecentPlaces((prev) =>
      [next, ...prev.filter((p) => p.id !== next.id)].slice(0, recentConfig.max),
    )
  }

  const clearRecentPlaces = () => setRecentPlaces(NO_PLACES)

  return { place, selectPlace, recentPlaces, clearRecentPlaces }
}
