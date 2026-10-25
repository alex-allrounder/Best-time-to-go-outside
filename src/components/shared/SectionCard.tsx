import type { LucideIcon } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title: string
  icon: LucideIcon
  /** Optional control on the right of the header, e.g. a reset button. */
  action?: ReactNode
  className?: string
  children: ReactNode
}

/** A weather-app module: rounded card with a small icon heading. */
export function SectionCard({ title, icon: Icon, action, className, children }: SectionCardProps) {
  const headingId = useId()
  return (
    <section
      aria-labelledby={headingId}
      className={cn('rounded-3xl bg-card p-4 text-card-foreground shadow-card sm:p-5', className)}
    >
      <div className="mb-3 flex min-h-6 items-center justify-between gap-2">
        <h2
          id={headingId}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
        >
          <Icon aria-hidden className="size-4" />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
