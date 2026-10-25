import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { appConfig } from '@/config/app.config'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { searchPlaces } from '@/services/open-meteo/geocoding'

export function useCitySearch(query: string) {
  const { debounceMs, minQueryLength } = appConfig.search
  const debounced = useDebouncedValue(query.trim(), debounceMs)
  const enabled = debounced.length >= minQueryLength

  const result = useQuery({
    queryKey: ['places', debounced.toLowerCase()],
    queryFn: ({ signal }) => searchPlaces(debounced, signal),
    enabled,
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  })

  return {
    ...result,
    enabled,
    /** True while typing ahead of the debounce or while the request is in flight. */
    isSearching: enabled && (result.isFetching || debounced !== query.trim()),
  }
}
