# Design System

## Status: temporary, derived palette — not official branding

The legacy site had no design-system documentation and no consistent identity: three different color schemes appeared across its 9 pages (`#0056b3` blue, `#003366` navy, and `testimonies.html`'s Bootstrap `bg-danger` red-and-black theme — see [LEGACY_AUDIT.md](LEGACY_AUDIT.md)). Per the milestone brief, colors were **not** invented from scratch; they were built around the recurring blue-and-red combination that appeared most consistently (the blue heading color in `about.html`/`index.html`, and the red used for every primary CTA button across the site).

This palette should be treated as a working default, easy to swap once the church provides an official brand (logo files, print materials, denominational color guidance, etc.). All values live as CSS custom properties in [`frontend/src/index.css`](../frontend/src/index.css) (Tailwind v4 `@theme` block), not scattered through components, specifically so they're a single edit away from being replaced.

## Typography

| Role | Typeface | Why |
|---|---|---|
| Display / headings (`h1`–`h4`) | **Fraunces** (variable) | A warm, editorial serif with real character — signals "considered publication," not "generic template." Avoids the generic sans-everything look the brief explicitly warns against. |
| Body / UI | **Inter** (variable) | Highly legible at small sizes, wide language support, the de facto standard for UI text — keeps body copy and forms unobtrusive so the serif can do the work of setting tone. |

Both are self-hosted via `@fontsource-variable` (see [ARCHITECTURE.md](ARCHITECTURE.md)) rather than loaded from Google Fonts at runtime. Only two families are used, and only the weight axis of each is loaded — no italics, no extra widths — to keep the font payload small.

## Colors

| Token | Value | Usage |
|---|---|---|
| `primary-50`…`primary-900` | Navy/blue ramp, base `#2c65ae` | Primary actions, links, active nav state |
| `accent-50`…`accent-900` | Red ramp, base `#c72e2e` | Reserved for sparing emphasis (e.g. a "live now" badge) — **not** used as the default button color, unlike the legacy site's red-everywhere CTAs |
| `surface` | `#ffffff` | Default page/card background |
| `surface-muted` | `#f7f8fa` | Alternating section background, placeholder media blocks |
| `surface-inverted` | `#101828` | Dark sections (hero, footer, CTA bands) |
| `text` | `#1a2233` | Primary text |
| `text-muted` | `#5b6472` | Secondary text, captions |
| `text-inverted` | `#f7f8fa` | Text on dark surfaces |
| `border` / `border-strong` | `#e3e6eb` / `#c7ccd4` | Hairlines, card borders, form borders |
| `success` / `warning` / `error` | `#1e7d47` / `#b7791f` / `#b3261e` | Form/system feedback states |

Primary buttons use `primary-600`, not the accent red — a deliberate departure from the legacy site, where every CTA was red regardless of context. Reserving red as an accent keeps it meaningful when it does appear.

## Spacing & layout

- Base spacing follows Tailwind's default 4px scale — no custom scale was introduced; the default is already consistent and there was no project-specific reason to override it.
- Page content is constrained by the `Container` component (`max-w-6xl`, `px-4`→`px-8` responsive gutters) rather than ad-hoc `container` classes repeated per page (as the legacy Bootstrap markup did).
- Vertical rhythm between page sections is standardized via the `Section` component (`py-16 sm:py-20`), so spacing doesn't drift page-to-page the way it did in the legacy site (`40px 0`, `4rem 0`, `60px 0` were all used interchangeably for the same kind of section).

## Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | `0.25rem` | Small controls |
| `radius-md` | `0.5rem` | Buttons, inputs |
| `radius-lg` | `0.875rem` | Cards |
| `radius-xl` | `1.25rem` | Large media/feature blocks |

A restrained set, deliberately not the "everything is a pill" look the brief warns against.

## Shadows

Two tokens only — `shadow-soft` (resting state) and `shadow-elevated` (hover) — applied narrowly (cards, the sticky header on scroll). No drop-shadows on text, no glow effects.

## Buttons

Defined once in [`Button.tsx`](../frontend/src/components/ui/Button.tsx):

- **Primary** — solid `primary-600`, for the one main action per section.
- **Secondary** — white with a border, for a co-equal second action next to a primary button.
- **Ghost** — transparent, for low-emphasis actions inside dense UI (e.g. admin toolbars later).
- **Link** — text-only with an underline on hover, for "view all" / "read more" navigation.

The same component renders as a `<button>`, an internal `<Link>` (when given a `to` prop), or an external `<a>` (when given `to` + `external`), so call sites don't need to choose between three different button components depending on destination.

## Cards

One `Card` primitive: white surface, `border`, `radius-lg`, `shadow-soft` at rest, `shadow-elevated` on hover. Used for sermon/event/ministry tiles and form containers alike, so the "card" affordance means the same thing everywhere in the app.

## Motion

Deliberately minimal for this milestone: color/shadow transitions on interactive elements only (`transition-colors`, `transition-shadow`). The legacy site leaned on AOS for scroll-triggered fade/slide animations on nearly every section; V2 does not carry that forward by default — subtle, purposeful motion can be added per-component in Milestone 2 once real content exists to animate, rather than wrapping every section in the same effect by convention.
