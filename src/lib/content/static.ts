import type { Announcement, BlogPost, NewsArticle, Program } from '@/lib/types';
import raw from '@/content/wordpress-export.json';
import ngBlogPostsRaw from '@/content/blogposts.ng.json';
import { extractFirstImageUrl, htmlToText, isBlockedSeqherWpMediaUrl, sanitizeNyScReferences } from '@/lib/content/wp';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ExportPayload = {
  images?: unknown[];
  programs?: unknown[];
  blogPosts?: unknown[];
  newsArticles?: unknown[];
  announcements?: unknown[];
};

const basePayload = raw as ExportPayload;
const ngPayload = ngBlogPostsRaw as { blogPosts?: unknown[] };
const payload: ExportPayload = {
  ...basePayload,
  // Prefer the SQL-derived Nigeria payload for overlapping slugs.
  blogPosts: [...(ngPayload.blogPosts ?? []), ...(basePayload.blogPosts ?? [])],
};

function asArray(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('/')) return trimmed;
  if (!/^https?:\/\//i.test(trimmed)) return null;
  if (isBlockedSeqherWpMediaUrl(trimmed)) return null;
  return trimmed;
}

function firstValidImageUrl(...candidates: unknown[]): string | null {
  for (const candidate of candidates) {
    const normalized = normalizeImageUrl(candidate);
    if (normalized) return normalized;
  }
  return null;
}

function resolvePlaceholderImageUrl(id: string): string | null {
  const found = PlaceHolderImages.find((p) => p.id === id);
  return found?.imageUrl ?? null;
}

function guessBlogImageId(title: string, content: string): string {
  const haystack = `${title}\n${htmlToText(content)}`.toLowerCase();

  if (/\bvogue\b|\bdance\b|\bballroom\b/.test(haystack)) return 'blog-vogue';
  if (/\btransgender\b|\btrans\b|\btaw\b|\bawareness week\b/.test(haystack)) return 'blog-trans-awareness';
  if (/\bhiv\b|\baids\b|\bprep\b|\bpep\b|\bsti\b/.test(haystack)) return 'blog-hiv-health';
  if (/\bmental health\b|\bwellbeing\b|\bwell-being\b|\bpodcast\b/.test(haystack)) return 'blog-mental-health';
  if (/\bhuman rights\b|\bright(s)?\b|\bjustice\b|\badvocacy\b/.test(haystack)) return 'blog-human-rights';
  if (/\bflood\b|\brelief\b|\bhumanitarian\b|\bdisplaced\b/.test(haystack)) return 'blog-emergency-response';
  if (/\btraining\b|\bcapacity\b|\bmentorship\b|\bworkshop\b/.test(haystack)) return 'blog-capacity-building';
  if (/\bopen position\b|\bjob\b|\bapplication\b|\bdeadline\b|\bprogram assistant\b|\blaboratory\b|\bmedical officer\b/.test(haystack))
    return 'blog-careers';

  if (/\bhealth\b|\bclinic\b|\bcheck-?up\b|\bcare\b/.test(haystack)) return 'blog-health-equity';
  return 'blog-community';
}

