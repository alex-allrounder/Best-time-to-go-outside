export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-3xl px-4 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] text-xs text-muted-foreground sm:px-6">
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
