import { History, LoaderCircle, LocateFixed, MapPin, SearchX, WifiOff } from 'lucide-react'
import { useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { appConfig } from '@/config/app.config'
import type { Place } from '@/domain/types'
import { useCitySearch } from '@/features/location/hooks/useCitySearch'
import type { LocationController } from '@/features/location/hooks/useLocationController'

const itemClass = 'min-h-12 gap-3 rounded-xl px-3 py-2.5 text-base'

function PlaceItem({
  place,
  icon: Icon,
  onSelect,
}: {
  place: Place
  icon: typeof MapPin
  onSelect: (place: Place) => void
}) {
  return (
    <CommandItem value={place.id} onSelect={() => onSelect(place)} className={itemClass}>
      <Icon aria-hidden className="size-5 text-muted-foreground" />
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{place.name}</span>
        {place.description && (
          <span className="truncate text-sm text-muted-foreground">{place.description}</span>
        )}
      </span>
    </CommandItem>
  )
}

type LocationSheetProps = Pick<
  LocationController,
  'sheetOpen' | 'setSheetOpen' | 'choosePlace' | 'recentPlaces' | 'locateMe' | 'locating'
>

export function LocationSheet({
  sheetOpen,
  setSheetOpen,
  choosePlace,
  recentPlaces,
  locateMe,
  locating,
}: LocationSheetProps) {
  const [query, setQuery] = useState('')
  const search = useCitySearch(query)
  const results = search.data ?? []
  const typing = query.trim().length >= appConfig.search.minQueryLength

  const handleOpenChange = (open: boolean) => {
    setSheetOpen(open)
    if (!open) setQuery('')
  }

  return (
    <Drawer open={sheetOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="mx-auto max-w-lg pb-[env(safe-area-inset-bottom)]">
        <DrawerHeader className="group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left">
          <DrawerTitle className="text-lg">Choose a place</DrawerTitle>
          <DrawerDescription>Search for a city or use where you are now.</DrawerDescription>
        </DrawerHeader>

        <Command shouldFilter={false} className="h-[min(60dvh,28rem)] bg-transparent px-3 pb-3">
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search city"
            aria-label="Search city"
            autoComplete="off"
            enterKeyHint="search"
          />
          <CommandList className="mt-2 max-h-none flex-1">
            {!typing && (
              <>
                <CommandGroup>
                  <CommandItem
                    value="use-my-location"
                    onSelect={locateMe}
                    disabled={locating}
                    className={itemClass}
                  >
                    {locating ? (
                      <LoaderCircle aria-hidden className="size-5 animate-spin text-primary" />
                    ) : (
                      <LocateFixed aria-hidden className="size-5 text-primary" />
                    )}
                    <span className="font-medium text-primary">
                      {locating ? 'Finding your location…' : 'Use my location'}
                    </span>
                  </CommandItem>
                </CommandGroup>
                {recentPlaces.length > 0 && (
                  <CommandGroup heading="Recent">
                    {recentPlaces.map((place) => (
                      <PlaceItem
                        key={place.id}
                        place={place}
                        icon={History}
                        onSelect={choosePlace}
                      />
                    ))}
                  </CommandGroup>
                )}
              </>
            )}

            {typing && search.isError && (
              <div className="flex items-center gap-3 px-3 py-6 text-sm text-muted-foreground">
                <WifiOff aria-hidden className="size-5" />
                Search is unavailable right now. Check your connection.
              </div>
            )}

            {typing && !search.isError && results.length > 0 && (
              <CommandGroup heading="Results">
                {results.map((place) => (
                  <PlaceItem key={place.id} place={place} icon={MapPin} onSelect={choosePlace} />
                ))}
              </CommandGroup>
            )}

            {typing && search.isSearching && results.length === 0 && (
              <div className="flex items-center gap-3 px-3 py-6 text-sm text-muted-foreground">
                <LoaderCircle aria-hidden className="size-5 animate-spin" />
                Searching…
              </div>
            )}

            {typing && !search.isSearching && !search.isError && (
              <CommandEmpty className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                <SearchX aria-hidden className="size-5" />
                No places match “{query.trim()}”.
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </DrawerContent>
    </Drawer>
  )
}
