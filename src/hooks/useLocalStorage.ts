import { useEffect, useState } from 'react'
import type { z } from 'zod/mini'

function read<T>(key: string, schema: z.ZodMiniType<T>, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed = schema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : fallback
  } catch {
    // Private mode, blocked storage or corrupted JSON: behave as if nothing was saved.
    return fallback
  }
}

/**
 * useState that persists to localStorage. Stored values are validated with `schema`,
 * so an old or hand-edited entry falls back to `fallback` instead of crashing the app.
 */
export function useLocalStorage<T>(key: string, schema: z.ZodMiniType<T>, fallback: T) {
  const [value, setValue] = useState<T>(() => read(key, schema, fallback))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or unavailable; the in-memory value still works.
    }
  }, [key, value])

  const reset = () => setValue(fallback)

  return [value, setValue, reset] as const
}
