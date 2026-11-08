# Docusaurus scaffold — where each file goes

Add these files to the repo root (same relative paths as here), then commit
and push. Vercel will run `npm install` and `npm run build` on the next push.

- `package.json` — replaces the broken one in the repo (the current file has a
  stray duplicate line after the closing brace; this copy is valid JSON).
- `docusaurus.config.js` — site config (title, navbar, footer). The `url`
  is the old Vercel project's address; change it later if the live domain
  is different.
- `sidebars.js` — docs sidebar (auto-generated from the docs folder).
- `babel.config.js` — required by Docusaurus.
- `docs/intro.md` — the Docs landing page (what it is, how it works, pricing).
- `src/pages/index.js` — the homepage (hero, five steps, pricing).
- `src/css/custom.css` — Ripper red accent color.

What this produces: a working Docusaurus docs site whose homepage is the
Ripper Bug Fixer landing content — not the default Docusaurus placeholder.

The Emergent page (https://closing-phase-2.preview.emergentagent.com/) stays
live regardless; this scaffold is the repo/Vercel route for the old project.
