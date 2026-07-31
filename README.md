# Logos International

Minimal sourcing and supply website for Logos International, built with React, Vite and Tailwind CSS.

## Local Development

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000/`.

## Quality Checks

```bash
npm run lint
npm run build
npm audit --omit=dev
```

For a full pre-deploy gate:

```bash
npm run deploy:check
```

Preview the production build locally:

```bash
npm run build
npm run preview
```

The preview server runs at `http://localhost:4173/`.

## Deployment

Build output is generated in `dist/`.

- Vercel: `vercel.json` sets `npm run build`, `dist`, clean URLs and baseline security headers.
- Netlify: `netlify.toml` sets the build output and production headers.
- Static hosting: upload the contents of `dist/`. The build emits route-specific HTML for all 43 public routes.

The build also runs `scripts/postbuild-seo.mjs`, which gives every public route its own title, description, canonical URL and structured data before JavaScript loads. Catalog images are generated with 480px and 960px WebP variants for responsive delivery.

## Domain and DNS

The canonical production domain is `https://logosae.com`. Both `logosae.com` and `www.logosae.com` are assigned to the Vercel project, and `www` redirects permanently to the apex domain through `vercel.json`.

The registrar should delegate DNS to Vercel using these nameservers:

```text
ns1.vercel-dns.com
ns2.vercel-dns.com
```

When those nameservers are active, Vercel manages the apex and `www` records automatically. Do not keep GoDaddy parking A records or a parking CNAME alongside this configuration.

## SEO Files

Crawler metadata lives in `index.html`, with `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `entity.jsonld`, `catalog-data.json`, `favicon.svg`, `og-image.svg` and `site.webmanifest` served from `public/`.

`entity.jsonld`, `catalog-data.json` and `llms-full.txt` are generated from `src/data/products.ts` during `npm run build` so the AI/search discovery files stay aligned with the visible catalog.
