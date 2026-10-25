import { pageContainer } from '@/lib/layout'
import { cn } from '@/lib/utils'

export function Footer() {
  return (
    <footer
      className={cn(
        pageContainer,
        'pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] text-xs text-muted-foreground',
      )}
    >
      <p>
        <span className="font-semibold text-foreground">UV GO</span> · Weather data by{' '}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground underline underline-offset-2"
        >
          Open-Meteo.com
        </a>{' '}
        (CC BY 4.0). Recommendations are guidance, not medical advice.
      </p>
    </footer>
  )
}
