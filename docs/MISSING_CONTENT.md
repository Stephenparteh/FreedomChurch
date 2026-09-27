# Missing Content

Everything a church administrator needs to confirm or provide before the placeholder content built in Milestone 2 can be replaced with the real thing. Nothing listed here was invented — each item is either a `TODO_CONFIRM_*` value in the code or an asset deliberately excluded from the site. Cross-reference [LEGACY_AUDIT.md](LEGACY_AUDIT.md) for why each item is unconfirmed rather than just missing.

## Facts to confirm (currently `TODO_CONFIRM_*` in `frontend/src/data/site.ts`)

| Field | Current state | Why it's unconfirmed |
|---|---|---|
| Email | `TODO_CONFIRM_EMAIL` | Legacy site had 3 different values across pages |
| Phone | `TODO_CONFIRM_PHONE` | Legacy site had 3 different values, two partially redacted |
| Address | `TODO_CONFIRM_ADDRESS` | Legacy site had a placeholder US-style address in every footer, and a real-looking Liberia address only in `testimonies.html` |
| Service times (day/time) | `TODO_CONFIRM_TIME` for both listed services | Never listed anywhere on the legacy site in a structured way |
| Church history / founding story | Not published (`About` page shows a note instead) | Legacy `about.html` copy read as generic template text, not confirmed history |
| Mission/vision statement | Placeholder copy on the About page and homepage | Legacy copy was generic, not distinctly NFPC's own words |
| Doctrinal statement ("Our Faith" pillars: Scripture, Love, Prayer, Community) | Placeholder body copy per pillar | Legacy copy was generic; the *categories* are kept as a layout pattern, the *text* is not |
| Leadership names, roles, bios, photos | `TODO_CONFIRM_NAME` / `TODO_CONFIRM_ROLE`, no photos | Legacy site used placeholder names ("Pastor John Doe", etc.) |
| Social media links (Facebook/Instagram/Twitter) | `TODO_CONFIRM_URL` | Legacy footer icons all linked to `#` |
| Real ministry descriptions (beyond the 3 category names) | Sample copy in `frontend/src/data/placeholders.ts` | Category names (Worship, Children's, Outreach) are real; the descriptions are illustrative only |
| Sermons (titles, preachers, dates, video links) | Sample data | No real sermon has been catalogued yet — awaiting Milestone 3/4 |
| Events (titles, dates, locations) | Sample data | No real event calendar has been catalogued yet |
| Testimonials | Omitted entirely | Legacy `testimonies.html` names/quotes read as placeholder content, not real member testimonies — see the milestone brief's explicit instruction not to fabricate these. No testimonials section exists on the new site until real ones are provided. |

## Assets needed

| Asset | Status |
|---|---|
| Real photos beyond the 2 verified congregation photos | Only `churchAudience.jpg`/`widerAudience.jpg` (now in `frontend/src/assets/photos/`) are confirmed real. Everything else needs church-provided photography — sanctuary exterior, ministries in action, events, leadership headshots. |
| Leadership headshots | None exist. The About page currently shows a neutral "Pending" placeholder instead of a photo. |
| Ministry photos | None exist. The Ministries page currently uses a typographic monogram treatment instead of a photo. |
| Sermon thumbnails | None exist. |
| A confirmed church address, for an accurate map embed | The legacy Google Maps embed pointed at Melbourne, Australia — not reused. The Contact page currently shows a placeholder box instead of a map. |
| Licensing confirmation for `openBible.jpg` / `wideOpenBible.jpg` | Generic stock-style photography recovered from the legacy site; not used in V2 pending a licensing answer. |
| Rights confirmation for the two legacy `.mp4` files | Likely third-party music videos, not church-produced content; not used in V2 pending confirmation. |
| A usable `church.jpg` replacement | The legacy `church.jpg` depicts a building that isn't NFPC's (confirmed by comparing it against the real congregation photos). If exterior building photography is wanted for the site, it needs to be actually photographed. |

## How this gets resolved

These are church-leadership decisions, not engineering ones. Once confirmed:

1. Update `frontend/src/data/site.ts` and `frontend/src/data/placeholders.ts` directly (Milestone 2/3 boundary), or
2. Enter it through the admin dashboard once it exists (Milestone 4), which is the intended long-term path — see [DASHBOARD_PLAN.md](DASHBOARD_PLAN.md).

Until then, every `TODO_CONFIRM_*` string is intentionally visible in the UI rather than silently defaulting to something plausible-but-fabricated, so it's obvious at a glance what still needs a real answer.
