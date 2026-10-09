# Muhammad Abdullah: Portfolio

Static portfolio site. No build step and no dependencies beyond Google Fonts.

## Files
- `index.html`: page structure and content
- `styles.css`: design tokens, layout, animations, and the color lock
- `script.js`: job board simulation, pipeline map, skills explorer, and scroll effects
- `Muhammad-Abdullah-CV.pdf`: linked from the Download CV button (add your own)

## Run locally
Open `index.html` in a browser, or serve the folder:
```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages
1. Create a repo named `<your-username>.github.io`.
2. Push all files to the `main` branch.
3. The site goes live at `https://<your-username>.github.io` within a minute or two.

Alternatives: drag the folder onto Netlify Drop, or run `firebase deploy` with Firebase Hosting.

## Editing content
- Skill evidence: edit the `SK` array in `script.js`. The third value is the description shown when someone selects a skill.
- Data sources: edit the `SRC` array in `script.js`.
- Experience tags: edit the `data-tags` attribute on each `.tags` div in `index.html`. Tag names must match skill names in `SK` exactly.
- Colors: change the category colors in `G` and `K` in `script.js`, and the base tokens at the top of `styles.css`.