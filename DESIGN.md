# Design

## Overview

Seekvana is a warm editorial learning platform. The visual identity sits between a quality print publication and a modern documentation site: generous whitespace, serif headings, a clay accent, and a warm cream canvas. Dark mode is first-class — a warm near-black canvas, not a simple color inversion.

---

## Color

### Strategy

Restrained: tinted warm-neutral backgrounds + one clay accent used at ≤10–15% of surface. Warmth is carried by typography and whitespace, not by saturating the background.

### Light theme tokens

| Token | Hex | Role |
|---|---|---|
| `--color-canvas` | `#FAF8F3` | Page background — warm cream |
| `--color-surface` | `#FFFFFF` | Cards, panels, navbar |
| `--color-surface-subtle` | `#F4F1EA` | Alternating sections, code bg, footer |
| `--color-border` | `#E6E1D7` | All dividers, card borders |
| `--color-text-primary` | `#1C1B19` | All headings and body text |
| `--color-text-secondary` | `#6F6B62` | Captions, meta, muted labels |
| `--color-accent` | `#C9633F` | Clay — primary CTA, links, active states |
| `--color-accent-deep` | `#A84E2E` | Hover / pressed states for accent |
| `--color-accent-soft` | `#F6E4DB` | Tip callout backgrounds, badge fills |
| `--color-info` | `#2F7D6B` | Info / note callout accent (teal) |
| `--color-success` | `#4E8A5B` | Success states |

### Dark theme tokens

| Token | Hex | Role |
|---|---|---|
| `--color-canvas` | `#181712` | Warm near-black |
| `--color-surface` | `#211F1A` | Cards, panels, navbar |
| `--color-surface-subtle` | `#2A2823` | Sections, code bg, footer |
| `--color-border` | `#38352E` | Dividers, card borders |
| `--color-text-primary` | `#EFEBE1` | Headings and body text |
| `--color-text-secondary` | `#A39E92` | Captions, muted labels |
| `--color-accent` | `#E0875F` | Clay lightened for dark bg contrast |
| `--color-accent-deep` | `#C96B45` | Hover / pressed states |
| `--color-accent-soft` | `#3A2A22` | Tip callout backgrounds |
| `--color-info` | `#5FB39B` | Info / note callout |
| `--color-success` | `#6BA876` | Success states |

### Tailwind mapping

```
bg-canvas · bg-surface · bg-surface-subtle · border-border
text-primary · text-secondary · text-accent · bg-accent
bg-accent-soft · bg-accent-deep · bg-info
```

---

## Typography

### Typefaces

| Role | Family | Weights | Variable |
|---|---|---|---|
| Headings (h1–h4) | **Fraunces** | 400, 500, 600 | `--font-fraunces` |
| Body, UI, labels | **Inter** | 400, 500, 600 | `--font-inter` |
| Code blocks | **JetBrains Mono** | 400, 500 | `--font-mono` |

### Scale

| Level | Size | Weight | Notes |
|---|---|---|---|
| h1 | 48px / 30px mobile | Fraunces 500 | `clamp(1.875rem, 5vw, 3rem)` |
| h2 | 30px | Fraunces 500 | Used for section titles |
| h3 | 22px | Fraunces 500 | Subsection headers |
| h4 | 18px | Fraunces 500 | Component-level headers |
| Body | 17px | Inter 400 | `line-height: 1.75`, `max-width: ~68ch` |
| Body large | 18–19px | Inter 400 | Hero subheadings, article intros |
| Small/meta | 14px | Inter 400 | Dates, bylines, badges |
| Code | 15px | JetBrains Mono | All code snippets |

### Pairing logic

Fraunces headings over Inter body — a warm serif / clean humanist sans contrast axis. Fraunces provides editorial warmth and personality; Inter ensures readability at all sizes. The pair should never be substituted unless both are replaced together.

---

## Spacing

### Scale (Tailwind defaults augmented)

Generous padding on section level. Cards use `p-5` or `p-6`. Body prose capped at `max-w-prose` (65ch). Article content column: `max-w-2xl`. Page max-width: `max-w-screen-xl`.

### Section rhythm

- Hero: `py-24 md:py-32`
- Content sections: `py-16`
- Footer: `py-16`
- Navbar height: `h-14` (56px)

---

## Border radius

| Scale | Value | Usage |
|---|---|---|
| `rounded-lg` | 0.75rem | Buttons, inputs, inline code |
| `rounded-xl` | 1rem | Cards, search bar, code blocks |
| `rounded-2xl` | 1.5rem | Modal panels, large overlays |
| `rounded-full` | 9999px | Pill badges, chip buttons |

---

## Shadows

