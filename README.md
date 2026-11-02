# Agro-Prime Bolivia — website

Single-page marketing site for **Agro-Prime** (*Negociaciones y Servicios Ganaderos — Añez Hurtado*), Santa Cruz de la Sierra, Bolivia: elite cattle genetics, feedlot/nutrition, cattle negotiations and the **Carnes Prime Market** retail brand.

Static HTML/CSS/JS. No build step, no framework, no tracking, self-hosted fonts and media.

## Preview

```bash
cd agroprime-site
python3 -m http.server 4173
# open http://127.0.0.1:4173
```

A server is required: browsers block the MP4s and fonts when `index.html` is opened from disk.

## Layout

| Path | Purpose |
| --- | --- |
| `agroprime-site/` | The complete site — this is what gets deployed |
| `agroprime-site/README.md` | Media mapping, section order, open client decisions, QA notes |
| `agroprime-assets/` | **Not in git.** Raw Instagram/Facebook archive + client brief, kept locally until image rights are cleared |

## Status

Built and QA'd locally at 1440 px and 390 px. **Not deployed.** Before launch, resolve the open decisions listed in [`agroprime-site/README.md`](agroprime-site/README.md): TikTok handle, official logo, surname spelling, production domain, Carnes Prime benefit terms, and approval for the client photos and AI art direction.

## Deploy

Upload the **contents** of `agroprime-site/` to the document root of a static host and serve over HTTPS. The contact form hands off to WhatsApp and stores nothing.