function rewriteWpHtmlImages(html: string, replacementUrl: string | null): string {
  if (!html) return '';
  if (!replacementUrl) return html;

  const withMissingSrcFixed = html.replace(/<img(?![^>]*\ssrc=)([^>]*)>/gi, `<img src="${replacementUrl}"$1>`);
  return withMissingSrcFixed.replace(
    /(<img[^>]*\ssrc=)[\"']https?:\/\/(www\.)?seqher\.org\/wp-content\/[^\"']+[\"']/gi,
    `$1"${replacementUrl}"`
  );
}

export function getStaticPrograms(locale: Program['locale']): Program[] {
  return asArray(payload.programs)
    .filter((p) => (p?.locale ?? 'ng') === locale || (p?.locale ?? 'ng') === 'global')
    .map(
      (p): Program => {
        const description = String(p.description ?? p.content ?? '');
        const imageUrl = firstValidImageUrl(p.imageUrl, p.image_url, extractFirstImageUrl(description));
        return {
          id: String(p.id ?? p.slug ?? p.title ?? ''),
          title: String(p.title ?? ''),
          summary: String(p.summary ?? ''),
          description,
          imageId: String(p.imageId ?? p.image_id ?? ''),
          imageUrl: imageUrl ?? null,
          sdgGoals: Array.isArray(p.sdgGoals ?? p.sdg_goals) ? (p.sdgGoals ?? p.sdg_goals) : [],
          locale: ((p.locale ?? locale) as Program['locale']) || locale,
        };
      }
    )
    .filter((p) => p.id && p.title);
}

export function getStaticProgramById(locale: Program['locale'], id: string): Program | null {
  const normalizedId = id === 'queer-health-navigation' ? 'hiv-sti-prep' : id;
  return getStaticPrograms(locale).find((p) => p.id === normalizedId) ?? null;
}

export function getStaticBlogPosts(locale: BlogPost['locale']): BlogPost[] {
  const seenSlugs = new Set<string>();
  return asArray(payload.blogPosts)
    .filter((p) => (p?.locale ?? 'ng') === locale || (p?.locale ?? 'ng') === 'global')
    .map(
      (p): BlogPost => {
        const rawContent = sanitizeNyScReferences(String(p.content ?? ''));
        const rawImageId = String(p.imageId ?? p.image_id ?? '');
        const extractedUrl = extractFirstImageUrl(rawContent);
        const imageUrl =
          firstValidImageUrl(
            p.imageUrl,
            p.image_url,
            rawImageId.startsWith('http') ? rawImageId : null,
            extractedUrl
          ) ?? null;

        const fallbackImageId = guessBlogImageId(String(p.title ?? ''), rawContent);
        const imageId =
          (rawImageId.startsWith('http') ? '' : rawImageId) ||
          (!imageUrl ? fallbackImageId : '') ||
          fallbackImageId;

        const resolvedForContent = imageUrl ?? resolvePlaceholderImageUrl(imageId);
        const content = rewriteWpHtmlImages(rawContent, resolvedForContent);

        return {
          id: String(p.id ?? p.slug ?? p.title ?? ''),
          slug: String(p.slug ?? ''),
          title: String(p.title ?? ''),
          content,
          author: String(p.author ?? 'Admin'),
          authorId: String(p.authorId ?? p.author_id ?? ''),
          createdAt: String(p.createdAt ?? p.created_at ?? new Date().toISOString()),
          imageId,
          imageUrl,
          locale: ((p.locale ?? locale) as BlogPost['locale']) || locale,
        };
      }
    )
    .filter((p) => p.slug && p.title)
    .filter((p) => {
      if (seenSlugs.has(p.slug)) return false;
      seenSlugs.add(p.slug);
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getStaticBlogPostBySlug(locale: BlogPost['locale'], slug: string): BlogPost | null {
  return getStaticBlogPosts(locale).find((p) => p.slug === slug) ?? null;
}

export function getStaticNews(locale: NewsArticle['locale']): NewsArticle[] {
  return asArray(payload.newsArticles)
    .filter((n) => (n?.locale ?? 'ng') === locale || (n?.locale ?? 'ng') === 'global')
    .map(
      (n): NewsArticle => ({
        id: String(n.id ?? n.link ?? n.title ?? ''),
        title: String(n.title ?? ''),
        source: String(n.source ?? ''),
        publishedDate: String(n.publishedDate ?? n.published_date ?? new Date().toISOString()),
        summary: String(n.summary ?? ''),
        imageId: String(n.imageId ?? n.image_id ?? ''),
        imageUrl: firstValidImageUrl(n.imageUrl, n.image_url, extractFirstImageUrl(String(n.summary ?? ''))) ?? null,
        link: String(n.link ?? ''),
        category: (n.category ?? 'Sustainability') as NewsArticle['category'],
        locale: ((n.locale ?? locale) as NewsArticle['locale']) || locale,
      })
    )
    .filter((n) => n.link && n.title)
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

export function getStaticAnnouncements(locale: Announcement['locale']): Announcement[] {
  return asArray(payload.announcements)
    .filter((a) => (a?.locale ?? 'ng') === locale || (a?.locale ?? 'ng') === 'global')
    .map(
      (a): Announcement => ({
        id: String(a.id ?? a.title ?? ''),
        title: String(a.title ?? ''),
        content: String(a.content ?? ''),
        locale: ((a.locale ?? locale) as Announcement['locale']) || locale,
        createdAt: String(a.createdAt ?? a.created_at ?? new Date().toISOString()),
      })
    )
    .filter((a) => a.title && a.content)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
