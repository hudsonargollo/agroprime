# Agro-Prime — landing page

Static one-page site built from the client's Spanish executive summary and the archived Facebook/Instagram content. Spanish (Bolivia), single page, no build step, no tracking. The raw social archive lives in [`../agroprime-assets/`](../agroprime-assets/).

## Run locally

```bash
cd agroprime-site
python3 -m http.server 4173
# open http://127.0.0.1:4173
```

A local server is needed for the MP4s and self-hosted fonts (opening `index.html` from disk blocks them in some browsers).

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | All content, SVG icon sprite, JSON-LD, OG/Twitter meta |
| `assets/css/styles.css` | Design system, layout, responsive rules, reduced-motion/print styles |
| `assets/js/main.js` | Header state, mobile menu, tabs, in-view video, WhatsApp form |
| `assets/fonts/` | Barlow Condensed (500/600/700), Cormorant Garamond italic (variable), Inter (variable) — self-hosted |
| `assets/media/` | Web-encoded media served by the site: hero/feature clips, posters, backgrounds, textures, archived photos |
| `assets/img/` | Cropped/derived assets: transparent bull mark, transparent crest, leather crest, CSR and cowgirl crops, OG image, icons |
| `site.webmanifest`, `robots.txt`, `sitemap.xml` | PWA icon metadata and crawl files |

## Section order

1. Hero — silent looping reel, brand promise, primary WhatsApp CTA
2. Modelo — investment thesis, three principles, brand card, value proposition pull-quote
3. Pilares — interactive four-pillar tabs with a sticky media stage
4. Genética — split video feature and service proof points
5. Cómo trabajamos — four-step process and first-conversation CTA
6. Grupo — Carnes Prime Market, 10% partner benefit, store details
7. Nosotros — community/CSR, values, recruitment band (`rrhh@agroprime.com.bo`)
8. Contacto — WhatsApp composer (name/interest/message → `wa.me`), three phone lines, office, recruitment, socials
9. Footer — navigation, contact, legal line, AI art-direction disclosure

## Media mapping

- `video/hero-nelore-pond.mp4` — hero background. Recut from IG reel 2026-10-07, **t 32.2–42.0 s** (frontal angles only; the earlier t 22–40 cut included a rear angle). 1120×630, 9.8 s, silent, H.264 ~1.5 Mbps, 1.9 MB. Poster is a frontal frame at 3.3 s.
- `video/genetics-closeup.mp4` — Genética split feature. Same reel, t 34–44, 880×495, 10 s, silent.
- `photos/nelore-pond.jpg` (576×720) — Modelo figure. Crop of the same 2026-10-07 reel at t 20 s; clean frame, no captions or logo.
- `photos/feedlot-cattle.jpg` (700×875) — Pilares › Nutrición. Crop of the 2026-10-20 feedlot reel at t 20 s, framed to exclude the burned-in copy and crest watermark.
- `photos/corral-cattle.jpg` (700×875) — Pilares › Sanidad. Crop of the 2026-10-29 “Bañito de élite” reel at t 4 s, cut above the overlaid caption and banner.
- `photos/santa-cruz-herd.jpg` (315×200) — contact-card postcard. Crop of the Facebook Santa Cruz flag photo.
- `photos/carneprime-flatlay.jpg` — real Carnes Prime product image (kept square; the Grupo figure crops to 4:5).
- `backgrounds/meat-premium.jpg` — Carnes Prime section background (generated art direction).
- `textures/dark-hide.jpg`, `gold-foil.jpg`, `cream-linen.jpg` — section surfaces.
- `img/leather-crest.webp` (778×860) — tooled-leather crest derived from `../agroprime-assets/brand/agroprime-leather.webp`, trimmed to its alpha bounding box. Used as the header mark, the centred Modelo brand-card seal and a faint watermark in Contacto. Empty `alt`, `aria-hidden`.
- `img/csr-calf.jpg` — crop of the 2026-10-06 Hospital de Amor post, removing the caption and logo.
- `img/cowgirl-portrait.jpg` — crop of the 2026-10-11 Día de la Mujer Boliviana post, removing caption/logo; client-generated content, not documentary.
- `img/crest.png` — original gold crest, shown on a white plaque in the Nosotros tile (crop of the supplied JPEG, not a redrawn logo).

Two earlier generated backgrounds (`feedlot-dusk.jpg`, `nelore-genetics.jpg`) were removed once real reel stills replaced them; the originals remain in the archive.

Generated imagery is disclosed in the footer and beside the pillars: “Algunas imágenes son dirección de arte generada…”. Keep that line until the client approves the art direction.

## Before launch — open client decisions

1. **TikTok** — the brief lists TikTok but no handle was verifiable. No TikTok link is published; add it only when the client supplies the exact profile.
2. **Instagram** — the brief lists Facebook + TikTok, but `@agroprime_bolivia` exists and is linked. Confirm whether IG should stay in the footer.
3. **Surname spelling** — brief uses **Añez Hurtado**; the published logo uses **Anez Hurtado**. The footer currently follows the brief.
4. **Logo** — the header mark and seals are crops of a JPEG. Request the official SVG/PNG with transparency before launch.
5. **Domain** — canonical URLs and JSON-LD use `https://agroprime.com.bo/`, based on the recruitment email in use. Confirm the production host.
6. **Carnes Prime benefit** — “10% para socios” comes from archived store content; the site adds “sujeto a condiciones vigentes en tienda.” Confirm terms.
7. **Rights / approvals** — publish only after Agro-Prime approves use of their photos/reels and the generated art direction.
8. **Analytics** — none installed. If added, include a consent mechanism appropriate for Bolivia/visitors.

## Deployment

Static hosting (Nginx/Apache/CDN). Upload the **contents** of `agroprime-site/` to the document root, preserve relative paths, serve HTTPS. The page has no server-side dependency; the form intentionally hands off to WhatsApp and stores nothing.

Suggested cache headers: HTML short/no-cache; `assets/fonts`, `assets/img`, `assets/media` long-lived with content hashes if the host supports them. Compress images/MP4 only if re-encoding; current kit is already web-sized (~1.9 MB hero + ~1.8 MB feature clip). When publishing, exclude `README.md` and `assets/media/README.md` — they are build notes, not page assets.

## QA performed

- Chrome headless at 1440×1000 and 390×844: no console errors, no broken images, fonts loaded, no horizontal overflow (marquee is clipped by design).
- Mobile menu: `aria-expanded`, `aria-hidden`, `inert`, body scroll lock, Escape, float hidden while open.
- Pillar tabs: mouse and arrow-key activation, roving `tabindex`, panel `aria-hidden` sync.
- Contact form: name validation, `aria-invalid`, and WhatsApp URL encoding verified (`https://wa.me/59169535546?text=…`).
- Reduced-motion: CSS disables transitions, reveal animations and the marquee; JS pauses background video playback when the media query is set.

**Not yet verified:** real-device iOS/Android autoplay, WhatsApp handoff on device, and screen-reader passes with VoiceOver/TalkBack. Do these before launch.

## Not deployed

This is a local build. No DNS, hosting, or production publishing has been done.
