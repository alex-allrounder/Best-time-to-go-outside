import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from '@/hooks/useTheme'

const darkQuery = '(prefers-color-scheme: dark)'

function readStoredTheme(key: string): Theme {
  try {
    const value = window.localStorage.getItem(key)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

/**
 * Class-based light/dark theme following the OS by default. index.html applies the same
 * class before first paint, so there is no flash of the wrong theme.
 */
export function ThemeProvider({
  storageKey,
  children,
}: {
  storageKey: string
  children: ReactNode
}) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme(storageKey))
  const [systemDark, setSystemDark] = useState(() => window.matchMedia(darkQuery).matches)

  useEffect(() => {
    const media = window.matchMedia(darkQuery)
    const onChange = () => setSystemDark(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    // The status bar should match the sky header of the theme actually shown, not just the OS one.
    const sky = getComputedStyle(document.documentElement).getPropertyValue('--sky').trim()
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute('content', sky))
  }, [resolvedTheme])

  const setTheme = (next: Theme) => {
    setThemeState(next)
    try {
      if (next === 'system') window.localStorage.removeItem(storageKey)
      else window.localStorage.setItem(storageKey, next)
    } catch {
      // Storage unavailable: the choice still applies for this visit.
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