Cards: no shadow by default, `shadow-md` on hover only. Modal: `shadow-2xl`. No decorative drop shadows on flat elements.

---

## Motion

### Library

Framer Motion. All animations guarded by `useReducedMotion()`.

### Timing

| Motion type | Duration | Easing |
|---|---|---|
| Hero stagger fade-up | 0.4s, 0.08s between items | `easeOut` |
| Section scroll reveals | 0.3s | `easeOut`, `once: true` |
| Card hover lift | 150ms | CSS `transition-transform` |
| Navbar border fade | CSS transition | `useTransform(scrollY, [0,10], [0,1])` |
| Dropdown open | 150ms, `y: 4→0` + `opacity: 0→1` | Framer Motion |
| Theme toggle icon | 200ms | Framer Motion rotate + scale |
| Search modal | 200ms, `scale: 0.97→1` + `opacity: 0→1` | Framer Motion |

### Rules

- Every `motion.div` with `initial` must have a visible default state — never gate content visibility on a class-triggered transition.
- `whileInView` uses `viewport={{ once: true }}` — no repeat fires.
- `whileHover` uses `y: -2` for card lift, not scale.

---

## Components

### Navbar

Sticky, `h-14`, `bg-surface/90 backdrop-blur-sm`. Bottom border fades in on scroll via Framer Motion `useScroll`. Logo: compass SVG (clay) + "Seek" (text-primary) + "vana" (text-accent) in Fraunces bold. Desktop: NavigationMenu with dropdowns. Mobile: Sheet from the left. Right actions: search icon, ThemeToggle, "Get started" CTA.

### Cards

`bg-surface rounded-xl border border-border`. No shadow at rest. `hover:shadow-md` + `whileHover={{ y: -2 }}`. Content: `p-5` or `p-6`.

### Buttons

- **Primary**: `bg-accent text-white rounded-lg px-6 py-3 font-medium hover:bg-accent-deep`
- **Secondary**: `border border-border text-primary rounded-lg px-6 py-3 font-medium hover:bg-surface-subtle`
- **Ghost / text**: `text-accent hover:text-accent-deep` (no border, no bg)
- **Nav CTA**: `bg-accent text-white rounded-lg px-4 py-2 text-sm font-medium`

### Badges / Pills

- Category badge: `bg-accent-soft text-accent text-sm rounded-full px-4 py-1`
- Difficulty: Beginner = green tones, Intermediate = amber, Advanced = red
- Flagship pillar: `border-accent border-2` (Agentic AI)

### Callout boxes

- **Tip**: `bg-accent-soft border-l-4 border-accent rounded-r-lg p-4 my-6` + Lucide Lightbulb icon
- **Note**: `bg-info/10 border-l-4 border-info rounded-r-lg p-4 my-6` + Lucide Info icon
- **Warning**: `bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 rounded-r-lg p-4 my-6` + Lucide AlertTriangle

### Ad slots

`dashed border border-border rounded-lg bg-surface-subtle`. Label: `"Advertisement"` in `text-secondary text-xs`. Fixed dimensions — never change (prevents layout shift): in-content 300×250, sidebar 300×250, footer banner 728×90.

### Code blocks

`bg-surface-subtle border border-border rounded-xl p-4 font-mono text-sm`. Copy button top-right (Lucide Copy, shows "Copied!" for 2s).

### Search modal

`fixed inset-0 bg-black/50 backdrop-blur-sm z-50`. Inner panel: `max-w-2xl mx-auto mt-20 bg-surface rounded-2xl border border-border shadow-2xl`. Keyboard navigation: arrow keys move selection (highlighted `bg-accent-soft`), Escape closes.

---

## Article page layout

3-column fixed layout on desktop — never collapse or remove columns, only hide at breakpoints:

- **Left pillar sidebar**: `w-64 sticky top-16` — hidden below `lg`
- **Center content**: `flex-1 max-w-2xl mx-auto px-4 md:px-8`
- **Right TOC**: `w-56 sticky top-20` — hidden below `xl`

Reading progress bar: `fixed top-0 left-0 h-1 bg-accent`, driven by Framer Motion `useScroll`.

---

## Dark mode

`next-themes` with `attribute="class"` and `defaultTheme="system"`. Warm near-black, not a simple inversion. ThemeToggle cycles light/dark with animated sun/moon icons (Framer Motion, 200ms rotate + scale).

---

## Logo

Compass/aperture SVG mark — four triangular petals around a center point, primary petal at full opacity, remaining at 14% / 28% / 28%. Clay (`text-accent`). Wordmark in Fraunces bold: "Seek" (text-primary) + "vana" (text-accent). Collapsed to wordmark-only at small sizes.
