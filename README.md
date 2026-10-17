# DignaStudio — static portfolio site

A code-only clone of your Framer portfolio (digna.framer.ai), ready to host for free on
GitHub Pages. No builder, no backend, no platform dependency — plain HTML/CSS/JS.

## What's inside

```
index.html                      Home (hero, highlighted projects, UGC, branding, about, organisations)
work.html                       Projects & branding overview
contact.html                    Contact page with form
projects/…                      framedworks, lets-dance, powervrouwen, sydney-heel-pain-clinic
branding/…                      alchemy-all-metal, ligvoetig, rederij-stiphout, stoked
assets/css/style.css            All styling
assets/js/main.js               Menu, animations, counters, form logic
assets/fonts/                   Perandory Regular + Perandory Condensed (woff2)
assets/images/                  All 73 site images (downloaded from the Framer CDN)
```

## Put it live on GitHub Pages (free, ~5 minutes)

1. Create a GitHub account/repo if you don't have one: github.com → New repository
   (e.g. `portfolio`, set it to **Public**).
2. Upload everything in this folder (GitHub web UI: "uploading an existing file" works
   fine — drag the whole contents in, commit).
3. In the repo: **Settings → Pages** → Source: "Deploy from a branch" → Branch: `main`,
   folder: `/ (root)` → Save.
4. Your site goes live at `https://YOUR-USERNAME.github.io/portfolio/` (takes 1–2 minutes).

Optional: buy a domain and connect it under Settings → Pages → Custom domain.

## Things to update (search for these in the code)

| What | Where | Note |
|---|---|---|
| UGC carousel covers | `index.html` (search "UGC CAROUSEL") | The original carousel was fed by Framer's CMS, so it couldn't be copied automatically. Drop your video covers into `assets/images/` and replace the placeholder cards. |
| Stat counters | `index.html` (search `data-count`) | "6" years and "+100" content are placeholders — the real numbers live in your Framer CMS and are animated, so I couldn't read the target values. |
| LinkedIn / Instagram links | done | Wired to linkedin.com/in/digna-lambrichts and instagram.com/diignaa. |
| Contact form | `contact.html` | Already wired to FormSubmit.co (no account needed). The first time someone submits, you get one activation email — click it once and all messages arrive in your inbox. |
| Email address | everywhere | Currently `digna.lambrichtsx@gmail.com` (as on the live site). |

## Editing tips

- Text: it's all plain HTML — open any page, find the words, change them.
- Colors/fonts: one place, `assets/css/style.css` (variables at the top).
- The two Perandory font files are self-hosted, so the wordmark works anywhere.
  Geist/Inter/Space Grotesk load from Google Fonts.
- All image files keep their original Framer names, so you can swap any image
  1:1 by overwriting the file in `assets/images/`.

## Deviation from the original (small, honest list)

- The hero "video" on the Framer site is actually a photo with a slow zoom —
  recreated with a pure-CSS zoom, no video file needed.
- The UGC carousel and stat counters come from Framer's CMS and are not
  copyable statically (see table above).
- The contact form needs a form service (Formspree) since GitHub Pages has no backend.
- Everything else — layout, sections, copy, images, fonts, colors — mirrors the site.
