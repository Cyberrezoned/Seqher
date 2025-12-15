# Supabase Quick Reference

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

## Import Statements

### Client-Side (Reading Public Data)
```typescript
import { supabase } from '@/lib/supabase-client';
```

### Server-Side (Admin Operations)
```typescript
import { supabaseAdmin } from '@/lib/supabase-admin';
```

## Basic Operations

### CREATE (Server)
```typescript
const { data, error } = await supabaseAdmin
  .from('tableName')
  .insert({
    column1: value1,
    column2: value2,
  });
```

### READ (Client or Server)
```typescript
const { data, error } = await supabase
  .from('tableName')
  .select('*')
  .eq('id', id)
  .single();
```

### UPDATE (Server)
```typescript
const { data, error } = await supabaseAdmin
  .from('tableName')
  .update({ column: newValue })
  .eq('id', id);
```

### DELETE (Server)
```typescript
const { data, error } = await supabaseAdmin
  .from('tableName')
  .delete()
  .eq('id', id);
```

## Table Names
- `blogPosts` - Blog articles
- `news` - News articles
- `programs` - Programs
- `announcements` - Announcements
- `appointments` - Appointments

## Common Filters
```typescript
.eq('column', value)        // equal
.neq('column', value)       // not equal
.gt('column', value)        // greater than
.lt('column', value)        // less than
.gte('column', value)       // greater than or equal
.lte('column', value)       // less than or equal
.ilike('column', '%text%')  // case-insensitive like
.in('column', [v1, v2])     // in list
```

## Ordering & Limiting
```typescript
.order('created_at', { ascending: false })  // descending
.limit(10)                                   // limit results
.range(0, 9)                                 // pagination
```

## Error Handling
```typescript
const { data, error } = await supabase
  .from('table')
  .select('*');

if (error) {
  console.error('Error:', error.message);
  return { success: false, message: error.message };
}
```

## Real-Time
```typescript
const subscription = supabase
  .from('table')
  .on('*', (payload) => {
    console.log('Change:', payload);
  })
  .subscribe();

// Clean up
subscription.unsubscribe();
```

## Admin Action Pattern
```typescript
'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function myAction(data) {
  try {
    const { error } = await supabaseAdmin
      .from('tableName')
      .insert(data);
    
    if (error) throw error;
    
    revalidatePath('/path');
    return { success: true, message: 'Success!' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
```

## Useful Links
- [Supabase Docs](https://supabase.com/docs)
- [API Reference](https://supabase.com/docs/reference/javascript)
- [Dashboard](https://app.supabase.com)

## Key Files
- Setup: `docs/SUPABASE_SETUP.md`
- Data Reading: `docs/SUPABASE_READING.md`
- Schema: `docs/supabase-schema.sql`
- Checklist: `docs/MIGRATION_CHECKLIST.md`
