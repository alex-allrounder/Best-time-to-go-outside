import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatusMessageProps {
  icon: LucideIcon
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}

/** Empty and error states inside a card. */
export function StatusMessage({
  icon: Icon,
  title,
  description,
  action,
  className,
}: StatusMessageProps) {
  return (
    <div className={cn('flex flex-col items-start gap-2 py-1', className)}>
      <Icon aria-hidden className="size-5 text-muted-foreground" />
      <p className="font-semibold text-balance">{title}</p>
      {description && <p className="text-sm text-pretty text-muted-foreground">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
