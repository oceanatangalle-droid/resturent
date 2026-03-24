# 🚀 Production Deployment Guide

This guide will help you deploy your **professional Veloria Restaurant website** to Vercel with a production database.

## Prerequisites

- GitHub account
- Supabase account (recommended) or any PostgreSQL database
- Vercel account (free)

---

## Step 1: Set Up Database (Supabase Recommended)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. After the project is ready, go to **Project Settings → Database**
3. Copy the **Connection String** (use the **Transaction Pooler** - port 6543)
4. Your connection string should look like:
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

---

## Step 2: Update Environment Variables

Create or update `.env.local`:

```env
# Database (Required)
DATABASE_URL="your-supabase-connection-string"

# Optional - Admin Password
ADMIN_PASSWORD="your-strong-password"

# Optional - Site URL (for SEO and metadata)
NEXT_PUBLIC_SITE_URL="https://your-restaurant-domain.com"

# Optional - Gmail for reservation emails
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REFRESH_TOKEN="your-refresh-token"
```

---

## Step 3: Run Database Migrations

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Run initial migration
npm run db:migrate:run

# 3. Run incremental migrations
npm run db:migrate:incremental
```

---

## Step 4: Deploy to Vercel

### Option A: From GitHub (Recommended)

1. Push your code to GitHub (already done):
   ```bash
   git push origin main
   ```

2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click **"Add New" → Project**
4. Import your repository (`resturent`)
5. In **Environment Variables**, add:
   - `DATABASE_URL` (your Supabase connection string)
   - `ADMIN_PASSWORD` (optional)
   - `NEXT_PUBLIC_SITE_URL` (your domain)
6. Click **Deploy**

### Option B: Using Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

---

## Step 5: After Deployment

1. Visit your deployed URL
2. Go to `/admin` and login with your `ADMIN_PASSWORD`
3. Update:
   - Restaurant information
   - Menu items
   - Hero images and content
   - Gallery photos/videos
4. Set up your Google Business Profile, TripAdvisor, etc. (see `docs/SEO.md`)

---

## Production Features Included

✅ **Database-only mode** - No more demo data  
✅ **Professional UI** - Modern, responsive design  
✅ **Loading indicators** - Beautiful spinners while loading  
✅ **Security** - CSP, security headers, input validation  
✅ **SEO Optimized** - Metadata, structured data, sitemap  
✅ **Performance** - ISR caching, optimized images  

---

## Troubleshooting

**Database connection errors:**
- Use Supabase **Transaction Pooler** (port 6543)
- Make sure to run migrations after connecting

**Images not showing:**
- Check Admin → Gallery and Admin → Branding

**Admin login not working:**
- Set `ADMIN_PASSWORD` environment variable

---

**Your website is now production-ready!** 

For any issues, check the logs in Vercel dashboard or let me know.

**Live URL will be something like:** `https://resturent.vercel.app`
```

The deployment guide has been updated with the latest improvements. You can now easily deploy your professional restaurant website. Would you like me to make any adjustments to the guide?