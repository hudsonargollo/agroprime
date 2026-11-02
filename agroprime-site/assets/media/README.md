# Site media kit — Agro-Prime

Web-ready files only. Originals stay in `../../../agroprime-assets/instagram/` and `../../../agroprime-assets/facebook/`.

## video/ + posters/ (from their reels, graphics removed)

| File | Source | Spec | Use |
| --- | --- | --- | --- |
| `video/hero-nelore-pond.mp4` | IG reel 2026-10-07, t 32.2–42.0 s | 1120×630, 9.8 s, silent, 1.5 Mbps, 1.9 MB | Home hero background (auto-loop, muted). The earlier t 22–40 s cut included a rear angle at 26–30 s and was replaced. Poster: `posters/hero-nelore-pond.jpg` (frame at 3.3 s) |
| `video/genetics-closeup.mp4` | same reel, t 34–44 s | 880×495, 10 s, silent, 1.4 Mbps, 1.8 MB | Pilares › Genética tab (panel 1). Poster: `posters/genetics-closeup.jpg` |

Both were cropped to cut the corner logo watermark and have no audio or captions. They are silent by design — keep them `muted playsinline loop preload="none"` and pair with a poster + a dark gradient so white type stays legible.

Not usable as clean footage: reels 10-20 (weighing), 10-29 (bath), 10-15 (feedlot), 10-12 (paperwork) all carry burned-in captions or a watermark that floats across frame; 10-07 also opens and closes with a logo card (trimmed out). Clean single frames were still pulled from 10-07, 10-20 and 10-29 for the photo set below.

## backgrounds/ (generated)

| File | Use |
| --- | --- |
| `backgrounds/meat-premium.jpg` (1792×1024) | Carnes Prime Market band; pairs with the crimson accent |
| `backgrounds/genetica-nelore.jpg` (1536×1024) | Genética split feature (replaced the former video); generated art direction |

Two earlier generated backgrounds — `feedlot-dusk.jpg` and `nelore-genetics.jpg` — were retired when real reel stills replaced them and are no longer served.

## textures/ (generated, tile-friendly)

| File | Use |
| --- | --- |
| `textures/dark-hide.jpg` | Default body/section background instead of flat black |
| `textures/gold-foil.jpg` | CTA band, badges, thin rules (use at low opacity, `background-blend-mode: overlay`) |
| `textures/cream-linen.jpg` | Light editorial sections (Nosotros, Beneficios) |

## photos/ (their own posts, graphics cropped out)

| File | Source | Use |
| --- | --- | --- |
| `photos/nelore-pond.jpg` (576×720) | IG 2026-10-07, t 20 s | Modelo figure — Nelore by the water, no captions |
| `photos/feedlot-cattle.jpg` (700×875) | IG 2026-10-20, t 20 s | Pilares › Nutrición — feedlot pens, cropped away from the on-screen copy and crest |
| `photos/corral-cattle.jpg` (700×875) | IG 2026-10-29 “Bañito de élite”, t 4 s | Pilares › Sanidad — Nelore at the chute, cropped above the banner |
| `photos/santa-cruz-herd.jpg` (315×200) | Facebook flag post | Contacto postcard — Santa Cruz flag over the herd |
| `photos/carneprime-flatlay.jpg` (1024×1024) | Carnes Prime FB | Grupo — real products; the site crops to 4:5 |

The leather crest lives outside this folder, at `../../img/leather-crest.webp` (trimmed from `../../../agroprime-assets/brand/agroprime-leather.webp`). It is used for the hero crest above the location line, the centred Modelo brand-card seal, the footer brand mark and a faint Contacto watermark, all with empty `alt`.

## Governance

- Generate nothing that pretends to be their facilities or animals as documentary evidence. `meat-premium.jpg` and `genetica-nelore.jpg` are art direction; the media note beside the pillars, the Genética caption and the footer disclose generated imagery.
- `logo-badge.jpg` in the archive is the only logo source available — ask the client for `SVG` or `PNG` with transparency before launch.
- Video/photo rights belong to Agro-Prime; this kit is for the build, publish after their OK.
