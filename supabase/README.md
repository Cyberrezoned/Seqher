# Supabase setup (schema + seed)

## 1) Apply schema (fixes frontend column errors)
- Open Supabase Dashboard → **SQL Editor** → **New query**
- Paste and run: `supabase/schema.sql`

This creates tables/columns that the app queries expect (`image_id`, `image_url`, `locale`, `appointment_date`, etc.).

## 2) Seed with your WordPress export (for Admin + Frontend)
1. Put your exported JSON into `src/content/wordpress-export.json`
2. Ensure env vars are set (service role key required):
   - `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`)
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Run:
   - `npm run seed`

Notes:
- Seeding is idempotent for `programs`/`announcements` via `wp_id` and for `blog_posts`/`news` via `slug`/`link`.
- The script also seeds the built-in placeholder images into the `images` table unless you pass `--no-placeholders`:
  - `npm run seed -- --no-placeholders`

## Optional: Static-only mode
If you want the public site to render from the JSON file without Supabase reads, set:
- `NEXT_PUBLIC_CONTENT_SOURCE=static`

