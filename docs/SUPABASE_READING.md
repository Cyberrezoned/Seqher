# Supabase Data Reading Guide

This document explains how to read data from Supabase in your components and pages.

## Client-Side Reading (with Anon Key)

For public data that doesn't require authentication, use the client-side Supabase instance:

```typescript
import { supabase } from '@/lib/supabase-client';

// Read all blog posts
const { data, error } = await supabase
  .from('blogPosts')
  .select('*')
  .order('created_at', { ascending: false });

// Read a single blog post
const { data, error } = await supabase
  .from('blogPosts')
  .select('*')
  .eq('slug', slug)
  .single();
```

## Server-Side Reading (with Service Role Key)

For sensitive data that requires admin access, use the server-side admin instance:

```typescript
import { supabaseAdmin } from '@/lib/supabase-admin';

const { data, error } = await supabaseAdmin
  .from('appointments')
  .select('*')
  .order('created_at', { ascending: false });
```

## Common Queries

### Blog Posts
```typescript
// Get all published blog posts
const { data: posts } = await supabase
  .from('blogPosts')
  .select('*')
  .order('created_at', { ascending: false });

// Get a single blog post by slug
const { data: post } = await supabase
  .from('blogPosts')
  .select('*')
  .eq('slug', slug)
  .single();

// Search blog posts by title
const { data: results } = await supabase
  .from('blogPosts')
  .select('*')
  .ilike('title', `%${searchTerm}%`);
```

### News Articles
```typescript
// Get all news articles
const { data: articles } = await supabase
  .from('news')
  .select('*')
  .order('publishedDate', { ascending: false });

// Get news by category
const { data: articles } = await supabase
  .from('news')
  .select('*')
  .eq('category', 'Climate Action')
  .order('publishedDate', { ascending: false });
```

### Programs
```typescript
// Get all programs
const { data: programs } = await supabase
  .from('programs')
  .select('*')
  .order('created_at', { ascending: false });

// Get a single program
const { data: program } = await supabase
  .from('programs')
  .select('*')
  .eq('id', programId)
  .single();
```

### Announcements
```typescript
// Get all announcements
const { data: announcements } = await supabase
  .from('announcements')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(5); // Get latest 5
```

### Appointments (Admin Only)
```typescript
// Get all pending appointments
const { data: appointments } = await supabaseAdmin
  .from('appointments')
  .select('*')
  .eq('status', 'pending')
  .order('appointmentDate', { ascending: true });
```

## Real-Time Subscriptions

To get real-time updates when data changes:

```typescript
import { supabase } from '@/lib/supabase-client';

const subscription = supabase
  .from('announcements')
  .on('*', (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();

// Don't forget to unsubscribe when done
subscription.unsubscribe();
```

## Pagination

```typescript
const pageSize = 10;
const pageIndex = 0;

const { data: posts } = await supabase
  .from('blogPosts')
  .select('*', { count: 'exact' })
  .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1)
  .order('created_at', { ascending: false });
```

## Error Handling

Always check for errors when querying:

```typescript
const { data, error } = await supabase
  .from('blogPosts')
  .select('*');

if (error) {
  console.error('Database error:', error.message);
  // Handle error appropriately
} else {
  // Use data
}
```

## Filtering Examples

```typescript
// Multiple filters (AND logic)
const { data } = await supabase
  .from('news')
  .select('*')
  .eq('category', 'Climate Action')
  .gt('publishedDate', '2024-01-01');

// Not equal
const { data } = await supabase
  .from('appointments')
  .select('*')
  .neq('status', 'cancelled');

// Like/ilike (case-insensitive)
const { data } = await supabase
  .from('blogPosts')
  .select('*')
  .ilike('title', `%climate%`);

// In list
const { data } = await supabase
  .from('programs')
  .select('*')
  .in('id', [id1, id2, id3]);
```

## Updating Your Components

When migrating components to read from Supabase instead of Firebase:

### Before (Firebase)
```typescript
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const querySnapshot = await getDocs(collection(db, 'blogPosts'));
const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

### After (Supabase)
```typescript
import { supabase } from '@/lib/supabase-client';

const { data: posts } = await supabase
  .from('blogPosts')
  .select('*');
```

## Notes

- Supabase uses UUID by default for primary keys
- Timestamps should be in ISO 8601 format
- Use `.single()` when expecting exactly one result
- Use `.limit(1).single()` for optional results with fallback
- For large datasets, always implement pagination
