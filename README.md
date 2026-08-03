# EcoSurfaceCare Website

A complete React + Vite + Tailwind starter website for EcoSurfaceCare.

## Included

- Responsive header and mobile navigation
- Homepage
- Services page
- Eight service detail routes
- Gallery with filters
- About page
- Sustainability page
- Reviews page
- FAQ page
- Contact page
- Quote page
- Privacy, cookies, terms and accessibility pages
- Owner login demonstration
- Gallery dashboard demonstration
- Cloudflare Pages `_redirects`
- `robots.txt` and starter sitemap
- Supplied EcoSurfaceCare branding files

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Upload the generated `dist` folder to Cloudflare Pages or connect the repository directly.

## Important

The contact form, quote form and admin dashboard are currently interface demonstrations. The next backend phase should connect:

- Cloudflare Access for owner authentication
- Cloudflare D1 for gallery metadata
- Cloudflare R2 for photos and videos
- Cloudflare Pages Functions or Workers for API routes
- Turnstile for form protection
- Resend or another transactional email service
- Permanent add/edit/delete gallery operations

Before launch, replace placeholder phone, email, service area, hours, reviews, service details and legal text.
