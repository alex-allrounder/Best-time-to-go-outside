import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import type { Place } from '@/domain/types'
import { GeolocationError, useGeolocation } from '@/features/location/hooks/useGeolocation'
import { useSavedPlace } from '@/features/location/hooks/useSavedPlace'

/** Everything the UI needs to pick a place: saved place, recents, geolocation and the search sheet. */
export function useLocationController() {
  const saved = useSavedPlace()
  const { locate, status } = useGeolocation()
  const [sheetOpen, setSheetOpen] = useState(false)
  const { selectPlace } = saved

  const choosePlace = useCallback(
    (place: Place) => {
      selectPlace(place)
      setSheetOpen(false)
    },
    [selectPlace],
  )

  const locateMe = useCallback(async () => {
    try {
      choosePlace(await locate())
    } catch (error) {
      const message = error instanceof GeolocationError ? error.message : 'Something went wrong.'
      // Stable id: repeated taps update one toast instead of stacking duplicates.
      toast.error(message, {
        id: 'geolocation',
        action: { label: 'Search city', onClick: () => setSheetOpen(true) },
      })
    }
  }, [choosePlace, locate])

  return {
    ...saved,
    choosePlace,
    locateMe,
    locating: status === 'locating',
    sheetOpen,
    setSheetOpen,
  }
}

export type LocationController = ReturnType<typeof useLocationController>
