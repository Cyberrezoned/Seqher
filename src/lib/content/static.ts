import type { Announcement, BlogPost, NewsArticle, Program } from '@/lib/types';
import raw from '@/content/wordpress-export.json';
import { extractFirstImageUrl } from '@/lib/content/wp';

type ExportPayload = {
  images?: unknown[];
  programs?: unknown[];
  blogPosts?: unknown[];
  newsArticles?: unknown[];
  announcements?: unknown[];
};

const payload = raw as ExportPayload;

function asArray(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

export function getStaticPrograms(locale: Program['locale']): Program[] {
  return asArray(payload.programs)
    .filter((p) => (p?.locale ?? 'ng') === locale || (p?.locale ?? 'ng') === 'global')
    .map(
      (p): Program => {
        const description = String(p.description ?? p.content ?? '');
        const imageUrl = (p.imageUrl ?? p.image_url ?? extractFirstImageUrl(description) ?? null) as string | null;
        return {
          id: String(p.id ?? p.slug ?? p.title ?? ''),
          title: String(p.title ?? ''),
          summary: String(p.summary ?? ''),
          description,
          imageId: String(p.imageId ?? p.image_id ?? ''),
          imageUrl,
          sdgGoals: Array.isArray(p.sdgGoals ?? p.sdg_goals) ? (p.sdgGoals ?? p.sdg_goals) : [],
          locale: ((p.locale ?? locale) as Program['locale']) || locale,
        };
      }
    )
    .filter((p) => p.id && p.title);
}

export function getStaticProgramById(locale: Program['locale'], id: string): Program | null {
  return getStaticPrograms(locale).find((p) => p.id === id) ?? null;
}

export function getStaticBlogPosts(locale: BlogPost['locale']): BlogPost[] {
  return asArray(payload.blogPosts)
    .filter((p) => (p?.locale ?? 'ng') === locale || (p?.locale ?? 'ng') === 'global')
    .map(
      (p): BlogPost => {
        const content = String(p.content ?? '');
        const imageUrl = (p.imageUrl ?? p.image_url ?? extractFirstImageUrl(content) ?? null) as string | null;
        return {
          id: String(p.id ?? p.slug ?? p.title ?? ''),
          slug: String(p.slug ?? ''),
          title: String(p.title ?? ''),
          content,
          author: String(p.author ?? 'Admin'),
          authorId: String(p.authorId ?? p.author_id ?? ''),
          createdAt: String(p.createdAt ?? p.created_at ?? new Date().toISOString()),
          imageId: String(p.imageId ?? p.image_id ?? ''),
          imageUrl,
          locale: ((p.locale ?? locale) as BlogPost['locale']) || locale,
        };
      }
    )
    .filter((p) => p.slug && p.title)
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
        imageUrl: (n.imageUrl ?? n.image_url ?? extractFirstImageUrl(String(n.summary ?? '')) ?? null) as string | null,
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
