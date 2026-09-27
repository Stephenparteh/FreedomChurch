# Legacy Audit

This document records what existed in the original NFPC website before the V2 rebuild, as found during the Milestone 1 inspection. The original files are preserved unmodified under [`legacy/`](../legacy/) — nothing described here was deleted.

## Current technology

- Static HTML, one file per page, no build tooling, no package manager (no `package.json` existed).
- Bootstrap 5 loaded from CDN — three different versions/channels used across pages (`5.0.2`, `5.3.0-alpha1`, `5.3.0`), so the pages were not actually running a consistent version of their own CSS framework.
- AOS (Animate On Scroll) loaded from three different CDNs (`cdnjs`, `jsdelivr`, `unpkg`) across different pages, again inconsistently versioned (`2.3.1` vs `2.3.4`).
- Bootstrap Icons, also CDN-loaded, versions `1.10.5` and `1.11.1` both in use.
- No JavaScript files — only inline `<script>` blocks (mostly library init calls like `AOS.init()`).
- No backend, no database, no server-side code of any kind.
- No `.gitignore`, no README, no CI/deployment configuration.

## Current structure (as found)

```text
/
├── index.html
├── about.html
├── contact.html
├── event.html
├── give.html
├── media.html
├── ministries.html
├── sermons.html
├── testimonies.html
├── style.css            (mostly commented-out; ~15 real lines)
├── images/               (8 files, unoptimized, up to 884 KB each)
└── videos/               (2 files, ~34 MB combined)
```

Every page duplicates the same ~40-line Bootstrap navbar markup and the same footer markup by copy-paste, and every page except `testimonies.html` embeds its own `<style>` block in `<head>` rather than sharing `style.css`. `style.css` itself is almost entirely commented out and contributes only a handful of hover-state rules.

## Existing pages

