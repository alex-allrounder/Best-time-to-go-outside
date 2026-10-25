---
name: UV GO
description: The best time to go outside today, as one answer.
colors:
  sky-field: '#1d5fd6'
  sky-field-night: '#132c57'
  on-sky: '#ffffff'
  on-sky-muted: '#e3edff'
  on-sky-muted-night: '#c7d6f5'
  primary: '#1d5fd6'
  primary-night: '#7fb0ff'
  plan-band: 'rgb(29 95 214 / 0.1)'
  plan-band-night: 'rgb(127 176 255 / 0.12)'
  ground: '#e8f1fb'
  ground-night: '#0c1322'
  card: '#ffffff'
  card-night: '#151d2e'
  ink: '#0f172a'
  ink-night: '#e6edf7'
  ink-muted: '#475569'
  ink-muted-night: '#a3b1c6'
  muted: '#eef4fc'
  muted-night: '#1d2738'
  accent: '#e3edfc'
  accent-night: '#1f2b40'
  border: '#dbe5f1'
  border-night: '#243048'
  input: '#cdd9e8'
  input-night: '#2c3a55'
  verdict-good: '#0ca30c'
  verdict-ok: '#fab219'
  verdict-bad: '#d03b3b'
  verdict-good-ink: '#ffffff'
  verdict-ok-ink: '#0b0b0b'
  verdict-bad-ink: '#ffffff'
  verdict-good-tint: '#e2f3e2'
  verdict-ok-tint: '#fef0d2'
  verdict-bad-tint: '#f9e1e1'
  verdict-good-text: '#0b5c0b'
  verdict-ok-text: '#7a4a00'
  verdict-bad-text: '#a51f1f'
  verdict-good-tint-night: '#1b3020'
  verdict-ok-tint-night: '#3a2f17'
  verdict-bad-tint-night: '#3a1d22'
  verdict-good-text-night: '#6ee56e'
  verdict-ok-text-night: '#fcc95a'
  verdict-bad-text-night: '#ff8f8f'
typography:
  display:
    fontFamily: 'Geist Variable, sans-serif'
    fontSize: 'clamp(2.25rem, 12.5vw, 3.75rem)'
    fontWeight: 600
    lineHeight: 1
    letterSpacing: '-0.025em'
    fontFeature: 'tnum'
  headline:
    fontFamily: 'Geist Variable, sans-serif'
    fontSize: '2.25rem'
    fontWeight: 600
    lineHeight: 1.11
    letterSpacing: '-0.025em'
  title:
    fontFamily: 'Geist Variable, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 600
    lineHeight: 1.56
  body-lead:
    fontFamily: 'Geist Variable, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 500
    lineHeight: 1.375
  body:
    fontFamily: 'Geist Variable, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: 'Geist Variable, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 600
    lineHeight: 1.43
  caption:
    fontFamily: 'Geist Variable, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 400
    lineHeight: 1.33
    fontFeature: 'tnum'
rounded:
  lg: '10px'
  xl: '14px'
  2xl: '18px'
  3xl: '22px'
  full: '9999px'
spacing:
  1: '4px'
  2: '8px'
  3: '12px'
  4: '16px'
  5: '20px'
  6: '24px'
  overlap: '40px'
  sky-tail: '64px'
  hour-cell-min: '52px'
