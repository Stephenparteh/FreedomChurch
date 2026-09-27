# Migration Notes

What happened to the legacy site, concretely, across Milestones 1 and 2.

## What moved

Every legacy file was moved with `git mv` (history-preserving) into [`legacy/`](../legacy/), unmodified:

```text
index.html, about.html, contact.html, event.html, give.html,
media.html, ministries.html, sermons.html, testimonies.html,
style.css, images/, videos/
→ legacy/<same path>
```

`legacy/` is not built, served, or referenced by the new frontend. It exists purely as the historical reference for this migration and for recovering any content decided to be reused later.

## What was migrated into the new frontend

- **Page taxonomy**: Home, About, Ministries, Sermons, Events, Give, Contact, plus a new Gallery page (previously a broken link — see below). Reflected as real routes in `frontend/src/routes/router.tsx`.
- **Church name** ("National Freedom Pentecostal Church") and short name ("NFPC").
- **Ministry categories**: Worship, Children's, Outreach — carried into `frontend/src/data/placeholders.ts` as sample data, explicitly marked as placeholder pending real ministry descriptions.
- **General section patterns**: hero → about teaser → sermons → events → CTA on the homepage; a leadership grid and "faith pillars" layout on About — these layout ideas survived even though the legacy copy behind them did not (see below).

## What was intentionally left behind / not migrated as fact

Per the milestone brief's explicit instruction not to invent or silently carry forward unconfirmed information, the following were **not** copied into the new site as real content — they're documented as needing confirmation instead (see [LEGACY_AUDIT.md](LEGACY_AUDIT.md) for the full comparison):

- **Contact details** (email/phone/address) — three different, mutually inconsistent versions existed across the legacy pages. `frontend/src/data/site.ts` uses `TODO_CONFIRM_*` placeholders instead of picking one arbitrarily.
- **Service times** — never listed anywhere on the legacy site in a structured way.
- **Church history / founding narrative** — the "founded 1990, expanded 2005" copy on `about.html` reads as generic template text, not confirmed history.
- **Leadership names/photos** — the legacy site used placeholder names ("Pastor John Doe", "Pastor Jane Smith", "Pastor Michael Johnson").
- **Testimonial names/quotes** — appeared to be placeholder/sample content, not real member testimonials.
- **`testimonies.html`'s footer content** — copy-pasted from an unrelated construction-company template ("SLD & Associate"); dropped entirely, not migrated in any form.
- **Media assets** (`images/OIP.jpg`, the two `.mp4` music videos) — likely third-party content of unclear licensing (see LEGACY_AUDIT.md); not copied into `frontend/` at all. `church.jpg`, `churchAudience.jpg`, `widerAudience.jpg`, and the logo files are more likely to be real church photography and are reasonable candidates for reuse once optimized, but no images were migrated in this milestone — every page currently uses a neutral placeholder block instead.
- **The Melbourne, Australia Google Maps embed** on the legacy contact page — dropped; wrong location, not a real value to preserve.

## New in V2 that didn't exist in legacy

- **`/gallery` route** — `gallery.html` was linked from the legacy nav but never existed. It's now a real page (currently placeholder content).
- **`/admin/*` route tree** — the legacy site had no administration surface at all. Route shells exist now; functionality lands in Milestone 4 ([DASHBOARD_PLAN.md](DASHBOARD_PLAN.md)).
- **A single shared Header/Footer/design system** — replacing 9x duplicated navbar/footer markup and 3 inconsistent color schemes.

## Milestone 2 additions

Milestone 1 left every page image as a neutral placeholder block, pending a decision on which legacy assets were trustworthy. Milestone 2 made that decision by actually opening the images (not just reading filenames):

- **`churchLogo-removebg-preview.png` migrated.** Visual inspection showed this is a real, detailed church crest (open Bible, dove, map of Africa, US flag motif, raised hands) with a genuine motto, **"You Must Be Free."** Resized (source is only 200×199px) and moved to `frontend/src/assets/brand/nfpc-logo.png`. Now used in the live `Header` and `Footer`. The motto is recorded in `frontend/src/data/site.ts` as `siteConfig.motto` and used on the homepage hero and About page.
- **`churchAudience.jpg` and `widerAudience.jpg` migrated.** Visual inspection confirmed these are genuine photos of the actual NFPC congregation ("N.F.P.C" signage visible in-frame). Optimized from ~500KB JPEGs to ~350KB (full) / ~90KB (thumbnail) `.webp` files via a one-off `sharp` script (not a permanent dependency — installed, run, uninstalled), output to `frontend/src/assets/photos/`. Used in the homepage hero, the About page, and as the entire content of the new `/gallery` page.
- **`church.jpg` explicitly excluded, with a corrected understanding of why.** Milestone 1's audit only guessed it was "likely real church photography." Milestone 2's visual inspection shows it's a photo of a glossy American-style church building with a steeple — architecturally nothing like the real sanctuary in the verified photos above. It does not depict NFPC's building and was not migrated.
- **`openBible.jpg`, `wideOpenBible.jpg`, `OIP.jpg`, and both `.mp4` videos remain excluded**, unchanged from the Milestone 1 decision — licensing/rights still unconfirmed.
- **Testimonials were not migrated in any form**, including as placeholder UI — per the milestone brief, fabricating testimony content (even clearly-labeled placeholder testimony) was judged worse than omitting the section entirely until real testimonials exist.
- **`docs/LEGACY_AUDIT.md`'s asset table and migration-recommendations table were corrected** to reflect the above — see that document for the updated per-asset verdicts.

## Still needs migration / decisions (tracked for later milestones)

- [ ] Church leadership confirms real contact info, service times, mission/vision copy, history, and leadership bios/photos → feeds `SiteSetting` (Milestone 3) and replaces the `TODO_CONFIRM_*` placeholders in the frontend. Full list in [MISSING_CONTENT.md](MISSING_CONTENT.md).
- [ ] Confirm licensing/rights on `OIP.jpg`, `openBible.jpg`, `wideOpenBible.jpg`, and the two music videos before any reuse.
- [ ] Real leadership bios/photos, real ministry descriptions, real sermon/event data, real testimonials — feed the backend models once Milestone 3 exists; until then `frontend/src/data/placeholders.ts` stands in.
- [ ] Decide whether `event-details.html`'s intended per-event detail view becomes a dedicated `/events/:id` route (likely, once events are backend-driven in Milestone 3) rather than guessed at now.
- [ ] More church photography beyond the 2 verified images, for a fuller gallery.
