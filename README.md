# UV GO

**The best time to go outside today, within your free time.**

UV GO combines the UV index and the weather forecast into one answer: a time window, a verdict and a one-line reason. It is a mobile-first single-page app with no backend, built on the free [Open-Meteo](https://open-meteo.com/) APIs (no API key needed).

**Live demo:** _add the Vercel URL here after deploying_

## Features

- **Location:** browser geolocation or city search (Open-Meteo Geocoding API). Recent cities are remembered.
- **Your plan:** free time (for example 13:00–19:00), duration (30 min / 1 h / 2 h / 3 h) and activity (Active / Relaxed / Long in the sun).
- **Result card:** the best window, a verdict (Good / OK with protection / Not recommended) and a one-line reason, such as "UV 5, use sunscreen".
- **Day timeline:** every hour coloured by its verdict, with your free time highlighted and the best window outlined. Tap an hour to see how its score was calculated.
- **What to take:** sunscreen, hat and sunglasses, rain jacket, water and a warm layer, depending on the conditions.
- **Other good times:** up to two more windows that don't overlap the best one.
- Light and dark mode. Your settings are remembered on this device.

All rules and thresholds live in one file: [`src/config/rules.ts`](src/config/rules.ts).

## Getting started

Requirements: Node.js 20 or newer, and npm.

```bash
git clone <repo-url> uv-go
cd uv-go
npm install
npm run dev
```

Then open http://localhost:5173. Geolocation needs `localhost` or HTTPS. City search works everywhere.

| Script              | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Start the dev server                                 |
| `npm run build`     | Type-check and build to `dist/`                      |
| `npm run preview`   | Serve the production build locally                   |
| `npm test`          | Run the unit tests (Vitest)                          |
| `npm run lint`      | Lint with oxlint                                     |
| `npm run typecheck` | Type-check without emitting                          |
| `npm run format`    | Format with Prettier                                 |
| `npm run check`     | Lint, type-check, test and build: everything CI runs |

## How the score works

Each hour gets penalty points. **Lower is better.**

| Condition                 | Points                                     |
| ------------------------- | ------------------------------------------ |
| UV 0–2 / 3–5 / 6–7 / 8+   | 0 / 2 / 4 / 6 (×1.5 for "Long in the sun") |
| Rain chance 30–59% / 60%+ | +2 / +5                                    |
| Feels like 30 °C or more  | +3 (+5 instead for Active)                 |
| Feels like below 0 °C     | +2                                         |
| Wind 40 km/h or more      | +3                                         |
| Dark hours                | Excluded                                   |

A window's score is the average of its hours. The verdict is **Good** below 3, **OK with protection** from 3 up to 6, and **Not recommended** from 6.

**What to take:** sunscreen at UV 3+, hat and sunglasses at UV 6+, rain jacket at 30%+ rain chance, water for Active or when it feels 25 °C or more, and a warm layer when it feels below 5 °C.

### Decisions where the brief was open

| Question                                                             | Decision                                                                                        |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| The verdict bands 0–2 / 3–5 / 6+ leave gaps for averages such as 2.5 | Bands have no gaps: Good < 3 ≤ OK < 6 ≤ Not recommended                                         |
| A score like 2.95 would display as "3.0" but count as Good           | Scores are rounded to one decimal **before** judging, so the number and the colour always agree |
| UV 2.6 would display as "UV 3" but score as UV 2                     | Forecast values are rounded to whole numbers once, when the data is loaded                      |
| Data is hourly, but the duration can be 30 minutes                   | A window covers whole hours (30 min uses one hour). Free time is picked in whole hours          |
| Does "Active: +5" add to or replace the +3?                          | It replaces it                                                                                  |
| Which temperature do "25 °C water" and "below 5 °C warm layer" use?  | Feels-like, the same as the scoring                                                             |
| The checklist is based on which hours?                               | The best window: its highest UV, rain and feels-like, and its lowest feels-like                 |
| Two windows have the same score                                      | The one whose worst hour is milder wins, then the earlier one                                   |
| Hours earlier today                                                  | Skipped, the same as dark hours                                                                 |
| A city in another timezone                                           | All times are shown in that city's local time                                                   |
| No window fits                                                       | An explanation of why (dark, already passed, too short) and what to change                      |

## Changing the rules

Open [`src/config/rules.ts`](src/config/rules.ts). Every threshold, point value, verdict band, checklist item and reason line is defined there. The scoring code reads nothing else.

To add a new factor (for example air quality), you need three changes:

1. Add a factor to the registry in [`src/domain/scoring/factors.ts`](src/domain/scoring/factors.ts).
2. Add its thresholds to `rules.ts`.
3. Add a reason template to `rules.ts`.

The tests in `src/domain/__tests__` describe the expected behaviour.

## Project structure

```
src/
  app/            App shell, providers, theme
  config/         rules.ts (all scoring rules) and app.config.ts (API URLs, defaults, storage keys)
  domain/         Pure TypeScript scoring engine, no React; fully unit-tested
  services/       Open-Meteo forecast and geocoding clients, validated with zod
  features/
    location/     Place search sheet, geolocation, saved and recent places
    planner/      Free time, duration and activity controls
    forecast/     Sky header, verdict card, timeline, checklist, runner-ups
  components/
    ui/           shadcn/ui primitives
    shared/       Reusable app components (SectionCard, VerdictBadge, StatusMessage, ThemeToggle)
  hooks/          Generic hooks (useLocalStorage, useDebouncedValue, useNow, useTheme)
  lib/            Small helpers (time formatting, numbers, cn)
```

Dependencies point one way: `features → domain / services → config`.

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui (Radix), lucide-react icons, TanStack Query, zod, Vitest and Testing Library, oxlint and Prettier.

## Deploying to Vercel

1. Push the repo to GitHub.
2. In Vercel, choose **Add New → Project** and import the repo. Vercel detects Vite automatically: the build command is `npm run build` and the output directory is `dist`.
3. Deploy, then paste the URL into the **Live demo** line above.

Every push to `main` redeploys. Pull requests get preview URLs.

## Credits

Weather and geocoding data by [Open-Meteo.com](https://open-meteo.com/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Recommendations are guidance, not medical advice.
