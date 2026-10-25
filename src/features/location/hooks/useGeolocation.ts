import { useCallback, useState } from 'react'
import { appConfig } from '@/config/app.config'
import type { Place } from '@/domain/types'

export type GeolocationStatus = 'idle' | 'locating' | 'error'

export class GeolocationError extends Error {
  constructor(
    message: string,
    readonly code: 'unsupported' | 'denied' | 'unavailable' | 'timeout',
  ) {
    super(message)
    this.name = 'GeolocationError'
  }
}

const MESSAGES: Record<number, [string, GeolocationError['code']]> = {
  1: ['Location access was denied. Search for a city instead.', 'denied'],
  2: ['Your location could not be found. Search for a city instead.', 'unavailable'],
  3: ['Finding your location took too long. Try again or search for a city.', 'timeout'],
}

function toPlace({ coords }: GeolocationPosition): Place {
  const latitude = Number(coords.latitude.toFixed(3))
  const longitude = Number(coords.longitude.toFixed(3))
  return {
    id: `geo-${latitude},${longitude}`,
    name: 'My location',
    description: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
    latitude,
    longitude,
    source: 'geolocation',
  }
}

/** Wraps the browser Geolocation API in a promise with friendly error messages. */
export function useGeolocation() {
  const [status, setStatus] = useState<GeolocationStatus>('idle')

  const locate = useCallback(async (): Promise<Place> => {
    if (!('geolocation' in navigator)) {
      setStatus('error')
      throw new GeolocationError('Your browser does not support location access.', 'unsupported')
    }
    setStatus('locating')
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: appConfig.geolocation.timeoutMs,
          maximumAge: appConfig.geolocation.maximumAgeMs,
        }),
      )
      setStatus('idle')
      return toPlace(position)
    } catch (error) {
      setStatus('error')
      const [message, code] = MESSAGES[(error as GeolocationPositionError).code] ?? MESSAGES[2]!
      throw new GeolocationError(message, code)
    }
  }, [])

  return { locate, status }
}
