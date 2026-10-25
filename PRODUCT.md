# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React 19 + TypeScript, Tailwind CSS v4, shadcn/ui (radix-nova preset, Geist), lucide-react icons, TanStack Query, zod. No backend. Deployed to Vercel.

## Users

Anyone, on their phone, doing a quick daily check a few seconds before planning an outing (walk, run, park, beach). They know their free time today and roughly what they want to do; they want one answer, not a weather report.

## Product Purpose

UV GO tells the user the best time to go outside today within their free time. It combines the UV index and the weather forecast into a single recommendation: a time window, a verdict (Good / OK with protection / Not recommended) and a one-line reason. Success means the user reads one card and knows when to go and what to bring.

## Positioning

It does not show the weather; it makes the decision. A transparent, rule-based score (UV, rain chance, feels-like temperature, wind; dark hours excluded) ranks every possible window inside the user's free time and explains itself in plain words.

## Operating Context

- Opened outdoors or on the way out, often in bright light, one-handed on a phone.
- Location comes from browser geolocation or a city search (Open-Meteo Geocoding API).
- Inputs: free time (whole hours), duration (30 min / 1 h / 2 h / 3 h), activity (Active / Relaxed / Long in the sun).
- Forecast from Open-Meteo (free, no key, CC BY 4.0 attribution required). Plans for today only, in the location's local time.

## Capabilities and Constraints

- Result card: best window, verdict, one-line reason, score. Two non-overlapping runner-up windows.
- Day timeline: each hour coloured by verdict, free time highlighted, dark and past hours excluded; tapping an hour shows its score breakdown.
- "What to take" checklist: sunscreen, hat and sunglasses, rain jacket, water, warm layer.
- All rules and thresholds live in `src/config/rules.ts`, and the values follow the brief exactly. A "Good" window can still carry a sunscreen reason at UV 3–5. That is intended (confirmed by the user, 2026-10-25): Good means go, and the reason and checklist say what to bring.
- Remembers the last place, inputs and up to five recent cities in localStorage.
- Out of scope: login, backend, database, payments, notifications, native apps.

## Brand Commitments

- Name: **UV GO**.
- Visual direction: the category standard, played straight. It sits alongside Apple Weather and Google Weather, and their craft level is the bar (user's choice, 2026-10-25).
- Voice: calm and plain. Short, factual, friendly but neutral, like a good weather app ("UV 5, use sunscreen"). No hype, no exclamation-heavy copy.

## Evidence on Hand

No testimonials, user counts or ratings exist; none may be invented. Data attribution: "Weather data by Open-Meteo".

## Product Principles

1. One answer first. The verdict and window are readable at a glance; everything else supports it.
2. Show the why. Every colour can be traced to a score and every score to a rule.
3. Honest about limits. When no window works (dark, past, too short), say so plainly instead of forcing a recommendation.
4. Fast and forgiving. No sign-up, remembered settings, sensible defaults.

## Accessibility & Inclusion

WCAG 2.2 AA. Verdicts are never conveyed by colour alone (icon + text label). Keyboard operable. Reduced motion honoured.
