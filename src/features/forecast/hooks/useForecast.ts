import { useQuery } from '@tanstack/react-query'
import { appConfig } from '@/config/app.config'
import type { Place } from '@/domain/types'
import { fetchForecast } from '@/services/open-meteo/forecast'

export function useForecast(place: Place | null) {
  return useQuery({
    queryKey: ['forecast', place?.latitude, place?.longitude],
    queryFn: ({ signal }) => fetchForecast(place!, signal),
    enabled: place !== null,
    staleTime: appConfig.forecast.staleTimeMs,
    retry: 1,
  })
}
