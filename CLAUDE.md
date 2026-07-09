# Family Bond Solutions LLC — Shopify Theme Brief

## Business Overview
Family Bond Solutions LLC is a family-owned courier and delivery business based in Tulsa, OK. This is a **lead-generation marketing site**, not e-commerce — no cart, no products. The goal is quote requests and driver applications, same model as Tricia's Treats (native Shopify contact form, no checkout).

**Fleet:** sprinter van, moving van(s), box truck(s) (16–26ft range)
**Core services:**
1. Box Truck Delivery — last-mile, recurring routes, pallet/LTL freight
2. Medical Courier — lab specimens, pharmacy runs, confidential records, chain-of-custody, HIPAA-aware
3. On-Demand Courier — same-day pickup/delivery, documents/parts, sprinter & cargo van

**Service area:** Tulsa, Broken Arrow, Owasso, Bixby, Jenks, Sapulpa, Sand Springs, Claremore, Muskogee, Bartlesville, Skiatook, Okmulgee

**Contact info (for now — email only):**
- Email: familybondsolutionsllc@gmail.com
- Phone and HQ address: not in use yet — omit from the site entirely (no tel: links, no address block) until Shay provides them

**Reference source:** Lovable-exported page at `fresh-start-strips.lovable.app` — full HTML/copy captured, this brief translates it to OS 2.0.

---

## Brand Tokens

| Token | Value | Notes |
|---|---|---|
| Primary (brand red) | `#961D14` | Sampled from logo; brick/maroon, not bright red |
| Black | `#000000` | Header, footer, hero, drivers section backgrounds |
| Secondary (dark text/panel) | `#1A1A1A`–`#222222` range | Used for dark panel sections (e.g. medical courier feature) — confirm exact shade in dev store |
| Background (light) | `#FFFFFF` | Content sections |
| Muted background | `#F4F4F5`-ish light gray | Stats bar, subtle section dividers |
| Foreground text | near-black | Body copy on light sections |
| Accent (icon chips) | light gray/off-white | Icon badge backgrounds on light sections |

**Typography:** Bolder, more industrial display font for headings — use **Archivo Black** (or Anton-adjacent alternative; avoid reusing Anton since Tattoo Money Supplies already uses it) paired with **Inter** for body copy. Apply the heavy weight to all H1–H3 headings currently rendered as `font-black` in the Lovable source; keep body text in Inter for readability.

**Section naming convention:** `fbs-` prefix (e.g. `fbs-hero`, `fbs-services`).

---

## Homepage Sections (in order)

1. **Header** — logo (`fbs-logo.jpeg`, provided), nav (Services / Why Us / Drivers / Contact), "Get a Quote" CTA button. Sticky, black/90 backdrop blur.
2. **fbs-hero** — black bg, hero truck image (40% opacity overlay), "Tulsa, Oklahoma" location pill, H1 "Tulsa's trusted box truck & medical courier," subhead, two CTAs ("Request a Delivery Quote", "Drive With Us"), trust row (Same-day dispatch / Licensed & insured / HIPAA-aware).
3. **fbs-stats** — 4-stat bar: fleet size range, 24/7 dispatch, 100% Tulsa-based, On-time guarantee.
4. **fbs-services** — 3-card grid: Box Truck Delivery, Medical Courier (highlighted/inverted card), On-Demand Courier. Each card: icon, title, description, 3-item checklist.
5. **fbs-medical-feature** — dark panel, image + copy split. Chain-of-custody/HIPAA detail, "Request Medical Service" CTA.
6. **fbs-service-area** — light/accent bg, city chip grid (12 cities listed above).
7. **fbs-why-us** — 4-card grid: On-Time Guarantee, Fully Insured, Family Owned, Local Knowledge.
8. **fbs-drivers** — black bg, "Now Hiring" badge, requirements list + offers list (two columns), "Apply Online" + "Call" CTAs, driver photo with "Join the Team" callout badge.

   **⚠️ Hiring focus correction (per Shay):** Driver hiring is not box-truck-only — the primary need is **medical courier drivers**, with box truck / general courier as additional roles, not the headline. Rewrite the "Drive a box truck with people who treat you like family" headline and supporting copy (both the homepage teaser and the `/apply` page hero) to lead with medical courier driving, and mention box truck / sprinter / cargo van roles as also available. Don't drop the box truck requirements/experience fields — just reorder emphasis so medical courier reads as the main ask.
9. **fbs-quote** — split layout: contact info (email only for now — mailto link) + quote request form.
10. **Footer** — logo, copyright, email link only.

