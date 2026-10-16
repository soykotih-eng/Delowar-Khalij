# DELOWAR AL KHALIJ CO. — Website

Bilingual (English / Arabic RTL) marble & granite marketplace website built with **Next.js 16 (App Router)** and **Tailwind CSS v4**. Every page is statically pre-rendered for fast loading.

## Run

```bash
npm install
npm run dev      # http://localhost:3000  (redirects to /en)
npm run build    # production build
npm start        # serve the production build
```

> The production build uses webpack (`next build --webpack`) instead of Next.js 16's default Turbopack: Turbopack's PostCSS/Tailwind worker process crashes in Hostinger's build environment ("node process exited before we could connect to it"). Requires Node.js 20.9+ (Hostinger: Node 22 recommended).

## Where to edit

| What | File |
| --- | --- |
| Phone, WhatsApp, email, address, hours, socials, currency rates, free-delivery threshold, installation rate, stats | `src/lib/config.ts` |
| All page text (English / Arabic) | `src/dictionaries/en.ts`, `src/dictionaries/ar.ts` |
| Products (name, price per m², origin, colour, finish…) | `src/data/products.ts` (image: `public/images/products/<slug>.webp`) |
| Categories & navigation menus | `src/data/categories.ts` |
| Services | `src/data/services.ts` |
| Knowledge-center articles | `src/data/posts.ts` |
| Aluminium & Glass page: work photos, services, house-map hotspots | `src/data/aluminium.ts` (photos: `public/images/aluminium/<slug>.webp`); stats bar numbers: `aluminiumStats` in `src/lib/config.ts` |
| Colours & fonts | `src/app/globals.css` (`@theme`) and `src/app/[lang]/layout.tsx` |
| Logo | `public/brand/logo-horizontal.png` (light backgrounds), `logo-horizontal-light.png` (dark backgrounds), `logo-full.png` (original stacked logo, transparent); favicon `src/app/icon.png`, `apple-icon.png` |

## Features

- Home: hero slider, product tabs, about + animated stats, why-us, category tiles, calculators promo, latest articles
- Shop with category tree, price / colour / finish / origin / usage / thickness / availability filters, sorting, grid/list view, pagination
- Product pages: zoom + lightbox, specs, description / additional info / reviews tabs, share buttons, related products
- Quick view, wishlist, compare (up to 4), cart with free-delivery progress — saved in the browser
- Purchase request with custom sizes, supply / supply & installation and live price estimate
- Kitchen cost calculator (pieces, mirrors, thickness, waste, transport, cutting, live material preview)
- Project cost estimator with printable / PDF quotation
- **Aluminium & Glass** (`/aluminium`): hero slider with stats, capabilities tabs, interactive house "system map", featured projects, design & build process, filterable polaroid gallery with lightbox, quote request form — plus a highlight band on the home page
- Services, About, Knowledge center, Contact (map), Showrooms, FAQ, policies, supplier registration, account
- EN / AR with full RTL, SAR / USD / EUR currency switcher, search with live results, SEO metadata, sitemap & robots

All forms (orders, quotes, registrations, reviews, contact) open **WhatsApp** with a pre-filled message to the number in `config.ts` — no backend required. Online accounts, payments and the supplier dashboard need a backend and are not included.

Stock photos are from [Unsplash](https://unsplash.com) (free licence) — replace them with your own product photos when available.
