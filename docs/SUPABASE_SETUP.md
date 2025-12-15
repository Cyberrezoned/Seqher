# Supabase Integration Setup Guide

This document explains how to set up and integrate Supabase for admin CRUD operations in your Seqher application.

## Overview

Supabase has been integrated to handle all admin database operations (create, update, delete) for:
- Blog Posts
- News Articles
- Programs
- Announcements
- Appointments

Firebase remains intact for authentication and any non-admin functions.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Supabase Public URLs and Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Service Role Key (for server-side admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### How to Get These Values:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Keep the service role key secret and never commit it to version control!**

## Database Schema Setup

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Create a new query and copy the contents from `docs/supabase-schema.sql`
4. Run the SQL to create all tables with proper indexes and constraints

The schema includes:
- `blogPosts` - Blog post data
- `news` - News articles with categories
- `programs` - Program information with SDG goals
- `announcements` - Site announcements
- `appointments` - User appointment requests

## Modified Files

The following files have been updated to use Supabase instead of Firebase for admin operations:

### Server Actions (Updated to use Supabase)
- `src/app/admin/blog/actions.ts` - Blog CRUD operations
- `src/app/admin/news/actions.ts` - News CRUD operations
- `src/app/admin/programs/actions.ts` - Program CRUD operations
- `src/app/admin/announcements/actions.ts` - Announcement CRUD operations
- `src/app/appointment/actions.ts` - Appointment booking

### New Supabase Client Files
- `src/lib/supabase-client.ts` - Client-side Supabase instance
- `src/lib/supabase-admin.ts` - Server-side admin Supabase instance

## Installation

1. Install the Supabase package:
```bash
npm install @supabase/supabase-js
```

Or if using yarn:
```bash
yarn add @supabase/supabase-js
```

2. Update your environment variables in `.env.local`

3. Run your development server:
```bash
npm run dev
```

## How It Works

### Server-Side Admin Operations

All admin CRUD operations use the `supabaseAdmin` client (with service role key) for security:

```typescript
import { supabaseAdmin } from '@/lib/supabase-admin';

// Create
const { error } = await supabaseAdmin
  .from('tableName')
  .insert({ data });

// Update
const { error } = await supabaseAdmin
  .from('tableName')
  .update({ data })
  .eq('id', id);

// Delete
const { error } = await supabaseAdmin
  .from('tableName')
  .delete()
  .eq('id', id);
```

### Row Level Security (RLS)

The schema includes RLS policies to ensure only admins can modify data. You may need to:

1. Enable authentication checks in your RLS policies
2. Store an `is_admin` flag in your user metadata
3. Uncomment and adjust the RLS policies in `supabase-schema.sql` based on your auth setup

## Firebase Still Used For

- User authentication (Firebase Auth)
- Any legacy functions that haven't been migrated
- FirebaseContext and auth hooks

## Testing Admin Operations

1. Navigate to an admin page (e.g., `/admin/blog`)
2. Try creating, updating, or deleting an item
3. Check the Supabase dashboard to verify the data was saved correctly

## Troubleshooting

### "Missing NEXT_PUBLIC_SUPABASE_URL" Error

- Ensure all environment variables are set in `.env.local`
- Restart your development server after adding environment variables

### "Failed to save" Error

- Check Supabase dashboard for any RLS policy errors
- Verify your service role key has the correct permissions
- Check browser console for detailed error messages

### Data Not Appearing

- Verify the SQL schema was run correctly
- Check that table names match exactly (case-sensitive)
- Ensure timestamps are in ISO format

## Next Steps

1. Test all admin functions to ensure they work correctly
2. Set up proper Row Level Security (RLS) policies for your auth setup
3. Consider implementing audit logging for admin actions
4. Add proper error monitoring and logging

## Need Help?

Refer to the [Supabase Documentation](https://supabase.com/docs) for more information on:
- Database operations
- Authentication
- Row Level Security
- Real-time features
