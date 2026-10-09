# Muhammad Abdullah: Portfolio

**Live site:** [abdullah-683.github.io](https://abdullah-683.github.io/)

Personal portfolio for a BI and data analyst who builds production ETL pipelines on Google BigQuery and maintains Looker Studio dashboards for sales, marketing, and finance teams.

The site is designed like one of my own pipeline monitors. The hero shows a simulated daily ingestion run where 64 jobs load, a few fail and retry, and every table ends up fresh, because reliability is what I focus on most.

---

## Features

| Section | What it does |
|---|---|
| Sticky navigation | Stays pinned while scrolling, with a color progress bar and automatic highlighting of the current section |
| Job board | A simulated run of 64 jobs colored by source. Click any finished job, or press "Force a failure," to watch a retry recover |
| About | A light polaroid-style portrait card with a 3D tilt that follows the cursor |
| Pipeline map | An animated SVG showing data flowing from nine sources through BigQuery to the sales, marketing, and finance dashboards. Select a source to trace its path |
| Reliability | The three practices that keep 60–70+ daily jobs healthy |
| Skills | A filterable skill explorer where each skill shows where it was used, and the matching experience tags light up |
| Experience | An expandable timeline built on native `<details>` elements |
| Contact | Email and LinkedIn links, plus a one-click button to copy the email address |

**Quality floor:** responsive down to mobile, visible keyboard focus, `prefers-reduced-motion` respected (all animation turns off), and no framework or build step.

---

## Tech stack

- **HTML, CSS, and vanilla JavaScript.** No frameworks and no dependencies.
- **Google Fonts:** Schibsted Grotesk for text, IBM Plex Mono for the job log.
- **SVG** for the pipeline map and the favicon.
- **Hosting:** GitHub Pages.

---

## File structure

```
├── index.html                  Page structure and content
├── styles.css                  Design tokens, layout, core components, animations
├── extras.css                  Sticky nav and portrait card styles
├── script.js                   Job board, pipeline map, skills explorer, scroll effects
├── extras.js                   Sticky nav behavior, scroll progress, portrait tilt
├── favicon.svg                 Site icon
├── Muhammad_Abdullah_CV.pdf    Linked from the Download CV button
├── images/
│   └── profile.png             Portrait photo
└── README.md
```

---

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

---

## Deployment

The site deploys automatically from the `main` branch through GitHub Pages (Settings, then Pages, then Deploy from a branch, then `main` and `/ (root)`).

To publish a change, edit or upload the file on GitHub and commit. The live site updates within one to two minutes. If you still see the old version, hard refresh with `Ctrl+Shift+R`.

---

## Editing guide

| To change | Edit |
|---|---|
| Headline, intro text, About copy | `index.html` |
| Hero stats (70+, 8+, 40) | The `data-to` attributes in the `#stats` block of `index.html` |
| Skill descriptions | The `SK` array in `script.js`. The third value of each entry is the evidence text |
| Data sources on the pipeline map | The `SRC` array in `script.js` |
| Source and skill colors | The `G` and `K` objects in `script.js` |
| Experience tags | The `data-tags` attribute on each `.tags` div in `index.html`. Tag names must exactly match skill names in `SK` |
| Base colors and typography | The `:root` tokens at the top of `styles.css` |
| Portrait card | Under "Light picture card" in `extras.css` |
| Profile photo | Replace `images/profile.png`, keeping the same filename |
| CV | Replace `Muhammad_Abdullah_CV.pdf`, keeping the same filename |
| Favicon | Edit the colors in `favicon.svg` |

> **Filenames are case-sensitive on GitHub Pages.** `Profile.PNG` and `profile.png` are different files.

---

## Color system

Colors encode meaning consistently across the job board, the pipeline map, the skills, and the favicon.

| Color | Hex | Sources | Skills |
|---|---|---|---|
| Rose | `#C2416B` | Social (Meta Graph API, Metricool) | Data sources |
| Indigo | `#4453C7` | Ads (Meta Ads, LinkedIn Ads) | Languages |
| Sky | `#1F86C2` | Web analytics (GA4, Search Console) | BI and reporting |
| Teal | `#0E7A75` | CRM and automation (Salesforce, Pardot) | Cloud and warehouse |
| Violet | `#7A4FC2` | Scraping (Selenium) | Practice |
| Amber | `#C98A12` | Retry state on the job board | |

---

## Contact

- **Email:** abdullahjamshed683@gmail.com
- **LinkedIn:** [linkedin.com/in/muhammad-abdullah683](https://linkedin.com/in/muhammad-abdullah683)
- **Location:** Lahore, Pakistan

---

*The job board is a simulation modelled on a real daily schedule. No client data appears on this site.*
