import fs from 'node:fs';
import path from 'node:path';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function unescapeSqlString(value) {
  return value.replace(/''/g, "'");
}

function parseInsertValues(valuesText) {
  const rows = [];
  let i = 0;

  function skipWhitespace() {
    while (i < valuesText.length && /\s/.test(valuesText[i])) i++;
  }

  function parseValue() {
    skipWhitespace();
    if (valuesText.slice(i, i + 4).toLowerCase() === 'null') {
      i += 4;
      return null;
    }

    if (valuesText[i] === "'") {
      i++; // opening quote
      let out = '';
      while (i < valuesText.length) {
        const ch = valuesText[i];
        if (ch === "'") {
          const next = valuesText[i + 1];
          if (next === "'") {
            out += "'";
            i += 2;
            continue;
          }
          i++; // closing quote
          return out;
        }
        out += ch;
        i++;
      }
      fail('Unterminated SQL string');
    }

    // Non-string literal (numbers, booleans)
    let start = i;
    while (i < valuesText.length && valuesText[i] !== ',' && valuesText[i] !== ')') i++;
    return valuesText.slice(start, i).trim();
  }

  while (i < valuesText.length) {
    skipWhitespace();
    if (valuesText[i] === ',') {
      i++;
      continue;
    }
    if (valuesText[i] !== '(') {
      i++;
      continue;
    }

    i++; // '('
    const row = [];
    while (i < valuesText.length) {
      const value = parseValue();
      row.push(value);
      skipWhitespace();
      if (valuesText[i] === ',') {
        i++;
        continue;
      }
      if (valuesText[i] === ')') {
        i++;
        break;
      }
    }
    rows.push(row);
  }

  return rows;
}

function toIsoString(value) {
  if (!value) return new Date().toISOString();
  const asString = String(value);
  const parsed = new Date(asString);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  // Postgres timestamp with space + timezone: "2025-12-19 07:12:17.151015+00"
  const normalized = asString.replace(' ', 'T');
  const parsed2 = new Date(normalized);
  if (!Number.isNaN(parsed2.getTime())) return parsed2.toISOString();
  return new Date().toISOString();
}

const inputPath = process.argv[2];
const outputPath = process.argv[3] ?? path.join(process.cwd(), 'src', 'content', 'blogposts.ng.json');

if (!inputPath) {
  fail('Usage: node scripts/import-blogposts-from-sql.mjs <path-to-blogposts_rows.sql> [output-path]');
}

const sql = fs.readFileSync(inputPath, 'utf8');

const headerMatch = sql.match(/INSERT\s+INTO\s+"public"\."blogposts"\s*\(([^)]+)\)\s*VALUES/i);
if (!headerMatch) {
  fail('Could not find INSERT INTO "public"."blogposts" (...) VALUES statement in the SQL file.');
}

const columns = headerMatch[1]
  .split(',')
  .map((c) => c.trim().replace(/^"|"$/g, ''))
  .filter(Boolean);

const headerIndex = headerMatch.index ?? 0;
const valuesStart = headerIndex + headerMatch[0].length;
let i = valuesStart;
let inString = false;
let valuesEnd = -1;

while (i < sql.length) {
  const ch = sql[i];
  if (inString) {
    if (ch === "'") {
      const next = sql[i + 1];
      if (next === "'") {
        i += 2;
        continue;
      }
      inString = false;
    }
    i++;
    continue;
  }

  if (ch === "'") {
    inString = true;
    i++;
    continue;
  }

  if (ch === ';') {
    valuesEnd = i;
    break;
  }

  i++;
}

if (valuesEnd === -1) {
  fail('Could not locate the terminating semicolon for the INSERT statement.');
}

const valuesText = sql.slice(valuesStart, valuesEnd).trim();

const rows = parseInsertValues(valuesText);
const objects = rows.map((row) => {
  const out = {};
  for (let idx = 0; idx < columns.length; idx++) out[columns[idx]] = row[idx] ?? null;
  return out;
});

const blogPosts = objects
  .filter((o) => (o.locale ?? 'ng') === 'ng')
  .map((o) => {
    const imageId = typeof o.image_id === 'string' && !o.image_id.startsWith('http') ? o.image_id : '';
    const imageUrl = typeof o.image_id === 'string' && o.image_id.startsWith('http') ? o.image_id : null;
    return {
      id: String(o.id ?? o.slug ?? o.title ?? ''),
      title: String(o.title ?? ''),
      slug: String(o.slug ?? ''),
      content: typeof o.content === 'string' ? unescapeSqlString(o.content) : '',
      imageId,
      imageUrl,
      author: String(o.author ?? 'Admin') || 'Admin',
      authorId: String(o.author_id ?? ''),
      locale: 'ng',
      createdAt: toIsoString(o.created_at),
      updatedAt: toIsoString(o.updated_at),
      excerpt: typeof o.excerpt === 'string' ? unescapeSqlString(o.excerpt) : null,
    };
  })
  .filter((p) => p.slug && p.title);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify({ blogPosts }, null, 2) + '\n', 'utf8');
console.log(`Wrote ${blogPosts.length} blog posts to ${outputPath}`);
