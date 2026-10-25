import {
  Backpack,
  Check,
  GlassWater,
  Glasses,
  Shirt,
  SprayCan,
  Umbrella,
  type LucideIcon,
} from 'lucide-react'
import { SectionCard } from '@/components/shared/SectionCard'
import type { ChecklistItem } from '@/domain/types'

// Keyed by the checklist ids in rules.ts; a new rule without an icon falls back to a check.
const icons: Record<string, LucideIcon> = {
  sunscreen: SprayCan,
  'hat-sunglasses': Glasses,
  'rain-jacket': Umbrella,
  water: GlassWater,
  'warm-layer': Shirt,
}

export function ChecklistCard({
  items,
  className,
}: {
  items: ChecklistItem[]
  className?: string
}) {
  return (
    <SectionCard title="What to take" icon={Backpack} className={className}>
      {items.length === 0 ? (
        <p className="flex items-center gap-3 text-sm text-muted-foreground">
          <Check aria-hidden className="size-5" />
          Nothing extra needed. Enjoy it.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map(({ id, label, detail }) => {
            const Icon = icons[id] ?? Check
            return (
              <li key={id} className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-primary">
                  <Icon aria-hidden className="size-5" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">{label}</span>
                  <span className="text-sm text-muted-foreground">{detail}</span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}
