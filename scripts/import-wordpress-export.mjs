import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createClient } from '@supabase/supabase-js';

const root = process.cwd();
const inputPath = process.argv[2] ? path.resolve(root, process.argv[2]) : path.resolve(root, 'src/content/wordpress-export.json');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, 'utf8').trim();
if (!raw) {
  console.error(`Input file is empty: ${inputPath}`);
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(raw);
} catch {
  console.error(`Invalid JSON: ${inputPath}`);
  process.exit(1);
}

const images = Array.isArray(payload.images) ? payload.images : [];
const programs = Array.isArray(payload.programs) ? payload.programs : [];
const blogPosts = Array.isArray(payload.blogPosts) ? payload.blogPosts : [];
const newsArticles = Array.isArray(payload.newsArticles) ? payload.newsArticles : [];
const announcements = Array.isArray(payload.announcements) ? payload.announcements : [];

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const includePlaceholders = !process.argv.includes('--no-placeholders');

function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

function stableWpId(value) {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  return str.length ? str : null;
}

async function upsertImages() {
  const placeholderPath = path.resolve(root, 'src/lib/placeholder-images.json');
  const placeholderImages =
    includePlaceholders && fs.existsSync(placeholderPath)
      ? JSON.parse(fs.readFileSync(placeholderPath, 'utf8')).placeholderImages ?? []
      : [];

  const mergedById = new Map();

  for (const img of placeholderImages) {
    const row = compact({
      id: img.id,
      url: img.imageUrl,
      alt: img.description ?? null,
      hint: img.imageHint ?? null,
    });
    if (row.id && row.url) mergedById.set(row.id, row);
  }

  for (const img of images) {
    const row = compact({
      id: img.id ?? img.imageId ?? img.slug,
      url: img.url ?? img.imageUrl,
      alt: img.alt ?? img.description ?? null,
      hint: img.hint ?? img.imageHint ?? null,
    });
    if (row.id && row.url) mergedById.set(row.id, row);
  }

  const rows = [...mergedById.values()];
  if (!rows.length) return;

  const invalid = rows.filter((r) => !r.id || !r.url);
  if (invalid.length) {
    throw new Error('Some images are missing `id` or `url`.');
  }

  const { error } = await supabase.from('images').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
}

async function insertPrograms() {
  if (!programs.length) return;
  const rows = programs.map((p) =>
    compact({
      wp_id: stableWpId(p.wp_id ?? p.wpId ?? p.id ?? p.slug ?? p.title),
      title: p.title,
      summary: p.summary,
      description: p.description ?? p.content,
      image_id: p.imageId ?? p.image_id,
      image_url: p.imageUrl ?? p.image_url,
      sdg_goals: p.sdgGoals ?? p.sdg_goals ?? [],
      locale: p.locale ?? 'ng',
      created_at: p.createdAt ?? p.created_at,
    })
  );

  const invalid = rows.filter((r) => !r.wp_id || !r.title || !r.summary || !r.description);
  if (invalid.length) {
    throw new Error('Some programs are missing required fields (`wp_id`, `title`, `summary`, `description`).');
  }

  const { error } = await supabase.from('programs').upsert(rows, { onConflict: 'wp_id' });
  if (error) throw error;
}

async function upsertBlogPosts() {
  if (!blogPosts.length) return;
  const rows = blogPosts.map((p) =>
    compact({
      wp_id: stableWpId(p.wp_id ?? p.wpId ?? p.id ?? p.slug ?? p.title),
      slug: p.slug,
      title: p.title,
      content: p.content,
      author: p.author,
      author_id: p.authorId ?? p.author_id,
      image_id: p.imageId ?? p.image_id,
      image_url: p.imageUrl ?? p.image_url,
      locale: p.locale ?? 'ng',
      created_at: p.createdAt ?? p.created_at,
    })
  );

  const invalid = rows.filter((r) => !r.slug || !r.title || !r.content);
  if (invalid.length) {
    throw new Error('Some blogPosts are missing `slug`, `title`, or `content`.');
  }

  const { error } = await supabase.from('blog_posts').upsert(rows, { onConflict: 'slug' });
  if (error) throw error;
}

async function upsertNews() {
  if (!newsArticles.length) return;
  const rows = newsArticles.map((n) =>
    compact({
      wp_id: stableWpId(n.wp_id ?? n.wpId ?? n.id ?? n.link ?? n.title),
      title: n.title,
      summary: n.summary,
      source: n.source,
      link: n.link,
      image_id: n.imageId ?? n.image_id,
      image_url: n.imageUrl ?? n.image_url,
      published_date: n.publishedDate ?? n.published_date,
      category: n.category,
      locale: n.locale ?? 'ng',
      created_at: n.createdAt ?? n.created_at,
    })
  );

  const invalid = rows.filter((r) => !r.link || !r.title || !r.summary || !r.source || !r.published_date || !r.category);
  if (invalid.length) {
    throw new Error('Some newsArticles are missing required fields (link/title/summary/source/publishedDate/category).');
  }

  const { error } = await supabase.from('news').upsert(rows, { onConflict: 'link' });
  if (error) throw error;
}

async function insertAnnouncements() {
  if (!announcements.length) return;
  const rows = announcements.map((a) =>
    compact({
      wp_id: stableWpId(a.wp_id ?? a.wpId ?? a.id ?? a.title),
      title: a.title,
      content: a.content,
      locale: a.locale ?? 'ng',
      created_at: a.createdAt ?? a.created_at,
    })
  );

  const invalid = rows.filter((r) => !r.wp_id || !r.title || !r.content);
  if (invalid.length) {
    throw new Error('Some announcements are missing required fields (`wp_id`, `title`, `content`).');
  }

  const { error } = await supabase.from('announcements').upsert(rows, { onConflict: 'wp_id' });
  if (error) throw error;
}

try {
  await upsertImages();
  await insertPrograms();
  await upsertBlogPosts();
  await upsertNews();
  await insertAnnouncements();

  console.log('Import complete:', {
    images: images.length,
    programs: programs.length,
    blogPosts: blogPosts.length,
    newsArticles: newsArticles.length,
    announcements: announcements.length,
  });
} catch (err) {
  console.error('Import failed:', err);
  process.exit(1);
}
