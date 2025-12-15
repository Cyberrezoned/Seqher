# Supabase Integration Migration Checklist

This checklist will help you verify that the Supabase integration is working correctly.

## Pre-Migration Setup

- [ ] Create a Supabase project at https://app.supabase.com
- [ ] Get your Supabase URL and API keys from Settings → API
- [ ] Copy the keys to your `.env.local` file using `.env.example` as reference
- [ ] Run `npm install @supabase/supabase-js` to install the Supabase package

## Database Schema Setup

- [ ] Log in to your Supabase project dashboard
- [ ] Go to SQL Editor
- [ ] Copy the entire contents of `docs/supabase-schema.sql`
- [ ] Paste into a new SQL query
- [ ] Run the query to create all tables
- [ ] Verify all 5 tables were created:
  - [ ] `blogPosts`
  - [ ] `news`
  - [ ] `programs`
  - [ ] `announcements`
  - [ ] `appointments`

## Code Changes Review

- [ ] Verify `src/lib/supabase-client.ts` exists (client-side instance)
- [ ] Verify `src/lib/supabase-admin.ts` exists (server-side instance)
- [ ] Check that all admin action files have been updated:
  - [ ] `src/app/admin/blog/actions.ts` (uses supabaseAdmin)
  - [ ] `src/app/admin/news/actions.ts` (uses supabaseAdmin)
  - [ ] `src/app/admin/programs/actions.ts` (uses supabaseAdmin)
  - [ ] `src/app/admin/announcements/actions.ts` (uses supabaseAdmin)
  - [ ] `src/app/appointment/actions.ts` (uses supabaseAdmin)
- [ ] Verify `package.json` includes `@supabase/supabase-js` in dependencies

## Environment Variables

- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- [ ] Firebase variables remain unchanged (NEXT_PUBLIC_FIREBASE_*)
- [ ] Firebase admin variables remain unchanged (FIREBASE_*)

## Testing Procedures

### Test Blog Post Creation
- [ ] Navigate to `/admin/blog`
- [ ] Click "New Post"
- [ ] Fill in the form with valid data
- [ ] Click "Save"
- [ ] Verify success message appears
- [ ] Go to Supabase Dashboard → Table Editor → blogPosts
- [ ] Confirm your post appears in the table

### Test Blog Post Update
- [ ] Edit an existing blog post
- [ ] Change the title
- [ ] Click "Save"
- [ ] Verify the update in Supabase blogPosts table

### Test Blog Post Deletion
- [ ] Delete a blog post
- [ ] Confirm it no longer appears in Supabase

### Test News Article Management
- [ ] Navigate to `/admin/news`
- [ ] Test creating, updating, and deleting news articles
- [ ] Verify data appears in Supabase `news` table

### Test Program Management
- [ ] Navigate to `/admin/programs`
- [ ] Test creating, updating, and deleting programs
- [ ] Verify data appears in Supabase `programs` table

### Test Announcements
- [ ] Navigate to `/admin/announcements`
- [ ] Test creating, updating, and deleting announcements
- [ ] Verify data appears in Supabase `announcements` table

### Test Appointment Booking
- [ ] Navigate to the public appointment booking page
- [ ] Submit an appointment request
- [ ] Verify it appears in Supabase `appointments` table with status 'pending'

## Verification Checklist

### Functionality Tests
- [ ] All CRUD operations complete without errors
- [ ] Success messages display appropriately
- [ ] Error messages are informative
- [ ] Form validation works correctly
- [ ] Page revalidation works (data updates on page)

### Database Verification
- [ ] All tables have data
- [ ] Timestamps are correctly formatted (ISO 8601)
- [ ] IDs are generated as UUIDs
- [ ] Relationships between data are maintained

### Admin Features
- [ ] Admin pages are still accessible
- [ ] Only admin operations use supabaseAdmin (not client-side)
- [ ] Data persistence works across sessions
- [ ] Bulk operations work correctly

## Troubleshooting

If you encounter issues:

1. **"Missing environment variable" errors**
   - Restart your dev server after setting environment variables
   - Ensure no spaces around `=` in `.env.local`

2. **"Failed to save" errors**
   - Check browser console for detailed error messages
   - Verify Supabase URL and keys are correct
   - Check that tables exist in Supabase

3. **Data not appearing**
   - Verify you're looking in the correct Supabase table
   - Check if RLS (Row Level Security) is blocking access
   - Ensure table schema matches expected column names

4. **Authentication errors**
   - Firebase Auth is separate from Supabase Auth
   - Ensure you're logged in to your app first
   - Check that admin auth checks are still working

## Post-Migration Tasks

- [ ] Update any frontend components that read from Firebase Firestore to use Supabase
- [ ] Set up Row Level Security (RLS) policies in Supabase
- [ ] Configure backups in Supabase
- [ ] Set up monitoring/alerts for database issues
- [ ] Document any custom admin workflows
- [ ] Train team members on the new system
- [ ] Remove any unused Firebase Firestore code (keep Auth!)

## Rollback Plan

If you need to revert to Firebase:
1. The original Firebase code is still available in your version control
2. Revert the modified files
3. Keep Supabase tables as backup
4. Update `.env` to remove Supabase keys

## Files Modified Summary

### Client Library Files
- **NEW:** `src/lib/supabase-client.ts` - Client-side Supabase instance
- **NEW:** `src/lib/supabase-admin.ts` - Server-side admin instance
- **UNCHANGED:** `src/lib/firebase.ts` - Still used for Firebase Auth
- **UNCHANGED:** `src/lib/firebase-admin.ts` - Still available if needed

### Server Action Files
- **UPDATED:** `src/app/admin/blog/actions.ts` - Now uses Supabase
- **UPDATED:** `src/app/admin/news/actions.ts` - Now uses Supabase
- **UPDATED:** `src/app/admin/programs/actions.ts` - Now uses Supabase
- **UPDATED:** `src/app/admin/announcements/actions.ts` - Now uses Supabase
- **UPDATED:** `src/app/appointment/actions.ts` - Now uses Supabase

### Configuration Files
- **UPDATED:** `package.json` - Added @supabase/supabase-js dependency
- **NEW:** `.env.example` - Updated with Supabase env vars
- **NEW:** `docs/SUPABASE_SETUP.md` - Setup guide
- **NEW:** `docs/SUPABASE_READING.md` - Data reading guide
- **NEW:** `docs/supabase-schema.sql` - Database schema

## Support

For issues or questions:
1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review error messages in the browser console
3. Check Supabase project logs for database errors
4. Refer to this document's Troubleshooting section