components:
  module-card:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    rounded: '{rounded.3xl}'
    padding: '16px'
  verdict-card:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    rounded: '{rounded.3xl}'
    padding: '20px'
  section-heading:
    textColor: '{colors.ink-muted}'
    typography: '{typography.label}'
  verdict-badge-good:
    backgroundColor: '{colors.verdict-good-tint}'
    textColor: '{colors.verdict-good-text}'
    rounded: '{rounded.full}'
    padding: '4px 10px'
  verdict-badge-ok:
    backgroundColor: '{colors.verdict-ok-tint}'
    textColor: '{colors.verdict-ok-text}'
    rounded: '{rounded.full}'
    padding: '4px 10px'
  verdict-badge-bad:
    backgroundColor: '{colors.verdict-bad-tint}'
    textColor: '{colors.verdict-bad-text}'
    rounded: '{rounded.full}'
    padding: '4px 10px'
  verdict-badge-lg:
    rounded: '{rounded.full}'
    padding: '6px 12px'
  hour-pill-good:
    backgroundColor: '{colors.verdict-good}'
    textColor: '{colors.verdict-good-ink}'
    rounded: '{rounded.full}'
    width: '36px'
    height: '56px'
  hour-pill-ok:
    backgroundColor: '{colors.verdict-ok}'
    textColor: '{colors.verdict-ok-ink}'
    rounded: '{rounded.full}'
    width: '36px'
    height: '56px'
  hour-pill-bad:
    backgroundColor: '{colors.verdict-bad}'
    textColor: '{colors.verdict-bad-ink}'
    rounded: '{rounded.full}'
    width: '36px'
    height: '56px'
  hour-cell:
    rounded: '{rounded.2xl}'
    min-width: '{spacing.hour-cell-min}'
    padding: '12px 0'
  button-on-sky-solid:
    backgroundColor: '{colors.on-sky}'
    textColor: '{colors.sky-field}'
    rounded: '{rounded.full}'
    padding: '0 20px'
    height: '44px'
  button-on-sky-outline:
    textColor: '{colors.on-sky}'
    rounded: '{rounded.full}'
    padding: '0 20px'
    height: '44px'
  icon-button-on-sky:
    textColor: '{colors.on-sky}'
    rounded: '{rounded.full}'
    size: '44px'
  segmented-track:
    backgroundColor: '{colors.muted}'
    rounded: '{rounded.xl}'
    padding: '4px'
  segmented-item:
    textColor: '{colors.ink-muted}'
    rounded: '{rounded.lg}'
    height: '40px'
    padding: '0 8px'
  segmented-item-selected:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
  select-trigger:
    textColor: '{colors.ink}'
    rounded: '{rounded.xl}'
    height: '44px'
    typography: '{typography.body}'
  checklist-icon-chip:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.primary}'
    rounded: '{rounded.full}'
    size: '40px'
  sheet-list-item:
    rounded: '{rounded.xl}'
    padding: '10px 12px'
    height: '48px'
---

# Design System: UV GO

## Overview

**Creative North Star: "The Weather App That Answers"**

UV GO uses the category standard and plays it straight: a flat sky-blue field holds the place and the answer, and soft white modules sit under it on a pale sky ground. Apple Weather and Google Weather set the craft bar. Nothing in the system is there to be different. Everything is there to be read in a few seconds, one-handed, in bright light.

The answer is the hero. The best window is set large in tabular numerals on the sky field, and the verdict card overlaps the field's lower edge so the answer and its reason read as one unit. Colour does jobs only. Sky blue marks place, selection and free time. Green, amber and red mark verdicts, and they always come with an icon and a label. Every other surface is a quiet neutral, so the status colours stand out.

Night mode keeps the same structure: the field goes navy, the ground near-black and the cards slate. The verdict fills stay exactly the same, and only their tints and text colours change for the dark surface.

**Key Characteristics:**

- A flat sky field with white type, and a 40px card overlap at its bottom edge.
- Borderless rounded modules (22px) lifted by one soft two-layer shadow.
- One typeface (Geist) with tabular numerals wherever a number can change.
- A fixed three-step verdict scale, always shown as icon plus label.
- One authored motion moment: the answer fades in and settles 4px upward when it changes.

## Colors

The palette is cool neutrals and one sky blue, with a fixed traffic-light status scale that is the only warm colour on screen.

### Primary

- **Daylight Sky Blue** (`sky-field`): the header field behind the place, window and verdict context. It is deep enough that white text passes AA (5.74:1). In light mode the same hue is `primary`, used for focus rings, the text caret, selection wash, checklist icons and the "Use my location" row.
- **Night Field Navy** (`sky-field-night`): the dark-mode header field. The dark `primary` lifts to **Soft Night Blue** (`primary-night`) for rings and accents on slate.
- **Free-Time Wash** (`plan-band`): a translucent wash of the primary hue. It is used only for the free-time band behind the hourly strip and in its legend swatch.

### Tertiary (status)

- **Go Green** (`verdict-good`), **Caution Amber** (`verdict-ok`), **Stop Red** (`verdict-bad`): solid verdict fills for the hourly pills and legend dots. They are the same in both themes. Their inks are white, near-black and white.
- **Verdict Tints** (`verdict-*-tint`) with **Verdict Text** (`verdict-*-text`): badge backgrounds and readable status text on cards. Every tint/text pair is at least 6:1 in light mode and at least 6.9:1 in dark mode. Verdict text on a plain card is at least 7.4:1.

### Neutral