## Driver Application Page (`/apply`)
Separate page from the homepage — needs its own template (e.g. `templates/page.apply.json` with a dedicated `fbs-apply` section, or `templates/page.driver-application.json`).

**Hero:** "NOW HIRING — TULSA" badge (red), H1 "Driver Application" *(reframe per the hiring-focus correction above — consider "Medical Courier & Driver Application" or similar)*, subhead: tells applicant the team follows up within one business day. Drop the "prefer to call" line for now since no phone number is live.

**Requirements box:** 21+ with valid driver's license, Clean driving record, Pass background & drug screen, Smartphone with data, Business casual attire.

**Questions box:** Email only (familybondsolutionsllc@gmail.com).

**Form — "Tell us about you"** (note: "All fields marked * are required.")

*Contact info:*
- Full Name*
- Email*
- Phone*
- City / ZIP

*License & Experience:*
- Are you 21 or older?* (select)
- License Class* (select)
- License State (text)
- Years Driving Commercially (select)
- Box Truck Experience — select all that apply (checkboxes): 16 ft / 18 ft / 22 ft / 26 ft / Cargo / Sprinter / None
- Clean Driving Record?* (select)
- Willing to pass background & drug screen?* (select)

*Availability:*
- Availability* (select)
- Earliest Start Date (date input)
- Previous Employer / Driving Experience (textarea, placeholder: "Where have you driven? Routes, freight type, years...")
- Anything else we should know? (textarea, optional, placeholder: "Optional")

**Submit:** "Submit Application" button. In the Lovable version this opens the visitor's email app with a pre-filled `mailto:` to familybondsolutionsllc@gmail.com (client-side JS builds the mailto link from form values) rather than a server-side submission. Helper text: "Submitting opens your email app with your application pre-filled to familybondsolutionsllc@gmail.com. We reply within one business day."

**Decision:** Use a native Shopify contact form (same pattern as the quote form) — mailto is unreliable on devices without a configured mail client, and this keeps both forms consistent and delivery-guaranteed through Shopify's inbox.

## Quote Form (native Shopify contact form)
Build via `{% form 'contact' %}`, fields:
- Full Name* (text)
- Company (text)
- Email* (email)
- Phone* (tel)
- Service Needed (select: Box Truck Delivery / Medical Courier / On-Demand Courier / Recurring Route / Other)
- Delivery Details (textarea — pickup/drop-off, size, frequency, timing)

Submissions land in Shopify's contact message inbox, same as Tricia's Treats.

---

## File Structure (OS 2.0, per shopify-theme skill starter)
Standard starter scaffold, customized with:
- `sections/fbs-hero.liquid`
- `sections/fbs-stats.liquid`
- `sections/fbs-services.liquid`
- `sections/fbs-medical-feature.liquid`
- `sections/fbs-service-area.liquid`
- `sections/fbs-why-us.liquid`
- `sections/fbs-drivers.liquid`
- `sections/fbs-quote.liquid` (wraps native contact form)
- `sections/fbs-apply.liquid` (driver application form — see spec below)
- `templates/index.json` referencing all of the above in order
- `templates/page.apply.json` referencing `fbs-apply` (create a matching Page in Shopify admin titled "Apply" / "Driver Application")
- `snippets/css-variables.liquid` updated with brand token defaults above
- `assets/fbs-logo.jpeg` (from upload), hero/driver/medical stock imagery to be sourced or replaced with real photos

All copy, headings, and list items should be pulled directly from the Lovable export text captured above — don't paraphrase or invent new marketing copy unless Shay asks for a rewrite.

---

## Coding Rules (carry over from other clients)
- Drive all styling from theme settings via CSS custom properties — no hardcoded hex in section files.
- Watch for the `image_tag` + trailing filter chaining bug (documented in prior client builds) — never chain `| escape` or similar after `image_tag`'s named parameters.
- Use `routes.*` and `| t` for locale-safe links/text.
- Every content section needs a `preset` in its schema so it's insertable in the theme editor.
- Run `scripts/validate-theme.py` (or equivalent) before packaging.

## Validation Steps
1. `shopify theme check`
2. JSON parse check on all schema blocks and templates
3. **Dev store preview is mandatory** — render the actual page, don't rely on structural checks alone
4. Confirm native contact form submissions route correctly before calling this production-ready

---

## Open Questions for Shay
- Exact secondary dark panel hex (sampled range only — confirm against live Lovable preview if possible, since the CSS file wasn't fetchable from this environment)
- Real photography for hero/driver/medical images vs. keeping stock placeholders
