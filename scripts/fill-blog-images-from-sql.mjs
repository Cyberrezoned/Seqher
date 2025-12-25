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

function parseSqlColumns(sql) {
  const m = sql.match(/insert\s+into\s+["\w.]+\s*\(([\s\S]*?)\)\s*values/i);
  if (!m) return null;
  return m[1]
    .split(',')
    .map((s) => s.trim())
    .map((s) => s.replace(/^"|"$/g, ''));
}

function parseValueTuples(sql) {
  const idx = sql.toLowerCase().indexOf('values');
  if (idx === -1) die('Could not find VALUES in SQL.');
  const s = sql.slice(idx + 'values'.length);

  const tuples = [];
  let i = 0;
  let inString = false;
  let current = '';
  let depth = 0;
  let tuple = [];

  function pushValue() {
    const raw = current.trim();
    tuple.push(raw);
    current = '';
  }

  function pushTuple() {
    if (tuple.length) tuples.push(tuple);
    tuple = [];
  }

  while (i < s.length) {
    const ch = s[i];

    if (inString) {
      if (ch === "'") {
        if (s[i + 1] === "'") {
          current += "'";
          i += 2;
          continue;
        }
        inString = false;
        i += 1;
        continue;
      }
      current += ch;
      i += 1;
      continue;
    }

    if (ch === "'") {
      inString = true;
      i += 1;
      continue;
    }

    if (ch === '(') {
      depth += 1;
      i += 1;
      continue;
    }

    if (ch === ')') {
      if (depth === 1) {
        pushValue();
        pushTuple();
      }
      depth = Math.max(0, depth - 1);
      i += 1;
      continue;
    }

    if (ch === ',' && depth === 1) {
      pushValue();
      i += 1;
      continue;
    }

    // End of statement
    if (ch === ';' && depth === 0) break;

    if (depth >= 1) current += ch;
    i += 1;
  }

  return tuples.map((t) => t.map((v) => (v?.toLowerCase?.() === 'null' ? null : v)));
}

function toIso(ts) {
  if (!ts) return null;
  const s = String(ts).trim();
  const withT = s.replace(' ', 'T');
  if (withT.endsWith('+00')) return `${withT.slice(0, -3)}Z`;
  if (withT.endsWith('+00:00')) return `${withT.slice(0, -6)}Z`;
  return withT;
}

function coerceString(v) {
  if (v === null || v === undefined) return null;
  return String(v);
}

function isHttpUrl(value) {
  if (!value) return false;
  return /^https?:\/\//i.test(String(value).trim());
}

function rewriteSeqherUploadUrl(value) {
  if (!value) return value;
  const raw = String(value).trim();
  if (!raw) return raw;
  try {
    const parsed = new URL(raw);
    const isSeqher = parsed.hostname === 'seqher.org' || parsed.hostname === 'www.seqher.org';
    if (!isSeqher) return raw;
    if (!parsed.pathname.startsWith('/wp-content/uploads/')) return raw;
    parsed.hostname = 'sirpek.wordpress.com';
    parsed.protocol = 'https:';
    return parsed.toString();
  } catch {
    return raw;
  }
}

function rewriteSeqherUploadsInHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/https?:\/\/(www\.)?seqher\.org\/wp-content\/uploads\//gi, 'https://sirpek.wordpress.com/wp-content/uploads/');
}

function sanitizeNyScReferences(input) {
  if (!input) return '';
  return String(input)
    .replace(/Minimum of 2 years of verifiable post-?NYSC experience/gi, 'Minimum of 2 years of verifiable experience')
    .replace(/Minimum of 2 years of post-?NYSC clinical experience/gi, 'Minimum of 2 years of verifiable clinical experience')
    .replace(/,\s*with verifiable experience in/gi, ', with experience in')
    .replace(/post-?NYSC/gi, 'post-qualification')
    .replace(/\bNYSC\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:])/g, '$1');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function extractFirstImageUrlFromHtml(html) {
  if (!html) return null;
  const match = String(html).match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match?.[1] ?? null;
}

function buildFallbackLibrary() {
  const libPath = path.resolve(process.cwd(), 'src/lib/placeholder-images.json');
  if (!fs.existsSync(libPath)) return {};
  const raw = JSON.parse(fs.readFileSync(libPath, 'utf8'));
  const list = Array.isArray(raw?.placeholderImages) ? raw.placeholderImages : [];
  const byId = Object.fromEntries(list.map((p) => [p.id, p.imageUrl]));
  return byId;
}

