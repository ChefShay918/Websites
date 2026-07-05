# PrintsByShay — Shopify Theme Brief

## Project Overview

**Store name:** PrintsByShay  
**Platform:** Shopify Online Store 2.0  
**Type:** Portfolio build (not a live client store)  
**Product:** Graphic tees — handmade, printed in-house  
**Audience:** General / everyone  
**Vibe:** Warm, handmade, earthy, personal — like a small shop you stumbled upon and immediately trusted

---

## Brand Tokens

### Color Palette

| Token | Hex | Use |
|-------|-----|-----|
| `--color-background` | `#F5F0E8` | Page background (warm cream) |
| `--color-accent` | `#C4622D` | Primary CTA, highlights (terracotta) |
| `--color-text` | `#2C2416` | Body text (warm charcoal) |
| `--color-secondary` | `#8A9E7B` | Secondary accents (dusty sage) |
| `--color-sand` | `#D4B896` | Borders, subtle backgrounds (sand) |
| `--color-white` | `#FFFFFF` | Cards, overlays |

### Typography

| Role | Font | Weight |
|------|------|--------|
| Display / Headlines | Playfair Display | 700 |
| Subheadings | Lora | 600 |
| Body | DM Sans | 400, 500 |
| Labels / Caps | DM Sans | 500, uppercase |

Load via Google Fonts:
```
https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lora:wght@600&family=DM+Sans:wght@400;500&display=swap
```

---

## Products

- **Type:** Digital design files (PNG, SVG, PDF)
- **Delivery:** Instant download via Shopify Digital Downloads app (free app — must be installed)
- **No physical variants** — no size or color options
- **Product cards:** Show "Instant Download" badge instead of "Choose Options"
- **Product pages:** Include a "What's Included" section — file types (PNG, SVG, PDF), dimensions, and usage rights
- **Collections:** Sports, Humor, Mama, Seasonal, Kiddos, New Releases, Best Sellers
- **Price point:** ~$3–$8 per design, bundle packs ~$15–$25
- **No shipping required** — digital only

---

## Homepage Sections (in order)

### 1. Announcement Bar (`pbs-announcement-bar`)
- Text: "Handmade with love · Free shipping on orders over $50"
- Background: `--color-accent` (terracotta)
- Text: white
- Schema setting: `announcement_text` (text)

