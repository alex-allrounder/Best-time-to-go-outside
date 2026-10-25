---
version: 1
slug: 'src-app-app-tsx'
primary_target: 'src/app/App.tsx'
related_targets: []
---

# Surface: UV GO app screen (src/app/App.tsx)

Mode: Operate. One screen, mobile-first (390px baseline), widens to a two-column module grid on md+.

Audience and job: anyone doing a quick daily check on a phone, often outdoors in daylight; they want one answer (when to go, how risky, what to bring) in seconds, then optionally adjust free time, duration or activity.

Constraints: verdict never colour alone (icon + label); WCAG 2.2 AA; calm, plain copy; Open-Meteo attribution in footer; all scoring copy comes from src/config/rules.ts.

Quality bar: Apple Weather and Google Weather (user-chosen). The user took the category standard on purpose; execute it straight, at their craft level.

## Direction contract

THESIS: A weather app that answers one question. The canon arrangement played straight: a sky field with the place and the answer, then modular rounded cards. It refuses data-dump weather reports: no temperature-first hero, no ten metrics.

OWN-WORLD: Flat sky-blue field (deep enough for white text at AA) over a pale sky ground in light; night navy field over near-black ground in dark. White (dark: slate) rounded cards, radius ~20px, soft offset shadow. Geist with tabular numerals. Colour does jobs only: green / amber / red verdicts with icon + label, sky-blue for selection and free-time highlight.

STORY: The visitor sees where, the best window and the verdict, reads one reason, glances at what to take, and leaves; or tweaks the plan and watches the answer update live.

FIRST VIEWPORT: Sky field: top row place button (opens search sheet) + locate + theme icons; place name ~28px; window time ~56px tabular; "Best time to go outside" line. White verdict card overlaps the field's bottom edge: verdict badge, reason, score. Then "Your plan" card (free time, duration, activity). Primary action: none needed, the answer is there; place button is the first control.

FORM: Category standard (canon), chosen by the user over the assigned Sundial and the Lifeguard Flags pick. Signature interaction: the hourly strip (Apple-style scroller) with verdict-coloured bars, free-time band, best-window ring auto-scrolled into view; tap an hour opens its score-breakdown sheet. Motion grammar: one authored moment, the answer cross-fades and settles when the result changes; reduced motion removes it. seed: 44dbb1c9fe8a7136

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
