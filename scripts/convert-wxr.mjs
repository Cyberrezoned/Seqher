import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function die(message) {
  console.error(message);
  process.exit(1);
}

function readFileOrStdin(maybePath) {
  if (maybePath) {
    const p = path.resolve(process.cwd(), maybePath);
    if (!fs.existsSync(p)) die(`File not found: ${p}`);
    return fs.readFileSync(p, 'utf8');
  }
  return fs.readFileSync(0, 'utf8'); // stdin
}

function getCdataOrText(block, tagName) {
  const safe = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<${safe}>([\\s\\S]*?)<\\/${safe}>`, 'i');
  const m = block.match(re);
  if (!m) return null;
  const raw = m[1].trim();
  const cdata = raw.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/i);
  return (cdata ? cdata[1] : raw).trim();
}

function allMatches(block, tagName) {
  const safe = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<${safe}>([\\s\\S]*?)<\\/${safe}>`, 'gi');
  const out = [];
  let m;
  while ((m = re.exec(block))) {
    const raw = m[1].trim();
    const cdata = raw.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/i);
    out.push((cdata ? cdata[1] : raw).trim());
  }
  return out;
}

function parsePostMeta(itemXml) {
  const metas = [];
  const re = /<wp:postmeta>([\s\S]*?)<\/wp:postmeta>/gi;
  let m;
  while ((m = re.exec(itemXml))) {
    const metaXml = m[1];
    const key = getCdataOrText(metaXml, 'wp:meta_key');
    const value = getCdataOrText(metaXml, 'wp:meta_value');
    if (key) metas.push({ key, value });
  }
  return metas;
}

function extractFirstImageUrlFromHtml(html) {
  if (!html) return null;
  const match = String(html).match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match?.[1] ?? null;
}

function isHttpUrl(value) {
  if (!value) return false;
  return /^https?:\/\//i.test(String(value).trim());
}

function buildFallbackImageUrl({ title, content }) {
  // Keep this conservative: only used when WXR has no usable images.
  const text = `${title}\n${content}`.toLowerCase();
  if (/\bclimate\b|\bflood\b|\brelief\b|\bhumanitarian\b|\bdisplaced\b|\bemergency\b/.test(text)) {
    return 'https://images.unsplash.com/photo-1584923772421-93474e5ce2d1?auto=format&fit=crop&w=1600&q=80';
  }
  if (/\bhiv\b|\baids\b|\bprep\b|\bpep\b|\bsti\b|\btuberculosis\b|\btb\b|\bmalaria\b|\bcervical\b|\bcancer\b|\bclinic\b|\bhealth\b/.test(text)) {
    return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80';
  }
  if (/\bmental health\b|\bwellbeing\b|\bwell-being\b|\bpodcast\b|\bdepression\b|\banxiety\b/.test(text)) {
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80';
  }
  if (/\bright(s)?\b|\bjustice\b|\badvocacy\b|\blegal\b|\barrest\b|\bdetention\b|\bextortion\b/.test(text)) {
    return 'https://images.unsplash.com/photo-1590099543482-3b3d3083a474?auto=format&fit=crop&w=1600&q=80';
  }
  if (/\beducation\b|\bschool\b|\bliteracy\b|\bstudent\b|\bclass\b/.test(text)) {
    return 'https://images.unsplash.com/photo-1522134939204-9b9957145632?auto=format&fit=crop&w=1600&q=80';
  }
  return 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80';
}

function ensureContentHasImage({ title, content, imageUrl }) {
  const html = String(content ?? '');
  if (!imageUrl) return html;

  if (/<img[^>]+src=["'][^"']+["'][^>]*>/i.test(html)) return html;
  if (/<img(?![^>]*\ssrc=)[^>]*>/i.test(html)) {
    return html.replace(/<img(?![^>]*\ssrc=)([^>]*)>/i, `<img src="${imageUrl}" alt="${String(title).replace(/"/g, '&quot;')}"$1>`);
  }

  return `<!-- wp:image -->\n<figure class="wp-block-image"><img src="${imageUrl}" alt="${String(title).replace(/"/g, '&quot;')}" /></figure>\n<!-- /wp:image -->\n\n${html}`;
}