### 2. Header (`pbs-header`)
- Logo: SVG file — `assets/logo-light.svg` (use on cream/light backgrounds)
- Render via `<img>` tag pointing to `'logo-light.svg' | asset_url` — do NOT use `image_tag` filter (SVGs don't go through Shopify CDN image transforms)
- Schema settings: `logo_width` (range 100–300, default 180) for sizing
- Nav links: Shop, Collections, About, Contact
- Icons: Search, Cart
- Sticky on scroll
- Background: `--color-background`

### 3. Hero (`pbs-hero`)
- Full-width banner
- Headline: "Wear Something That Means Something"
- Subtext: "Instant digital downloads — buy, download, create."
- CTA button: "Shop Now" → `/collections/all`
- Background: image with warm overlay, fallback to `--color-sand`
- Schema settings: `heading`, `subheading`, `cta_label`, `cta_url`, `image`, `overlay_opacity`

### 4. Featured Products (`pbs-featured-products`)
- Section heading: "Shop Our Favs"
- Product carousel / grid (4–6 products)
- Each card: product image, title, price, "Instant Download" button
- Schema settings: `heading`, `collection` (collection picker), `products_to_show` (range 2–12)

### 5. Collections Grid (`pbs-collections-grid`)
- Section heading: "Shop by Vibe"
- Grid of collection tiles with image + title overlay
- Suggested collections: Sports, Humor, Mama, Seasonal, Kiddos, New Releases, Best Sellers
- Schema settings: `heading`, blocks of type `collection` (collection picker + label)

### 6. About Blurb (`pbs-about`)
- Heading: "Designs Made with Heart. Yours Instantly."
- Body: 2–3 sentences about the brand — personal, warm tone focused on digital designs and instant delivery
- Optional image (photo of shirts, workspace, etc.)
- CTA: "Learn More" → `/pages/about` (optional)
- Layout: text left, image right (or stacked on mobile)
- Schema settings: `heading`, `body` (richtext), `image`, `cta_label`, `cta_url`

### 7. Email Signup (`pbs-email-signup`)
- Heading: "Stay in the Loop"
- Subtext: "New designs, restocks, and deals — straight to your inbox."
- Email input + Subscribe button
- Background: `--color-secondary` (sage) with white text
- Uses Shopify's native newsletter form

### 8. Footer (`pbs-footer` via footer group)
- Logo: `assets/logo-dark.svg` (white/cream version for dark footer background)
- Render via `<img>` tag pointing to `'logo-dark.svg' | asset_url`
- Columns: Quick Links (Shop, Collections, Contact, FAQ), Follow Us (social icons), Newsletter teaser
- Payment icons row
- Copyright: "© {year} PrintsByShay · Powered by Shopify"
- Background: `--color-text` (charcoal), text: `--color-sand`

---

## File Structure

Follow standard OS 2.0 layout. Use `pbs-` prefix on all custom sections to avoid conflicts:

```
layout/
  theme.liquid
sections/
  pbs-announcement-bar.liquid
  pbs-header.liquid
  pbs-hero.liquid
  pbs-featured-products.liquid
  pbs-collections-grid.liquid
  pbs-about.liquid
  pbs-email-signup.liquid
  pbs-footer.liquid
  main-product.liquid
  main-collection.liquid
  main-page.liquid
  main-cart.liquid
  main-404.liquid
snippets/
  css-variables.liquid
  product-card.liquid
  meta-tags.liquid
assets/
  base.css
  global.js
  logo-light.svg        ← light background version (cream bg, dark text)
  logo-dark.svg         ← dark background version (charcoal bg, light text)
templates/
  index.json
  product.json
  collection.json
  page.json
  cart.json
  404.json
config/
  settings_schema.json
  settings_data.json
locales/
  en.default.json
  en.default.schema.json
```

---

## Key Patterns & Rules

1. **All colors, fonts, and spacing driven by CSS custom properties** from `snippets/css-variables.liquid` — never hardcode hex values in section CSS.
2. **Images:** Always use `image_url` + `image_tag` for responsive output. Never hardcode CDN URLs. Never chain `| escape` after `image_tag` — it will silently break image rendering.
3. **Text strings:** Use `| t` filter + `locales/en.default.json` for all user-facing strings.
4. **URLs:** Use `routes.*` — never hardcode `/collections/all` or similar.
5. **Block wrappers:** Always emit `{{ block.shopify_attributes }}` on block elements so the theme editor works.
6. **Presets:** Every content section (`pbs-hero`, `pbs-about`, etc.) must have a `presets` block in its schema so merchants can add it from the editor.
7. **`main-*` sections:** No preset needed — they're placed by templates directly.
8. **JSON is pure JSON:** No Liquid, no comments, no trailing commas inside `{% schema %}` blocks or `templates/*.json`.

---

## Validation

Before packaging:

```bash
# Check JSON validity
find . -name '*.json' -print0 | xargs -0 -I{} python3 -c "import json,sys; json.load(open('{}'))" 

# Run Shopify linter
shopify theme check

# Preview locally
shopify theme dev
```

Run `scripts/validate-theme.py` if present — checks JSON validity, embedded schema, cross-references, and Liquid filter-chaining bugs.

---

## Delivery Notes

- Push using `shopify theme push --theme THEME_ID` to avoid creating duplicate themes
- Run `shopify theme list` first to get the correct theme ID
- Dev store preview is mandatory before final delivery — structural validation alone is not sufficient
- Repo: `~/Projects/shopify-clients/prints-by-shay`
- GitHub: ChefShay918 / `prints-by-shay`

---

## What This Is NOT

- No custom order/upload flow
- No app development
- No Hydrogen / headless
- No live store data via Admin API