- **Pale Sky Ground** (`ground`) / **Night Ground** (`ground-night`): the page behind the cards.
- **Card White** (`card`) / **Slate Card** (`card-night`): module, sheet and popover surface.
- **Slate Ink** (`ink`) / **Frost Ink** (`ink-night`): primary text.
- **Muted Slate** (`ink-muted`) / **Muted Frost** (`ink-muted-night`): section headings, captions, secondary lines, icons in lists (7.58:1 on card, 7.75:1 on slate).
- **Mist** (`muted`), **Sky Mist** (`accent`): the segmented-control track, past-hour pills, inline notes in sheets, and checklist icon chips.
- **Hairline** (`border`), **Field Edge** (`input`): list dividers, sheet edges and select strokes.

### Named Rules

**The Colour Does Jobs Rule.** Blue means place, selection, focus or free time. Green, amber and red mean a verdict. No other hue appears, and no colour is decorative.

**The Fixed Scale Rule.** Verdict fills never change between themes. Theme changes only move the tints and text colours that sit on surfaces.

**The Fills Are Marks Rule.** Solid verdict fills carry an icon, never text. White on Go Green is 3.35:1, which is enough for a graphic but not for words. Text about a verdict uses the tint/text pair.

## Typography

**Display Font:** Geist Variable (with sans-serif)
**Body Font:** Geist Variable (with sans-serif)

**Character:** One neutral grotesque used at every size, as weather apps do. Hierarchy comes from size and weight (400 / 500 / 600), not from mixing families. Large sizes use tight tracking (-0.025em).

### Hierarchy

- **Display** (600, `clamp(2.25rem, 12.5vw, 3.75rem)`, line-height 1, tabular, no wrap): the best-window time on the sky field. Only one per screen.
- **Headline** (600, 2.25rem; 1.875rem for the error state): the sky-field prompt when no place is set, and "No good time" (`clamp(2.5rem, 12vw, 3rem)`).
- **Title** (600, 1.125rem): the place button, sheet titles, the score, and runner-up window times (at 1rem).
- **Body lead** (500, 1.125rem, line-height 1.375, `text-pretty`): the one-line verdict reason. On the sky field the same size at 400 carries "Best time to go outside".
- **Body** (400, 1rem): list names, select values, breakdown rows.
- **Label** (600, 0.875rem, muted): module headings with a 16px icon. Field labels use the same size at 500 in ink.
- **Caption** (400, 0.75rem, tabular): hour labels, the legend, score notes, the footer.

### Named Rules

**The Tabular Rule.** Any number that can change (times, UV, scores, durations) is set with `tabular-nums`, so the layout never shifts when the answer updates.

**The Sentence Case Rule.** All headings and labels are sentence case at normal tracking. The system has no uppercase or letter-spaced label style.

## Layout

The layout is a single column first, with a 390px phone baseline. Header, content and footer share one container (`pageContainer` in src/lib/layout.ts): a 576px column (`max-w-xl`) below 1024px and a 1152px column (`max-w-6xl`) from 1024px, with 16px gutters (24px from 640px). The header ends with a 64px tail (80px on desktop), and the card grid pulls up 40px (48px on desktop) so the first card overlaps the field.

Cards stack with 12px gaps in this order: verdict, plan, hourly strip, what to take, other good times. From 1024px the verdict card moves into the sky beside the headline (`aside` slot, a 28rem column), the plan card becomes a one-row filter bar (free time | how long | activity) spanning the full width, the hourly strip spans the full width, and the two lists sit side by side at 16px gaps, each sized to its content. Inside cards the spacing steps are 12px (heading to content, list rows), 16px (between fields; 24px between filter-bar fields), and 20px for card padding on larger screens.

The hourly strip starts at the current hour. Its columns share the row width equally, with a 52px minimum: on desktop they stretch to fill the card, and on phones they scroll at 52px. The free-time band and best-window ring are positioned in percentages of the row, so they stay aligned at any width. The strip scrolls the best window into the centre (smooth, or instant under reduced motion), and it bleeds to the card edges with a negative margin.

Sheets are bottom drawers capped at 512px (`max-w-lg`) and 80vh, padded for the safe area. Every tap target is at least 44px (header controls and selects are 44px, list items 48px, segments 40px inside a 4px-padded track).

## Elevation & Depth

Depth is low and ambient. The page is flat. Cards rise off the ground with one soft two-layer shadow (a tight contact shadow plus a wide, faint blur). The shadow is stronger in night mode so it reads on near-black. The selected segment gets a small shadow so it reads as a raised chip inside its track. Nothing else casts a shadow, and no surface uses blur or glass.

### Shadow Vocabulary