function parseWxr(xml) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRe.exec(xml))) items.push(m[1]);

  const attachmentsById = new Map();
  const images = [];
  const posts = [];
  const pages = [];

  for (const item of items) {
    const postType = getCdataOrText(item, 'wp:post_type');
    const status = getCdataOrText(item, 'wp:status');
    const postId = getCdataOrText(item, 'wp:post_id');
    const slug = getCdataOrText(item, 'wp:post_name');
    const title = getCdataOrText(item, 'title') ?? '';
    const content = getCdataOrText(item, 'content:encoded') ?? '';
    const creator = getCdataOrText(item, 'dc:creator') ?? 'Admin';
    const attachmentUrl = getCdataOrText(item, 'wp:attachment_url');
    const postDate = getCdataOrText(item, 'wp:post_date_gmt') || getCdataOrText(item, 'wp:post_date') || null;
    const categories = allMatches(item, 'category');
    const metas = parsePostMeta(item);

    if (postType === 'attachment' && postId && attachmentUrl) {
      attachmentsById.set(postId, attachmentUrl);
      images.push({
        id: `wp-media-${postId}`,
        url: attachmentUrl,
        alt: title || slug || null,
        hint: null,
      });
      continue;
    }

    if (status && status !== 'publish') continue;

    if (postType === 'post') {
      posts.push({
        postId,
        slug,
        title,
        content,
        creator,
        postDate,
        categories,
        metas,
      });
      continue;
    }

    if (postType === 'page') {
      pages.push({
        postId,
        slug,
        title,
        content,
        creator,
        postDate,
        categories,
        metas,
      });
      continue;
    }
  }

  // Resolve featured images for posts/pages.
  function resolveFeaturedUrl(metas) {
    const thumb = metas.find((m) => m.key === '_thumbnail_id')?.value;
    if (thumb && attachmentsById.has(String(thumb))) return attachmentsById.get(String(thumb));
    return null;
  }

  const blogPosts = posts
    .filter((p) => p.slug && p.title)
    .map((p) => {
      let imageUrl =
        resolveFeaturedUrl(p.metas) ||
        extractFirstImageUrlFromHtml(p.content) ||
        null;
      if (!isHttpUrl(imageUrl)) imageUrl = null;
      if (!imageUrl) imageUrl = buildFallbackImageUrl({ title: p.title, content: p.content });

      return {
        id: String(p.postId ?? p.slug),
        title: p.title,
        slug: p.slug,
        content: ensureContentHasImage({ title: p.title, content: p.content, imageUrl }),
        imageUrl,
        author: p.creator,
        authorId: '',
        locale: 'ng',
        createdAt: p.postDate ? String(p.postDate).replace(' ', 'T') + 'Z' : new Date().toISOString(),
      };
    });

  const pageRecords = pages
    .filter((p) => p.slug && p.title)
    .map((p) => {
      let imageUrl =
        resolveFeaturedUrl(p.metas) ||
        extractFirstImageUrlFromHtml(p.content) ||
        null;
      if (!isHttpUrl(imageUrl)) imageUrl = null;
      if (!imageUrl) imageUrl = buildFallbackImageUrl({ title: p.title, content: p.content });
      return {
        id: String(p.postId ?? p.slug),
        title: p.title,
        slug: p.slug,
        content: ensureContentHasImage({ title: p.title, content: p.content, imageUrl }),
        imageUrl,
        author: p.creator,
        locale: 'ng',
        createdAt: p.postDate ? String(p.postDate).replace(' ', 'T') + 'Z' : new Date().toISOString(),
      };
    });

  return {
    images,
    blogPosts,
    pages: pageRecords,
    attachmentCount: attachmentsById.size,
    postCount: posts.length,
    pageCount: pages.length,
  };
}

function main() {
  const inputPath = process.argv[2];
  const outPath = process.argv[3] || 'src/content/wordpress-export.json';

  if (!inputPath) {
    die('Usage: node scripts/convert-wxr.mjs <export.xml> [out.json]');
  }

  const xml = readFileOrStdin(inputPath);
  const parsed = parseWxr(xml);

  const targetPath = path.resolve(process.cwd(), outPath);
  const existing = fs.existsSync(targetPath) ? JSON.parse(fs.readFileSync(targetPath, 'utf8')) : {};

  // Merge images by id; for other sections we only overwrite if WXR contains them.
  const mergedImages = new Map();
  for (const img of Array.isArray(existing.images) ? existing.images : []) {
    const id = img?.id ?? img?.imageId ?? img?.slug;
    const url = img?.url ?? img?.imageUrl;
    if (id && url) mergedImages.set(String(id), img);
  }
  for (const img of parsed.images) {
    if (img.id && img.url) mergedImages.set(String(img.id), img);
  }

  const next = {
    images: [...mergedImages.values()],
    programs: existing.programs ?? [],
    blogPosts: parsed.blogPosts.length ? parsed.blogPosts : existing.blogPosts ?? [],
    newsArticles: existing.newsArticles ?? [],
    announcements: existing.announcements ?? [],
    // `pages` is kept for future mapping; the app doesn't render it yet.
    pages: parsed.pages,
  };

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, `${JSON.stringify(next, null, 2)}\n`);

  console.log('Converted WXR:', {
    attachments: parsed.attachmentCount,
    posts: parsed.postCount,
    pages: parsed.pageCount,
    blogPostsWritten: parsed.blogPosts.length,
    imagesWritten: parsed.images.length,
    outPath,
  });
  if (parsed.postCount === 0 && parsed.pageCount === 0) {
    console.log(
      'Note: This WXR appears to contain only media attachments (no posts/pages). Export "All content" from WordPress to include posts/pages.'
    );
  }
}

main();
