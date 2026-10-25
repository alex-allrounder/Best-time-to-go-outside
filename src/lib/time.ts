/** 13 → "13:00". 24 is shown as "24:00" so an end-of-day boundary stays unambiguous. */
export function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}

export function formatHourRange(startHour: number, endHour: number): string {
  return `${formatHour(startHour)}–${formatHour(endHour)}`
}

/** Current hour (0–23) at a location, given its UTC offset. */
export function hourAtOffset(utcOffsetSeconds: number, nowMs: number = Date.now()): number {
  return new Date(nowMs + utcOffsetSeconds * 1000).getUTCHours()
}

/** 30 → "30 min", 60 → "1 hour", 120 → "2 hours". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = minutes / 60
  return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
}
