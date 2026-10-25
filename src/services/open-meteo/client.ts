import type { z } from 'zod/mini'

export class ApiError extends Error {
  readonly status: number | null

  constructor(message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type QueryValue = string | number | boolean

export function buildUrl(base: string, params: Record<string, QueryValue>): string {
  const url = new URL(base)
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value))
  return url.toString()
}

/** GET + validate. Open-Meteo reports errors as `{ error: true, reason }`. */
export async function getJson<T>(
  url: string,
  schema: z.ZodMiniType<T>,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (cause) {
    if (signal?.aborted) throw cause
    throw new ApiError('Network error. Check your connection and try again.')
  }

  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const reason =
      body && typeof body === 'object' && 'reason' in body ? String(body.reason) : undefined
    throw new ApiError(reason ?? `Request failed (${response.status})`, response.status)
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) throw new ApiError('Unexpected response from the weather service.')
  return parsed.data
}
