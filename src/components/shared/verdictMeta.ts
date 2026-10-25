import { CircleCheck, CircleX, ShieldAlert, type LucideIcon } from 'lucide-react'
import type { Verdict } from '@/domain/types'

export interface VerdictMeta {
  label: string
  short: string
  icon: LucideIcon
  /** Solid fill + its ink, for marks such as timeline pills. */
  fill: string
  /** Readable text colour on cards. */
  text: string
  /** Tinted background + readable text, for badges and inline labels. */
  tint: string
}

export const verdictMeta: Record<Verdict, VerdictMeta> = {
  good: {
    label: 'Good',
    short: 'Good',
    icon: CircleCheck,
    fill: 'bg-good text-good-ink',
    tint: 'bg-good-tint text-good-text',
    text: 'text-good-text',
  },
  ok: {
    label: 'OK with protection',
    short: 'OK',
    icon: ShieldAlert,
    fill: 'bg-ok text-ok-ink',
    tint: 'bg-ok-tint text-ok-text',
    text: 'text-ok-text',
  },
  bad: {
    label: 'Not recommended',
    short: 'Avoid',
    icon: CircleX,
    fill: 'bg-bad text-bad-ink',
    tint: 'bg-bad-tint text-bad-text',
    text: 'text-bad-text',
  },
}