| Page | Purpose | Notable content/functionality |
|---|---|---|
| `index.html` | Homepage | Bootstrap carousel hero (3 slides), "About Us" teaser, 3 sermon card placeholders, 3 event card placeholders, CTA band, footer |
| `about.html` | About the church | Vision/mission paragraph, a 4-item "History" timeline, a 3-person leadership grid, a 4-item "Our Faith" card row |
| `contact.html` | Contact | Name/email/phone/message form (`action="#"`, not wired to anything), an embedded Google Map iframe pointed at **Melbourne, Australia** (not the church's actual location — leftover template data), a contact-info block |
| `event.html` | Events | Category/date filter UI (non-functional), 3 upcoming event cards, 3 past event cards, 3 testimonial cards, an event registration form (`action` unset), a newsletter signup form |
| `give.html` | Giving | Donation form with amount/purpose/payment-method fields (`action="#"`), an "Other Ways to Give" section using `via.placeholder.com` icons |
| `media.html` | Photo/video gallery | 6-image grid (only 3 distinct images, repeated twice), 4 embedded `<iframe>` tags pointing directly at local `.mp4` files (not a valid way to embed video — should be `<video>`), 3 testimonial quotes, 3 broken social "embed" iframes pointing at bare profile URLs (`instagram.com/yourchurchprofile`, etc. — placeholder handles) |
| `ministries.html` | Ministries | 3 ministry blocks (Worship, Children's, Outreach) using `via.placeholder.com` images and `href="#"` join links |
| `sermons.html` | Sermon library | Featured sermon with a real embedded `<video>` (one of the two local `.mp4` files), search/sort UI (non-functional), sermon cards linking to `facebook.com/NFPChurch/videos/VIDEO_ID*` (placeholder IDs, not real links), an "Upcoming Sermons" and "Popular Sermons" section, a testimonial carousel |
| `testimonies.html` | Testimonials | **Structurally a different site** — dark theme (`bg-dark`, `bg-danger` navbar/footer) instead of the light Bootstrap theme every other page uses; 6 testimonial cards with placeholder names and broken image paths (`apostleGeorge.jpg`, `member2.jpg`...`member6.jpg` — none exist in `images/`); nav links to `event.html`/`ministries.html`/`contact.html` but **omits Sermons, Media, and Give**, and links to a `gallery.html` that never existed |

Two pages are linked from navigation but were never created: **`gallery.html`** (linked from `testimonies.html`'s nav and footer) and **`event-details.html`** (linked from every "Learn More" button on `event.html`).

## Existing functionality

- **Bootstrap carousel** on the homepage hero (client-side only).
- **AOS scroll animations** on most pages.
- **Bootstrap collapse** for the mobile nav toggle.
- **Three `<form>` elements** (contact, event registration, newsletter signup, donation) — none has a working `action`; all would silently no-op or reload the page on submit.
- **One working embedded video** (`sermons.html`'s featured sermon, via a real `<video>` tag).
- **Four broken video embeds** (`media.html`'s `<iframe src="videos/*.mp4">` — iframes cannot play local video files as a playable player this way in most browsers).
- **Google Maps iframe** pointing at the wrong country.

## Existing assets

| Asset | Notes |
|---|---|
| `images/churchLogo.jpg`, `churchLogo-removebg-preview.png` | Church logo, two versions (one background-removed) |
| `images/church.jpg`, `churchAudience.jpg`, `widerAudience.jpg` | Photos of the congregation/sanctuary — likely real church photography, candidates for reuse |
| `images/openBible.jpg`, `wideOpenBible.jpg` | Generic open-Bible stock-style photos |
| `images/OIP.jpg` | Filename is the default name Bing Images gives cached thumbnails — this is almost certainly a downloaded stock/reference image, not original church content. **Do not carry this forward without confirming licensing.** |
| `videos/Eugy_Official_-_He_Called_Me_...mp4`, `videos/_I_Got_a_Secret..._Visualizer_...mp4` | Two gospel music videos, ~15MB and ~19MB. Filenames suggest these are third-party official music videos (artist "Eugy", a track titled "I Got a Secret"), not church-produced content. **Confirm rights/permission before reusing in V2** — likely should be replaced with the church's own sermon/service recordings. |

No fonts, icon sets, or design files (Figma/PSD/etc.) were found in the repository.

## Reusable content

Content worth carrying forward as a *starting point*, pending confirmation:

- Church name: **National Freedom Pentecostal Church**.
- Ministry names/categories: Worship Ministry, Children's Ministry, Outreach Ministry.
- General page taxonomy: Home, About, Sermons, Events, Ministries, Media/Gallery, Give, Contact — this structure is reused in the new site's route architecture (see [ARCHITECTURE.md](ARCHITECTURE.md)).
- The general shape of the "Our Faith" pillars (Scripture, Love, Prayer, Community) as a *layout pattern*, though the copy itself is generic and needs real doctrinal content.

Content that is **not** reusable as fact and must not be presented as real in V2 until confirmed by church leadership — see the conflicts documented below.

## Problems

- **No shared components.** The navbar and footer are duplicated verbatim in all 9 files; a single content change (e.g. adding a nav link) requires editing every file.
- **Conflicting/inconsistent facts across pages**, none of which should be assumed correct:
  - Email: `contact@nfpchurch.org` (most footers) vs. `nfpchurch@gmail.com` (`testimonies.html` footer) vs. `info@churchname.com` (`contact.html` body — literally unedited template text).
  - Phone: `+1 234 567 890` (most footers, clearly placeholder) vs. `+123-456-789` (`contact.html`, `give.html`) vs. two partially-redacted numbers in `testimonies.html` (`0777******`, `0888******`).
  - Address: `123 Church Lane, City, Country` (placeholder, in every footer) vs. `Police Academy Paynesville` (`testimonies.html` footer — reads as a real, Liberia-specific location, inconsistent with the placeholder US-style address used everywhere else).
  - Church founding narrative on `about.html` (1990 founding, 2005 expansion, etc.) reads as generic template copy, not confirmed history.
- **`testimonies.html`'s footer is copy-pasted from an unrelated construction-company template** — it reads "SLD & Associate... We are a construction company committed to delivering high-quality projects..." This is a clear leftover artifact that must not carry forward.
- **Broken navigation**: links to `gallery.html` and `event-details.html`, neither of which exists.
- **Broken images**: `testimonies.html` references `apostleGeorge.jpg`, `member2.jpg`–`member6.jpg`, none of which exist in `images/`.
- **Inconsistent design language**: at least three different color schemes are in play (`#0056b3` blue used in `index.html`/`about.html`, `#003366` navy used in `contact.html`/`give.html`/`ministries.html`, and `testimonies.html`'s Bootstrap `bg-danger`/`bg-dark` red-and-black theme) — the site does not read as one product.
- **No responsive design intent beyond Bootstrap's defaults** — no custom breakpoint handling, several fixed-height hero sections (`100vh` carousel) that behave poorly on short mobile viewports.
- **No accessibility care**: decorative `<img>` tags without meaningful `alt` text in places, color contrast not verified, no visible focus states beyond browser defaults, icon-only footer links with no accessible labels.
- **No semantic structure to speak of** beyond Bootstrap's own markup conventions — headings are chosen by visual size, not document outline.
- **Non-functional forms everywhere** — every form on the site is decorative; nothing submits anywhere.
- **Unoptimized media** — several images are 500KB–900KB, videos are tens of MB, all served unminified/uncompressed from the repo itself.
- **No content management** — every piece of text requires editing raw HTML and redeploying.
- **No backend, database, or authentication** of any kind.

## Migration recommendations

| Area | Recommendation | Rationale |
|---|---|---|
| Page taxonomy (Home/About/Ministries/Sermons/Events/Gallery/Give/Contact) | **Keep** | Sound information architecture; matches common church-site patterns |
| Navbar/footer markup | **Rewrite** | Duplicated 9x; becomes shared `Header`/`Footer` components |
| Bootstrap/AOS/jQuery-era stack | **Replace** | Superseded by React + Tailwind; no reason to keep three inconsistent CDN versions |
| Church name, ministry names/categories | **Keep** | Real identity content |
| Contact details, service times, founding history | **Archive, do not migrate as fact** | Conflicting/placeholder across pages; must be reconfirmed with church leadership before publishing |
| `testimonies.html` construction-company footer | **Delete on rebuild** (already excluded from V2) | Unrelated template leftover, not real content |
| `churchAudience.jpg`, `widerAudience.jpg`, `church.jpg`, logo files | **Keep, optimize** | Likely real church photography; convert to modern formats and compress before reuse |
| `openBible.jpg`, `wideOpenBible.jpg`, `OIP.jpg` | **Archive, verify licensing** | Stock-style imagery of unclear origin; `OIP.jpg` in particular looks like an unlicensed downloaded image |
| Music videos in `videos/` | **Archive, do not reuse without confirming rights** | Appear to be third-party official music videos, not church-produced sermon content |
| Contact/event/donation forms | **Rewrite** | None were functional; V2 forms will post to the real API (Milestone 3) |
| Google Map (Melbourne) | **Replace** | Wrong location entirely |
| `gallery.html`, `event-details.html` | **Build for real** | Previously broken links; now real routes (`/gallery`, and event detail views planned for Milestone 2/3) |

Nothing in `legacy/` was deleted. It remains in the repository as the historical reference for this migration.
