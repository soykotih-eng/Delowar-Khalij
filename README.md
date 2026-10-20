# DELOWAR AL KHALIJ CO. — Website

Bilingual (English / Arabic RTL) marble, granite and aluminium website built with **Next.js 16 (App Router)**, **Tailwind CSS v4** and a **MySQL** database, with an admin panel for the business owner.

## Who changes what

| Owner (admin panel at `/admin`) | Developer (code, this repository) |
| --- | --- |
| Products: add, edit, delete, photos | Design, colours, layout, fonts |
| Daily rates / prices | New features and pages |
| Aluminium work photos (daily designs) | Fixed page texts (`src/dictionaries/`) |
| Orders & requests: accept / complete / reject, notes, WhatsApp reply | Contact details, categories, services (`src/lib/config.ts`, `src/data/`) |
| Own password, QR code downloads | Database & hosting settings |

Owner instructions (English + Bangla): **[ADMIN-GUIDE.md](ADMIN-GUIDE.md)**.

## Run

```bash
npm install
npm run dev      # http://localhost:3000  (redirects to /en)
npm run build    # production build
npm start        # serve the production build
npm run qr       # regenerate the QR code files in public/brand/ (optional: npm run qr https://other-domain)
```

> The production build uses webpack (`next build --webpack`) instead of Next.js 16's default Turbopack: Turbopack's PostCSS/Tailwind worker process crashes in Hostinger's build environment ("node process exited before we could connect to it"). Requires Node.js 20.9+ (Hostinger: Node 22 recommended).

## Database & admin setup (Hostinger)

1. hPanel → **Databases → MySQL Databases**: create a database and user (note the names and password).
2. hPanel → your Node.js website → **Environment variables**, add:

   | Variable | Value |
   | --- | --- |
   | `DB_HOST` | `localhost` (shown in hPanel) |
   | `DB_PORT` | `3306` |
   | `DB_USER` / `DB_PASSWORD` / `DB_NAME` | from step 1 |
   | `ADMIN_EMAIL` | the owner's login email |
   | `ADMIN_PASSWORD` | a temporary password (the owner changes it after first login) |

3. **Redeploy.** On first start the app creates its tables, copies the starter catalogue and photos into the database, and creates the admin account. No manual SQL is needed.

- **Forgotten owner password:** set a new `ADMIN_PASSWORD`, add `ADMIN_RESET=true`, redeploy, then remove `ADMIN_RESET`.
- **Login code by email (2-step login):** turns on automatically once these variables are set (without them, login needs only the password):

   | Variable | Hostinger email | Gmail |
   | --- | --- | --- |
   | `SMTP_HOST` | `smtp.hostinger.com` | `smtp.gmail.com` |
   | `SMTP_PORT` | `465` | `465` |
   | `SMTP_USER` | full mailbox, e.g. `no-reply@delowaralkhalij.net` | the Gmail address |
   | `SMTP_PASS` | the mailbox password | a 16-character [App Password](https://myaccount.google.com/apppasswords) (needs Google 2-Step Verification) |
   | `SMTP_FROM` | optional sender address (defaults to `SMTP_USER`) | |

  The code goes to the admin's login email (`ADMIN_EMAIL`). It is valid for 10 minutes, allows 5 tries, and can be resent once a minute. If sending fails, the login page says so, and you can remove the `SMTP_` variables to fall back to password-only login.
- **Without database variables** the site still works: it shows the starter catalogue from `src/data/` and `/admin` explains that the database is not connected.
- Uploaded photos are stored in the database (table `media`, served at `/media/<id>`) because Hostinger replaces the app folder on every deploy. Back up the database from hPanel regularly.

## Where to edit (developer)

| What | File |
| --- | --- |
| Phone, WhatsApp, email, address, hours, socials, currency rates, free-delivery threshold, installation rate, stats | `src/lib/config.ts` |
| All page text (English / Arabic) | `src/dictionaries/en.ts`, `src/dictionaries/ar.ts` |
| Starter products / aluminium works (seeded once into an empty database) | `src/data/products.ts`, `src/data/aluminium.ts` |
| Categories & navigation menus | `src/data/categories.ts` |
| Services | `src/data/services.ts` |
| Knowledge-center articles | `src/data/posts.ts` |
| Aluminium page: services, house-map hotspots | `src/data/aluminium.ts`; stats bar: `aluminiumStats` in `src/lib/config.ts` |
| Admin panel | `src/app/admin/`, `src/components/admin/`, server actions in `src/app/admin/actions.ts` |
| Database schema, seeding, admin bootstrap | `src/lib/db.ts` |
| Colours & fonts | `src/app/globals.css` (`@theme`), `src/lib/fonts.ts` |
| Logo, QR code | `public/brand/` (QR generator: `scripts/generate-qr.mjs`) |

## Features

- Home: hero slider, product tabs, about + animated stats, why-us, category tiles, aluminium band, calculators promo, latest articles
- Shop with category tree, price / colour / finish / origin / usage / thickness / availability filters, sorting, grid/list view, pagination
- Product pages: zoom + lightbox, specs, description / additional info / reviews tabs, share buttons, related products
- Quick view, wishlist, compare (up to 4), cart with free-delivery progress — saved in the browser
- Purchase request with custom sizes, supply / supply & installation and live price estimate
- Kitchen cost calculator and project cost estimator with printable / PDF quotation
- **Aluminium & Glass** (`/aluminium`): hero, capabilities tabs, interactive house map, featured projects, design & build, filterable polaroid gallery, quote form
- **Admin panel** (`/admin`): dashboard, orders & requests with status workflow and WhatsApp replies, products & bulk rate update, aluminium photo uploads, password change, QR code downloads
- Every website form opens **WhatsApp** with a reference number *and* saves the request to the admin panel
- EN / AR with full RTL, SAR / USD / EUR switcher, live search, SEO metadata, sitemap & robots

Stock photos are from [Unsplash](https://unsplash.com) (free licence) — replace them with your own product photos when available.
