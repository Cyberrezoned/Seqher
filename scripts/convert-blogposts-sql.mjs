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

  return tuples.map((t) => t.map((v) => (v.toLowerCase() === 'null' ? null : v)));
}

function toIso(ts) {
  if (!ts) return null;
  const s = String(ts).trim();
  // Example: 2025-12-19 07:12:17.151015+00
  const withT = s.replace(' ', 'T');
  if (withT.endsWith('+00')) return `${withT.slice(0, -3)}Z`;
  if (withT.endsWith('+00:00')) return `${withT.slice(0, -6)}Z`;
  return withT;
}

function coerceString(v) {
  if (v === null || v === undefined) return null;
  return String(v);
}

function mapRows(columns, rows) {
  const colIndex = new Map(columns.map((c, i) => [c, i]));
  const get = (row, name) => row[colIndex.get(name)];

  return rows.map((row) => {
    const id = coerceString(get(row, 'id'));
    const title = coerceString(get(row, 'title'));
    const content = coerceString(get(row, 'content')) || '';
    const slug = coerceString(get(row, 'slug'));
    const imageIdRaw = coerceString(get(row, 'image_id')) || '';
    const locale = coerceString(get(row, 'locale')) || 'ng';
    const createdAt = toIso(get(row, 'created_at')) || new Date().toISOString();

    const author = coerceString(get(row, 'author')) || 'Admin';
    const authorId = coerceString(get(row, 'author_id')) || '';

    const imageUrl = imageIdRaw.startsWith('http') ? imageIdRaw : null;
    const imageId = !imageUrl ? imageIdRaw : '';

    const out = {
      id,
      title,
      slug,
      content,
      ...(imageId ? { imageId } : {}),
      ...(imageUrl ? { imageUrl } : {}),
      author,
      authorId,
      locale,
      createdAt,
    };
    return out;
  });
}

function main() {
  const sqlPath = process.argv[2];
  const outPath = process.argv[3] || 'src/content/wordpress-export.json';

  const sql = readFileOrStdin(sqlPath);
  const columns = parseSqlColumns(sql);
  if (!columns) die('Could not parse INSERT column list.');

  const tuples = parseValueTuples(sql);
  if (!tuples.length) die('No value tuples found.');

  const posts = mapRows(columns, tuples).filter((p) => p.id && p.slug && p.title);

  const targetPath = path.resolve(process.cwd(), outPath);
  const existing = fs.existsSync(targetPath) ? JSON.parse(fs.readFileSync(targetPath, 'utf8')) : {};

  const next = {
    images: existing.images ?? [],
    programs: existing.programs ?? [],
    blogPosts: posts,
    newsArticles: existing.newsArticles ?? [],
    announcements: existing.announcements ?? [],
  };

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, `${JSON.stringify(next, null, 2)}\n`);

  console.log(`Wrote ${posts.length} blog posts to ${outPath}`);
}

main();

