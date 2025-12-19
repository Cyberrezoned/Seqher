export const CONTENT_SOURCE =
  process.env.NEXT_PUBLIC_CONTENT_SOURCE === 'static' ? 'static' : 'supabase';

export const USE_STATIC_CONTENT = CONTENT_SOURCE === 'static';

