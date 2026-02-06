# Deploying to Vercel with Supabase

This guide walks you through hosting the app on **Vercel** and the database on **Supabase**.

### Quick checklist

- [ ] **Supabase**: Create project at [supabase.com](https://supabase.com) → get **Transaction** pooler URI (port 6543)
- [ ] **.env**: Set `DATABASE_URL` to that URI (and optionally `ADMIN_PASSWORD`)
- [x] **Migrations**: Run `npm run db:migrate:run` then `npm run db:migrate:incremental` (already done if you have a fresh DB)
- [ ] **GitHub**: Push this repo to GitHub
- [ ] **Vercel**: [vercel.com](https://vercel.com) → Add New → Project → import repo → add `DATABASE_URL` (and `ADMIN_PASSWORD`) in Settings → Environment Variables → Deploy

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose an organization, name the project (e.g. `veloria`), set a database password (save it securely), and pick a region close to your users.
4. Wait for the project to be ready.

---

## 2. Get the database connection string

1. In the Supabase dashboard, open **Project Settings** (gear icon) → **Database**.
2. Under **Connection string**, choose **URI**.
3. For **Vercel (serverless)**, use the **Transaction** pooler (port **6543**) so you don’t exhaust connections:
   - Select the **Transaction** tab (not Session or Direct).
   - Copy the URI. It will look like:
     ```text
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
   - Replace `[YOUR-PASSWORD]` with your database password.
   - Optional but recommended: add `?pgbouncer=true` at the end for transaction mode:
     ```text
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - If Supabase or your provider requires SSL, append `&sslmode=require` (or use the value they suggest).

Save this as your `DATABASE_URL`; you’ll use it in Vercel and locally.

---

## 3. Run migrations on Supabase

From your project root, with `DATABASE_URL` set to the Supabase pooler URL above:

**Option A – Full reset (empty DB, e.g. new project)**  
Run the initial migration, then all incremental ones:

```bash
# 1. Set your Supabase connection string (Transaction pooler)
export DATABASE_URL="postgresql://postgres.xxx:YOUR_PASSWORD@aws-0-xx.pooler.supabase.com:6543/postgres?pgbouncer=true"

# 2. Initial schema (creates tables and seed data)
npm run db:migrate:run

# 3. All later migrations (e.g. contact_submissions, etc.)
npm run db:migrate:incremental
```

**Option B – Drizzle push (alternative)**  
If you prefer to sync the schema from code without SQL files:

```bash
export DATABASE_URL="postgresql://..."
npm run db:push
```

Use **Option A** if you want to match the repo’s migration history and seed data.

---

## 4. Deploy to Vercel

1. Push your code to **GitHub** (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com) and sign in.
3. Click **Add New** → **Project** and import your repository.
4. Leave **Framework Preset** as **Next.js** and **Root Directory** as `.`.
5. Before deploying, add environment variables:
   - **Settings** → **Environment Variables**
   - Add:

     | Name              | Value                    | Notes                    |
     |-------------------|--------------------------|--------------------------|
     | `DATABASE_URL`    | Your Supabase pooler URI | **Required** for DB      |
     | `ADMIN_PASSWORD`  | Strong password          | Optional; default `admin`|
     | `GOOGLE_CLIENT_ID`| (if using Gmail)         | Optional; reservation emails |
     | `GOOGLE_CLIENT_SECRET` | (if using Gmail)   | Optional                 |
     | `GOOGLE_REFRESH_TOKEN`  | (if using Gmail)   | Optional                 |

   Use the **same** Supabase **Transaction pooler** URL (port 6543) as in step 2.

6. Click **Deploy**. Vercel will run `next build` and deploy.

---

## 5. After deployment

- **Site URL**: Vercel will show a URL like `https://your-project.vercel.app`.
- **Admin**: Open `https://your-project.vercel.app/admin` and log in with the password you set in `ADMIN_PASSWORD` (or the default).
- **Database**: All data (reservations, contact messages, menu, settings, etc.) is stored in Supabase and shared between local and production when using the same `DATABASE_URL`.

---

## Optional: Gmail for reservation emails

To send reservation accept/reject emails from production:

1. Use a Google Cloud project with the Gmail API and OAuth credentials.
2. Generate a refresh token for the account that will send the emails.
3. Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` to Vercel environment variables.

If these are not set, the app still works; it just won’t send emails for reservation responses.

---

## Troubleshooting

- **“DATABASE_URL is not set”**  
  Add `DATABASE_URL` in Vercel (Project → Settings → Environment Variables) and redeploy.

- **Connection timeouts or too many connections**  
  Use the **Transaction** pooler URL (port **6543**) and `?pgbouncer=true`, not the direct connection (port 5432).

- **SSL errors**  
  Append `&sslmode=require` to `DATABASE_URL` (or the value recommended in Supabase’s connection string section).

- **Migrations fail on Supabase**  
  Run migrations from your machine (or a one-off script) with `DATABASE_URL` set to the same pooler URI. Avoid running long-lived migration scripts from Vercel serverless functions.
