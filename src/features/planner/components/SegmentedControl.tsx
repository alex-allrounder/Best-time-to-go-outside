import type { LucideIcon } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

export interface SegmentOption<T extends string> {
  value: T
  label: string
  icon?: LucideIcon
}

interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  options: readonly SegmentOption<T>[]
  onChange: (value: T) => void
  className?: string
}

/** iOS-style single-choice control built on the shadcn ToggleGroup. Always keeps one value selected. */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <ToggleGroup
      type="single"
      aria-label={label}
      value={value}
      // Radix emits "" when the active item is pressed again; ignore it so a value is always set.
      onValueChange={(next) => next && onChange(next as T)}
      spacing={0}
      className={cn('grid w-full auto-cols-fr grid-flow-col rounded-xl bg-muted p-1', className)}
    >
      {options.map(({ value: optionValue, label: optionLabel, icon: Icon }) => (
        <ToggleGroupItem
          key={optionValue}
          value={optionValue}
          className="h-10 min-w-0 rounded-lg! px-2 text-sm text-muted-foreground transition-[color,background-color,box-shadow,scale] duration-150 ease-out hover:bg-transparent hover:text-foreground active:scale-[0.97] data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-sm"
        >
          {Icon && <Icon aria-hidden className="size-4 max-[380px]:hidden" />}
          <span className="truncate">{optionLabel}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
