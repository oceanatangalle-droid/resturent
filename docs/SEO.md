# SEO Guide: Getting Results Like the Oceana Example

This guide explains what’s implemented on the site and what you should do off-site so your restaurant can show up in search like the Oceana Beach Cafe example (strong organic results, Knowledge Panel, ratings, and local visibility).

---

## What’s Already Implemented on the Site

### 1. **Technical SEO**
- **Sitemap** – `/sitemap.xml` lists all main pages so search engines can crawl them.
- **Robots** – `/robots.txt` allows crawling of the site and points to the sitemap; `/admin` and `/api/` are disallowed.
- **Canonical URL** – Set when `NEXT_PUBLIC_SITE_URL` is defined so Google knows your preferred URL.

### 2. **Structured Data (JSON-LD)**
- **Restaurant schema** in the root layout includes:
  - Business name, description, URL
  - Phone, email, full address
  - Opening hours (from Admin → Contact)
  - Links to Facebook, Instagram, Google Business, TripAdvisor (from Admin → Settings)
  - “Reserve a table” action pointing to `/book-a-table`

This helps Google show a **Knowledge Panel** (the right-hand box with address, phone, hours, etc.) and consider your site for rich results.

### 3. **Metadata**
- **Root**: Site name and tagline from your settings; description can come from the home subtitle.
- **Per-page**: Each main section has its own title and description:
  - Home: “[Site Name] - Fine Dining Experience”
  - Menu, Book a Table, Contact, Gallery: “[Page topic] | [Site Name]”
- **Open Graph & Twitter** – Same titles/descriptions so links look good when shared.

### 4. **Environment Variable**
Set your live site URL so canonicals, sitemap, and schema use the correct domain:

```bash
NEXT_PUBLIC_SITE_URL=https://your-restaurant-domain.com
```

On Vercel, you can rely on `VERCEL_URL` for the sitemap, but it’s better to set `NEXT_PUBLIC_SITE_URL` to your real domain (e.g. with www or without, consistently).

---

## Off-Site Steps (Critical for Results Like the Image)

The Oceana-style result relies heavily on **off-site** signals. Do these in addition to the on-site work above.

### 1. **Google Business Profile (GMB)**
- **Claim and verify** your business at [business.google.com](https://business.google.com).
- Use the **exact same** business name, address, and phone (NAP) as on your website and in Admin → Contact.
- Fill out:
  - **Category**: e.g. “Restaurant”, “Seafood restaurant”
  - **Opening hours**
  - **Phone, website, address**
  - **Short description** (with location and keywords, e.g. “[City] restaurant”, “seafood”, “fine dining”)
  - **Photos**: food, interior, exterior, logo
- Add **Menu** link (e.g. `yoursite.com/menu`) and **Reservations** (e.g. `yoursite.com/book-a-table`).
- Encourage **reviews**; reply to them. Star ratings in the Knowledge Panel and in search come from Google reviews.

### 2. **TripAdvisor**
- Create or claim your **TripAdvisor listing**.
- Keep **name, address, phone, website** identical to your site and Google.
- Add a link to your TripAdvisor page in **Admin → Settings** (TripAdvisor URL). The site already links to it in the footer.
- Encourage reviews there; the snippet in the example (“4.7, 812 reviews”) is from TripAdvisor.

### 3. **Facebook (and optionally Instagram)**
- Create a **Facebook Page** for the restaurant with the same NAP and website.
- Add the URL in **Admin → Settings**. The site already links in the footer.
- Use the **exact business name** in the page title, e.g. “[Restaurant Name] | [City]”.
- Post regularly; a strong follower count and engagement help with visibility when your page appears in search.

### 4. **Consistent NAP and Branding**
- Use the **same** business name, address, and phone on:
  - Your website (Admin → Contact)
  - Google Business Profile
  - TripAdvisor, Facebook, Instagram, and any other listings
- Small differences (e.g. “St” vs “Street”) can hurt local SEO.

### 5. **Local Keywords in Content**
- In **Admin → Home**, use your **city/area name** and terms people search for (e.g. “restaurant”, “seafood”, “fine dining”, “beach”, “dinner”) in:
  - Hero subtitle
  - About text
  - Feature titles/descriptions
- In **Admin → Contact**, make sure the intro or heading can naturally include the location if it fits.

### 6. **Rich Snippets (Stars and Price)**
- **Star ratings** in search usually come from **Google reviews** (and sometimes TripAdvisor when Google shows that result). There is no need to add rating markup on your own site unless you aggregate reviews; focus on getting reviews on Google and TripAdvisor.
- **Price range** (e.g. “$$ - $$$”) is often taken from your **Google Business** profile or from other sites. You can set price level in GMB.

---

## Quick Checklist

| Task | Where |
|------|--------|
| Set `NEXT_PUBLIC_SITE_URL` | Environment / Vercel |
| Keep NAP and hours up to date | Admin → Contact |
| Add social and review links | Admin → Settings (Facebook, Instagram, Google, TripAdvisor) |
| Claim and complete Google Business Profile | business.google.com |
| Same NAP on TripAdvisor & Facebook | TripAdvisor, Facebook |
| Use location + keywords in home/contact text | Admin → Home, Contact |
| Add menu and reservation links in GMB | Google Business Profile |
| Encourage and reply to reviews | Google, TripAdvisor |

---

## Aggregate Rating & Price Range

To expose your **Google** or **TripAdvisor** rating in structured data (for rich star snippets in search), you can add star ratings and price range in **Admin → Settings**, under **SEO: Ratings & price range**. Enter Rating (e.g. 4.7), Review count (e.g. 812), and Price range (e.g. $$ - $$$). Both rating and review count must be set for stars to appear. Run `drizzle/0014_site_settings_seo.sql` if you use migrations. The implementation uses `aggregateRating` in the Restaurant schema to support rich star snippets in search results.
