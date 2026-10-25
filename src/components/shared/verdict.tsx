import { verdictMeta } from '@/components/shared/verdictMeta'
import type { Verdict } from '@/domain/types'
import { cn } from '@/lib/utils'

interface VerdictBadgeProps {
  verdict: Verdict
  size?: 'sm' | 'lg'
  className?: string
}

/** Verdict as icon + label on its tint; never colour alone. */
export function VerdictBadge({ verdict, size = 'sm', className }: VerdictBadgeProps) {
  const { label, icon: Icon, tint } = verdictMeta[verdict]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        size === 'lg' ? 'px-3 py-1.5 text-base' : 'px-2.5 py-1 text-sm',
        tint,
        className,
      )}
    >
      <Icon aria-hidden className={size === 'lg' ? 'size-5' : 'size-4'} />
      {label}
    </span>
  )
}

export function VerdictIcon({ verdict, className }: { verdict: Verdict; className?: string }) {
  const { icon: Icon, label } = verdictMeta[verdict]
  return <Icon aria-label={label} role="img" className={cn('shrink-0', className)} />
}