- **Card lift** (`box-shadow: 0 1px 2px rgb(15 23 42 / 0.04), 0 6px 20px -4px rgb(15 23 42 / 0.08)`; night `0 1px 2px rgb(0 0 0 / 0.3), 0 6px 20px -4px rgb(0 0 0 / 0.35)`): every module card.
- **Segment chip** (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): the selected segmented-control item only.

### Named Rules

**The One Lift Rule.** Cards have a shadow and no border. Inside cards, separation comes from hairline dividers and tonal fills, never from nested shadows.

## Shapes

The corners are soft and nest by level. Cards use 22px. Hour cells, the free-time band and the best-window ring use 18px. Selects, the segmented track, sheet list items and inline notes use 14px. Segments and default buttons use 10px. Everything a user picks or reads as a single status is a full pill: verdict badges, hourly verdict pills (36 × 56px), checklist icon chips (40px circles), and every control on the sky field.

Hourly pills have a 1px inset ring at 10% black so the fills keep a clean edge on any surface. Dark hours are outlined with a dashed 1px muted border and a moon icon instead of a fill. Past hours use a flat muted fill at 45% opacity. The best window is a 2px inset ring in ink colour.

## Components

### Buttons

Controls on the sky field are calm, rounded and white.

- **Shape:** full pill, 44px tall.
- **Solid on sky:** white background with sky-blue text, 20px horizontal padding, 1rem text. Hover goes to 90% white.
- **Outline on sky:** transparent with a 60% white stroke and white text. Hover adds a 15% white wash.
- **Icon on sky:** 44px circle, white 20px icon, 15% white wash on hover.
- **In cards:** the shadcn ghost button (10px radius, muted text) handles small secondary actions such as Reset.
- **Focus:** a 2px ring in `primary`, offset 2px, on every focusable element.

### Chips (verdict badge)

- **Style:** full pill, verdict tint background, verdict text colour, weight 600, and a 16px icon before the label (20px icon at the large size).
- **Sizes:** small (4px 10px, 0.875rem) in sheets, large (6px 12px, 1rem) on the verdict card.

### Cards / Containers

- **Corner Style:** 22px.
- **Background:** `card` / `card-night`.
- **Shadow Strategy:** card lift (see Elevation & Depth).
- **Border:** none.
- **Internal Padding:** module cards use 16px, rising to 20px from 640px. The verdict card uses 20px at all sizes.
- **Heading:** a muted 0.875rem semibold label with a 16px icon. An optional right-side action sits on the same 24px row.

### Inputs / Fields

- **Select:** 44px tall, 14px radius, `input` stroke, 1rem tabular value. The popover list is capped at 288px.
- **Segmented control:** a grid of equal segments in a 4px-padded `muted` track (14px radius). Segments are 40px, 10px radius, muted text. The selected segment is `card` with ink text and the segment-chip shadow. Pressing scales it to 0.97 over 150ms. Icons hide below 380px.
- **City search:** a command input inside the bottom sheet, with 48px result rows at 14px radius.

### Signature: Hourly Strip

Each column (52px minimum) holds a caption hour (or "Now"), a 36 × 56px verdict pill with its icon, and a "UV n" line. The best-window hours and Now set their hour label in ink. The free-time wash sits behind the columns, and the best-window ring sits above them. The ring slides to a new position over 300ms ease-out. Pressing a pill scales it to 0.94. Tapping an hour opens its score-breakdown sheet. A legend below repeats every mark with its label.

### Signature: Verdict Card

A large verdict badge sits left and the score right (title weight, with a caption "score, lower is better"). The reason sits below in body lead. When the answer changes, the content fades in and slides up 4px over 500ms ease-out, and the window time on the sky field does the same. Reduced motion removes both.

## Do's and Don'ts

### Do:

- **Do** pair every verdict colour with its icon (circle-check, shield-alert, circle-x) and a text label, or an accessible label where space allows only the mark.
- **Do** use verdict tints with verdict text for any words about a verdict, and solid fills only for icon marks.
- **Do** set every changing number in tabular numerals.
- **Do** keep tap targets at 44px or more, and give every focusable element the 2px `primary` ring with a 2px offset.
- **Do** keep motion to the answer's 500ms fade-and-settle and short 150ms press feedback, and remove all of it under reduced motion.

### Don't:

- **Don't** show a verdict by colour alone.
- **Don't** put text on a solid verdict fill. White on Go Green is 3.35:1.
- **Don't** change the verdict fills per theme, or use green, amber or red for anything other than a verdict.
- **Don't** add borders to cards or stack shadows inside them. Use one lift, hairline dividers and tonal fills.
- **Don't** introduce a second typeface or an uppercase, letter-spaced label style.
