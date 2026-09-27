# Migration Notes

What happened to the legacy site during Milestone 1, concretely.

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

## Still needs migration / decisions (tracked for later milestones)

- [ ] Church leadership confirms real contact info, service times, mission/vision copy, and history → feeds `SiteSetting` (Milestone 3) and replaces `TODO_CONFIRM_*` placeholders in the frontend.
- [ ] Confirm licensing/rights on `OIP.jpg` and the two music videos before any reuse; otherwise replace with original church media.
- [ ] Optimize and migrate `churchAudience.jpg`, `widerAudience.jpg`, `church.jpg`, and the logo files into the new frontend once approved.
- [ ] Real leadership bios/photos, real ministry descriptions, real sermon/event data — feed the backend models once Milestone 3 exists; until then `frontend/src/data/placeholders.ts` stands in.
- [ ] Decide whether `event-details.html`'s intended per-event detail view becomes a dedicated `/events/:id` route (likely, once events are backend-driven in Milestone 3) rather than guessed at now.
