# Veloria Restaurant - Admin Panel Setup

This is a Next.js restaurant website with a PostgreSQL database and admin panel for menu management.

## Features

- 🍽️ Dynamic menu system with sections and items
- 🔐 Admin authentication system
- 📊 Admin dashboard for managing menu items
- 🗄️ PostgreSQL database integration
- 🎨 Beautiful, modern UI with Framer Motion animations
- 📝 Editable Hero, About, and Contact sections
- 📅 Reservation/Booking system
- 🖼️ Image upload support (Base64 and URL)

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or remote)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL Database

Create a PostgreSQL database:

```bash
# Using psql
createdb veloria_db

# Or using SQL
psql -U postgres
CREATE DATABASE veloria_db;
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your database connection string:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/veloria_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_PASSWORD=admin123
```

### 4. Initialize Database

Run the database initialization script to create tables and seed initial data:

```bash
npm run db:init
```

This will:
- Create all necessary database tables
- Create a default admin user (username: `admin`, password: from `ADMIN_PASSWORD` env var or `admin123`)
- Create default menu sections

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Admin Panel

Access the admin panel at: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Default Credentials:**
- Username: `admin`
- Password: `admin123` (or whatever you set in `ADMIN_PASSWORD`)

### Admin Features

- **Dashboard**: View all menu sections and items
- **Add/Edit/Delete Menu Items**: Full CRUD operations with image upload (Base64 or URL)
- **Add/Edit/Delete Menu Sections**: Manage menu categories
- **Hero Section Editor**: Edit homepage hero content
- **About Section Editor**: Edit about page content
- **Contact Settings**: Manage contact details
- **Reservations Management**: View and manage table bookings

## Database Schema

### Tables

- `menu_sections`: Menu categories (Breakfast, Lunch, Dinner, etc.)
- `menu_items`: Individual menu items with image support
- `admin_users`: Admin user accounts
- `contact_details`: Contact information
- `hero_content`: Hero section content
- `about_content`: About page content
- `reservations`: Table booking reservations

### API Endpoints

- `GET /api/menu/full` - Get all sections with items (public)
- `GET /api/menu/sections` - Get all sections
- `POST /api/menu/sections` - Create section (admin)
- `PUT /api/menu/sections/[id]` - Update section (admin)
- `DELETE /api/menu/sections/[id]` - Delete section (admin)
- `GET /api/menu/items` - Get items (optionally filtered by section)
- `POST /api/menu/items` - Create item (admin)
- `PUT /api/menu/items/[id]` - Update item (admin)
- `DELETE /api/menu/items/[id]` - Delete item (admin)
- `GET /api/hero` - Get hero content (public)
- `PUT /api/hero` - Update hero content (admin)
- `GET /api/about` - Get about content (public)
- `PUT /api/about` - Update about content (admin)
- `GET /api/contact` - Get contact details (public)
- `PUT /api/contact` - Update contact details (admin)
- `GET /api/reservations` - List reservations (admin)
- `POST /api/reservations` - Create reservation (public)
- `PUT /api/reservations/[id]` - Update reservation (admin)
- `DELETE /api/reservations/[id]` - Delete reservation (admin)
- `POST /api/auth/login` - Admin login

## Deploy to Vercel with Supabase

### 1. Supabase database

- Create a project at [Supabase](https://app.supabase.com).
- In **Settings → Database**, copy the **Connection string → URI** (or use the **Session pooler** Node.js string).
- In **SQL Editor**, run the contents of `database/schema.sql` to create tables.
- Seed data once (from your machine):

```bash
DATABASE_URL="postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres" \
ADMIN_PASSWORD="your-admin-password" \
npm run db:init
```

Use your real Supabase password; if it contains `&` or `@`, URL-encode it (`&` → `%26`, `@` → `%40`).

### 2. Vercel environment variables

In Vercel: **Project → Settings → Environment Variables**. Add:

| Name | Value | Notes |
|------|--------|--------|
| `DATABASE_URL` | Your Supabase connection string (pooler) | URL-encode password if it has `&` or `@` |
| `JWT_SECRET` | Long random string | e.g. `openssl rand -base64 32` |
| `ADMIN_PASSWORD` | Admin login password | Same as used in `db:init` |

Redeploy after saving variables.

### 3. Connection

The app uses `DATABASE_URL` and enables SSL automatically for Supabase, so no code changes are needed once the env is set in Vercel.

---

## Production Deployment

Before deploying to production:

1. **Change JWT_SECRET** to a strong, random value
2. **Change ADMIN_PASSWORD** to a secure password
3. **Use environment variables** for all sensitive data
4. **Enable SSL** for database connections (handled for Supabase)
5. **Set up proper database backups**

## Tech Stack

- **Framework**: Next.js 16
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion

## License

MIT
