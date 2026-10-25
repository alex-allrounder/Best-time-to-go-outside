import { useState } from 'react'
import { appConfig } from '@/config/app.config'
import type { Place } from '@/domain/types'

export type GeolocationStatus = 'idle' | 'locating' | 'error'

export type GeolocationErrorCode = 'unsupported' | 'denied' | 'unavailable' | 'timeout'

export class GeolocationError extends Error {
  readonly code: GeolocationErrorCode

  constructor(message: string, code: GeolocationErrorCode) {
    super(message)
    this.name = 'GeolocationError'
    this.code = code
  }
}

const MESSAGES: Record<number, [string, GeolocationErrorCode]> = {
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

  const locate = async (): Promise<Place> => {
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
  }

  return { locate, status }
}
