# Veloria Restaurant Website

A modern, professional restaurant website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Landing Page**: Beautiful hero section with call-to-action buttons
- **Menu Page**: Display of menu items organized by categories (Appetizers, Main Courses, Desserts, Beverages)
- **Contact Page**: Contact form and restaurant information
- **Book a Table**: Reservation form with date, time, and guest selection
- **Responsive Design**: Fully responsive and mobile-friendly
- **Modern UI**: Clean, professional design with smooth transitions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure

```
veloria-clone/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── menu/
│   │   │   └── page.tsx      # Menu page
│   │   ├── contact/
│   │   │   └── page.tsx      # Contact page
│   │   ├── book-a-table/
│   │   │   └── page.tsx      # Reservation page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   └── components/
│       ├── Navigation.tsx    # Navigation bar
│       └── Footer.tsx        # Footer component
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Pages

- **Home (`/`)**: Landing page with hero section, about section, and features
- **Menu (`/menu`)**: Complete menu with categorized items
- **Contact (`/contact`)**: Contact form and restaurant information
- **Book a Table (`/book-a-table`)**: Table reservation form
- **Admin (`/admin`)**: Admin panel to manage content and view reservations

## Admin Panel

The admin panel at `/admin` lets you maintain the site without editing code:

- **Menu**: Add, edit, and remove menu categories and menu items
- **Contact**: Edit contact information (address, phone, email, hours)
- **Home**: Edit hero text, about section, feature cards, and featured menu section
- **Reservations**: View book-a-table submissions; **Accept** or **Reject** each request. When you respond, an email is sent to the client via Gmail API (if configured).

**Login**: Default password is `admin`. Set `ADMIN_PASSWORD` in your environment to change it (see `.env.example`). The footer includes a small "Admin" link for quick access.

## Database (PostgreSQL)

Admin panel changes (menu, contact, home, reservations) are persisted in **PostgreSQL** when `DATABASE_URL` is set.

### Setup

1. Create a PostgreSQL database (local, Supabase, Neon, etc.) and get the connection string.
2. Add to `.env`:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database_name
   ```
3. Run the migration to create tables and seed defaults:
   ```bash
   npm run db:migrate:run
   ```
   Or with Drizzle Kit (requires `DATABASE_URL` in `.env`):
   ```bash
   npm run db:migrate
   ```
   Or run the SQL file manually:
   ```bash
   psql $DATABASE_URL -f drizzle/0000_initial.sql
   ```

### Migration files

- **`drizzle/0000_initial.sql`** – Creates tables: `menu_categories`, `menu_items`, `contact_info`, `home_content`, `reservations`, and seeds default contact, home, categories, and menu items.
- **`drizzle/meta/_journal.json`** – Drizzle Kit migration journal (used by `npm run db:migrate`).

### Scripts

| Script | Description |
|--------|-------------|
| `npm run db:migrate:run` | Run the initial migration SQL with Node (no psql needed). |
| `npm run db:migrate` | Run migrations via Drizzle Kit. |
| `npm run db:generate` | Generate new migrations from schema changes. |
| `npm run db:push` | Push schema to DB without migration files (dev). |
| `npm run db:studio` | Open Drizzle Studio to browse/edit data. |

### Without a database

If `DATABASE_URL` is not set, the app uses in-memory storage so it still runs; data resets when the server restarts.

## Gmail API (reservation emails)

When you **Accept** or **Reject** a reservation in Admin → Reservations, the app sends an email to the client using the Gmail API.

### Setup

1. **Add credentials to `.env`** (never commit `.env` or share these values):
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REFRESH_TOKEN=your-refresh-token
   ```

2. **Get a refresh token** (one-time):
   - Go to [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
   - Click the gear icon (⚙️), check **Use your own OAuth credentials**, and enter your **Client ID** and **Client secret**.
   - In **Step 1**, select **Gmail API v1** → **https://mail.google.com/** (full Gmail access), then click **Authorize APIs** and sign in with the Gmail account that will send the emails.
   - In **Step 2**, click **Exchange authorization code for tokens**.
   - Copy the **Refresh token** and set it as `GOOGLE_REFRESH_TOKEN` in your `.env`.

3. Restart the dev server. Accept/Reject in Admin → Reservations will then send the confirmation or rejection email to the client.

## Reservation emails (Gmail API)

When you **Accept** or **Reject** a reservation in Admin → Reservations, the app can send a confirmation email to the client using the Gmail API.

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project (or use existing), enable **Gmail API**, and create **OAuth 2.0 Client ID** (Desktop app). Copy the Client ID and Client Secret.
2. Get a **refresh token** using [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/): use your Client ID/Secret, select Gmail API scope `https://mail.google.com/`, authorize, then exchange the code for tokens and copy the **Refresh token**.
3. Add to `.env` (never commit real values):
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
4. Run the reservation status migration so the `reservations` table has `status` and `responded_at`:
   ```bash
   psql $DATABASE_URL -f drizzle/0003_reservation_status.sql
   ```
   Or use `db:push` if you use Drizzle for schema sync.

If Gmail env vars are missing, Accept/Reject still updates the reservation but the client will not receive an email (the admin UI will show "Email could not be sent").

## Customization

You can customize the website by:

- Using the **Admin panel** at `/admin` to edit menu, contact, home content, and view reservations
- Modifying colors in `tailwind.config.js`
- Updating the restaurant name "Veloria" in the admin Home section or in the codebase

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel + Supabase

To host the app on **Vercel** and the database on **Supabase**:

1. Copy `.env.example` to `.env.local` and fill in your Supabase **Transaction pooler** URL as `DATABASE_URL`.
2. Follow the step-by-step guide in **[DEPLOYMENT.md](./DEPLOYMENT.md)** to create the Supabase project, run migrations, and deploy to Vercel with the right environment variables.

## Technologies Used

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **React**: UI library
