# Stephen Minemann · Analytics Engineer Portfolio

Single-page portfolio. Plain HTML, CSS, and vanilla JS. No build step, no framework.

## Running locally

```bash
# Option A — Python (no install)
python3 -m http.server 8080
# then open http://localhost:8080

# Option B — Node
npx serve .

# Option C — just double-click index.html
```

> **Note:** `file://` works for most things. The GitHub API fetch may be blocked
> by CORS in some browsers — use a local server for the full experience.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Source:** `main` branch, root folder `/`.
3. Save — URL appears in ~60 seconds. No server config needed.

## TODOs before publishing

Search for `TODO: Stephen` — there are seven spots:

| File       | What to change |
|------------|----------------|
| `index.html` | Add a headshot at `/assets/stephen.jpg` and uncomment the `<img>` in About |
| `index.html` | Associate Systems Architect role — add bullet points about current work |
| `index.html` | SRE Intern role — add 1–2 lines about what you worked on |
| `index.html` | Education — duplicate the cert card for each new cert |
| `index.html` | Project (e) — confirm `address-matching-ml` is sample-safe, then uncomment the repo link and change badge to `public` |

## Easter egg

Type **`es`** anywhere on the page (not in a text field) to switch all UI headings
and labels to Spanish. Type **`en`** to switch back. A toast appears on first toggle.

## File structure

```
portfolio-site/
├── index.html    — all sections, content, i18n data attributes
├── styles.css    — custom properties, glassmorphism, timeline, animations
├── script.js     — typewriter, GitHub API, scroll fx, i18n easter egg
├── README.md
└── assets/       — add stephen.jpg here for a headshot
```
