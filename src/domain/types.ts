export type Activity = 'active' | 'relaxed' | 'sun'
export type Verdict = 'good' | 'ok' | 'bad'
export type FactorId = 'uv' | 'rain' | 'heat' | 'cold' | 'wind'
export type DurationMinutes = 30 | 60 | 120 | 180

/** One hour of forecast, in the location's local time. Values are rounded to display precision. */
export interface HourForecast {
  /** Location-local ISO time without offset, e.g. "2026-10-25T13:00". */
  time: string
  /** 0–23, location-local. */
  hour: number
  uvIndex: number
  /** Probability of precipitation, 0–100 %. */
  rainChance: number
  /** Apparent temperature, °C. */
  feelsLike: number
  /** km/h at 10 m. */
  windSpeed: number
  isDay: boolean
}

export interface DayForecast {
  /** IANA zone of the location, e.g. "Asia/Tokyo". */
  timezone: string
  utcOffsetSeconds: number
  hours: HourForecast[]
}

export interface Place {
  /** Stable key for lists and recent-city de-duplication. */
  id: string
  name: string
  /** Secondary line, e.g. "Punjab, Pakistan". */
  description: string
  latitude: number
  longitude: number
  source: 'search' | 'geolocation'
}

/** Free time as whole hours: start inclusive, end exclusive (13 → 19 means 13:00–19:00). */
export interface FreeTime {
  startHour: number
  endHour: number
}

export interface PlanSettings {
  freeTime: FreeTime
  durationMinutes: DurationMinutes
  activity: Activity
}

export interface FactorScore {
  factor: FactorId
  /** The measured value the factor looked at (UV index, %, °C or km/h). */
  value: number
  points: number
}

export type HourStatus = 'scored' | 'dark' | 'past'

export interface ScoredHour extends HourForecast {
  status: HourStatus
  /** Null when the hour is excluded (dark or past). */
  score: number | null
  verdict: Verdict | null
  breakdown: FactorScore[]
  inFreeTime: boolean
}

export interface WindowStats {
  maxUv: number
  maxRainChance: number
  maxFeelsLike: number
  minFeelsLike: number
  maxWindSpeed: number
}

export interface ChecklistItem {
  id: string
  label: string
  detail: string
}

export interface TimeWindow {
  startHour: number
  /** Exclusive. */
  endHour: number
  hours: ScoredHour[]
  /** Average of the hour scores, rounded to one decimal. */
  score: number
  /** Worst single hour in the window, used as a tie-breaker. */
  peakScore: number
  verdict: Verdict
  reason: string
  checklist: ChecklistItem[]
  stats: WindowStats
}

export type EmptyReason =
  | 'invalid-free-time'
  | 'free-time-too-short'
  | 'already-passed'
  | 'no-daylight'
  | 'no-continuous-window'

export interface DayPlan {
  hours: ScoredHour[]
  best: TimeWindow | null
  alternatives: TimeWindow[]
  emptyReason: EmptyReason | null
}

/* ---------- Rules config shape (values live in src/config/rules.ts) ---------- */

export interface Band {
  /** Inclusive lower bound. */
  min: number
  points: number
}

export interface ChecklistRule {
  id: string
  label: string
  detail: string
  when: (ctx: { stats: WindowStats; activity: Activity }) => boolean
}

export interface RulesConfig {
  uv: { bands: readonly Band[]; activityMultiplier: Record<Activity, number> }
  rain: { bands: readonly Band[] }
  heat: { minFeelsLike: number; points: Record<Activity, number> }
  cold: { belowFeelsLike: number; points: number }
  wind: { minSpeedKmh: number; points: number }
  verdict: { goodBelow: number; okBelow: number }
  windows: { maxAlternatives: number }
  checklist: readonly ChecklistRule[]
  reasons: {
    maxParts: number
    factors: Record<FactorId, (stats: WindowStats) => string>
    none: string
  }
}
