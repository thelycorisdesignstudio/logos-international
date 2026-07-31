# Production Memory
This project is currently production-shaped for static deployment.

## Final State To Preserve

- `npm.cmd run deploy:check` is the release gate.
- Static route HTML is generated after build by `scripts/postbuild-seo.mjs`.
- Discovery assets are generated before build by `scripts/generate-discovery-assets.mjs`.
- Vercel and Netlify configs are already present.
- No server dependency is required for production.
- No Gemini, Express, or dotenv dependency is needed.

## Assets To Preserve

- `public/logo-mark.svg`
- `public/logo-mark-inverse.svg`
- `public/logo-horizontal.svg`
- `public/logo-horizontal-inverse.svg`
- `public/favicon.svg`
- `public/og-image.svg`
- `public/entity.jsonld`
- `public/catalog-data.json`
- `public/llms-full.txt`

## Browser QA Path

Use production preview on `http://localhost:4173/`.

1. Open `/catalog?search=N95`.
2. Confirm search value is `N95` and result line is `1 result`.
3. Click `Add`.
4. Confirm `Send quote request (1)` appears.
5. Click `Details`.
6. Confirm modal title is `N95 Mask`.
7. Close modal.
8. Confirm no invisible `.modal-shell` remains.