function chooseFallbackImageUrl({ title, content, placeholders }) {
  const text = `${title}\n${content}`.toLowerCase();

  const pick = (id, fallback) => {
    const fromLib = placeholders?.[id];
    if (fromLib && isHttpUrl(fromLib)) return fromLib;
    return fallback;
  };

  // Prefer stable, real photos (Unsplash IDs) over local SVG placeholders.
  if (/\bmental health\b|\bwellbeing\b|\bwell-being\b|\bpodcast\b|\bdepression\b|\banxiety\b/.test(text)) {
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80';
  }
  if (/\bhiv\b|\baids\b|\bprep\b|\bpep\b|\bsti\b|\btuberculosis\b|\btb\b|\bmalaria\b|\bcervical\b|\bcancer\b/.test(text)) {
    return pick('news-good-health', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80');
  }
  if (/\bhealth\b|\bclinic\b|\bcare\b|\bwellness\b|\bwellbeing\b|\bwell-being\b/.test(text)) {
    return pick('news-good-health', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80');
  }
  if (/\bhuman rights\b|\bright(s)?\b|\bjustice\b|\badvocacy\b|\blegal\b|\barrest\b|\bdetention\b|\bextortion\b/.test(text)) {
    return pick('news-peace-justice', 'https://images.unsplash.com/photo-1590099543482-3b3d3083a474?auto=format&fit=crop&w=1600&q=80');
  }
  if (/\bgender\b|\bgbv\b|\bviolence\b|\bequality\b|\bwomen\b|\bfemin\b/.test(text)) {
    return pick('news-gender-equality', 'https://images.unsplash.com/photo-1678697644660-d33eb146d7ae?auto=format&fit=crop&w=1600&q=80');
  }
  if (/\beducation\b|\bschool\b|\bliteracy\b|\bstudent\b|\bclass\b/.test(text)) {
    return pick('news-quality-education', 'https://images.unsplash.com/photo-1522134939204-9b9957145632?auto=format&fit=crop&w=1600&q=80');
  }
  if (/\btraining\b|\bcapacity\b|\bmentorship\b|\bworkshop\b|\bleadership\b|\bgovernance\b/.test(text)) {
    return pick('news-health-innovation', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80');
  }
  if (/\bflood\b|\brelief\b|\bhumanitarian\b|\bdisplaced\b|\bbanditry\b|\bconflict\b|\bemergency\b/.test(text)) {
    return pick('blog-climate-action', 'https://images.unsplash.com/photo-1584923772421-93474e5ce2d1?auto=format&fit=crop&w=1600&q=80');
  }
  if (/\bcommunity\b|\bvolunteer\b|\bmovement\b|\bsolidarity\b/.test(text)) {
    return pick('hero-community', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1600&q=80');
  }

  return pick('blog-hero', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80');
}

function ensureContentHasImage({ title, content, imageUrl }) {
  const html = String(content ?? '');
  if (!imageUrl) return html;

  // If content already contains a src image, keep as-is.
  if (/<img[^>]+src=["'][^"']+["'][^>]*>/i.test(html)) return html;

  // If there is an img without src, fill the first one.
  if (/<img(?![^>]*\ssrc=)[^>]*>/i.test(html)) {
    return html.replace(/<img(?![^>]*\ssrc=)([^>]*)>/i, `<img src="${imageUrl}" alt="${escapeHtml(title)}"$1>`);
  }

  // Otherwise, prepend a simple WP image block.
  return `<!-- wp:image -->\n<figure class="wp-block-image"><img src="${imageUrl}" alt="${escapeHtml(title)}" /></figure>\n<!-- /wp:image -->\n\n${html}`;
}

function mapRows(columns, rows, placeholders) {
  const colIndex = new Map(columns.map((c, i) => [c, i]));
  const get = (row, name) => row[colIndex.get(name)];

  return rows
    .map((row) => {
      const id = coerceString(get(row, 'id'));
      const title = coerceString(get(row, 'title'));
      const contentRaw = coerceString(get(row, 'content')) || '';
      const slug = coerceString(get(row, 'slug'));
      const imageIdRaw = coerceString(get(row, 'image_id')) || '';
      const locale = coerceString(get(row, 'locale')) || 'ng';
      const createdAt = toIso(get(row, 'created_at')) || new Date().toISOString();
      const updatedAt = toIso(get(row, 'updated_at')) || createdAt;
      const excerpt = coerceString(get(row, 'excerpt'));

      const author = coerceString(get(row, 'author')) || 'Admin';
      const authorId = coerceString(get(row, 'author_id')) || '';

      let imageUrl = isHttpUrl(imageIdRaw) ? imageIdRaw : null;
      if (!imageUrl) {
        const fromContent = extractFirstImageUrlFromHtml(contentRaw);
        if (isHttpUrl(fromContent)) imageUrl = fromContent;
      }
      if (!imageUrl) {
        imageUrl = chooseFallbackImageUrl({ title: title ?? '', content: contentRaw, placeholders });
      }

      imageUrl = rewriteSeqherUploadUrl(imageUrl);
      const content = ensureContentHasImage({
        title: title ?? '',
        content: sanitizeNyScReferences(rewriteSeqherUploadsInHtml(contentRaw)),
        imageUrl,
      });

      const out = {
        id,
        title,
        slug,
        content,
        imageId: '',
        imageUrl,
        author,
        authorId,
        locale,
        createdAt,
        updatedAt,
        excerpt,
      };
      return out;
    })
    .filter((p) => p.id && p.slug && p.title);
}

function main() {
  const sqlPath = process.argv[2];
  const outPath = process.argv[3] || 'src/content/blogposts.ng.json';

  if (!sqlPath) die('Usage: node scripts/fill-blog-images-from-sql.mjs <blogposts_rows.sql> [out.json]');

  const sql = readFileOrStdin(sqlPath);
  const columns = parseSqlColumns(sql);
  if (!columns) die('Could not parse INSERT column list.');

  const tuples = parseValueTuples(sql);
  if (!tuples.length) die('No value tuples found.');

  const placeholders = buildFallbackLibrary();
  const posts = mapRows(columns, tuples, placeholders);

  const targetPath = path.resolve(process.cwd(), outPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, `${JSON.stringify({ blogPosts: posts }, null, 2)}\n`);

  const missing = posts.filter((p) => !p.imageUrl).length;
  console.log(`Wrote ${posts.length} blog posts to ${outPath} (${missing} missing images).`);
}

main();
