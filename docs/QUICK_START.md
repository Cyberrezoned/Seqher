# Supabase Integration - Quick Start Guide

Get your Supabase integration up and running in 5 minutes!

## Step 1: Get Your Supabase Credentials (2 minutes)

1. Go to https://app.supabase.com
2. Sign up or log in
3. Create a new project (or use existing)
4. Go to **Settings** → **API**
5. Copy these three values:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ```

## Step 2: Set Environment Variables (1 minute)

Create or update `.env.local` in your project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## Step 3: Create Database Tables (1 minute)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open `docs/supabase-schema.sql`
4. Copy ALL the SQL code
5. Paste into the query editor
6. Click **Run**

✅ You should see "Success. No rows returned." at the bottom

## Step 4: Install Dependencies (30 seconds)

```bash
npm install @supabase/supabase-js
```

## Step 5: Test It (30 seconds)

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:9002/admin/blog

3. Click "New Post"

4. Fill out the form with test data

5. Click "Save"

✅ You should see a success message

6. Check Supabase Dashboard:
   - Go to **Table Editor**
   - Select **blogPosts** table
   - Your post should appear there!

## That's It! 🎉

Your Supabase integration is ready to use!

### Next: Test Other Admin Functions

- `/admin/news` - Create/update/delete news articles
- `/admin/programs` - Manage programs
- `/admin/announcements` - Create announcements
- `/admin/appointments` - View appointments
- Appointment booking (public) - Try it yourself

## Troubleshooting Quick Fixes

### "Failed to save" error
- Restart your dev server
- Check environment variables have no extra spaces
- Verify Supabase URL and keys are correct

### Database tables not showing
- Run the SQL query again
- Check for errors in the Supabase SQL Editor output
- Verify you're looking in the right project

### "Missing NEXT_PUBLIC_SUPABASE_URL"
- Make sure `.env.local` has the variables
- Restart dev server (critical!)

## Next Steps

1. **Read the full setup guide**: `docs/SUPABASE_SETUP.md`
2. **Use the testing checklist**: `docs/MIGRATION_CHECKLIST.md`
3. **Reference quick commands**: `docs/SUPABASE_QUICK_REF.md`
4. **Learn data reading**: `docs/SUPABASE_READING.md`

## What's Changed

✅ Admin blog/news/programs/announcements → Now use Supabase
✅ Appointment booking → Now uses Supabase
✅ Firebase Auth → Still works, unchanged
✅ Everything else → No changes

## Key Files Created

```
src/lib/
├── supabase-client.ts    (NEW)
├── supabase-admin.ts     (NEW)
├── firebase.ts           (unchanged)
└── firebase-admin.ts     (unchanged)

docs/
├── SUPABASE_SETUP.md              (NEW)
├── SUPABASE_READING.md            (NEW)
├── SUPABASE_QUICK_REF.md          (NEW)
├── MIGRATION_CHECKLIST.md         (NEW)
├── supabase-schema.sql            (NEW)
├── SUPABASE_INTEGRATION_SUMMARY.md (NEW)
└── IMPLEMENTATION_VERIFICATION.md (NEW)
```

## Questions?

- Check `docs/MIGRATION_CHECKLIST.md` for troubleshooting
- Read `docs/SUPABASE_SETUP.md` for detailed instructions
- Visit https://supabase.com/docs for Supabase documentation

---

**You're all set! Happy coding! 🚀**
