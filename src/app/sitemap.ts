import type { MetadataRoute } from 'next';

import { getStaticBlogPosts, getStaticPrograms } from '@/lib/content/static';
import { NG_NEWS_POSTS } from '@/content/news';
import { getSiteUrl } from '@/lib/seo/site';

function asUrl(siteUrl: string, path: string): string {
  if (!path.startsWith('/')) return `${siteUrl}/${path}`;
  return `${siteUrl}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticPaths: Array<{ path: string; priority?: number; changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'] }> =
    [
      { path: '/ng', priority: 1, changeFrequency: 'weekly' },
      { path: '/ca', priority: 1, changeFrequency: 'weekly' },
      { path: '/ng/about', priority: 0.8, changeFrequency: 'monthly' },
      { path: '/ng/people', priority: 0.6, changeFrequency: 'monthly' },
      { path: '/ng/programs', priority: 0.8, changeFrequency: 'weekly' },
      { path: '/ng/projects', priority: 0.7, changeFrequency: 'monthly' },
      { path: '/ng/grants', priority: 0.7, changeFrequency: 'weekly' },
      { path: '/ng/volunteer', priority: 0.6, changeFrequency: 'monthly' },
      { path: '/ng/appointment', priority: 0.6, changeFrequency: 'monthly' },
      { path: '/ng/donate', priority: 0.7, changeFrequency: 'monthly' },
      { path: '/ng/news', priority: 0.8, changeFrequency: 'weekly' },
      { path: '/ng/blog', priority: 0.7, changeFrequency: 'weekly' },
      { path: '/ng/careers', priority: 0.6, changeFrequency: 'weekly' },
      { path: '/ca/volunteer', priority: 0.6, changeFrequency: 'monthly' },
      { path: '/ca/appointment', priority: 0.6, changeFrequency: 'monthly' },
      { path: '/ca/donate', priority: 0.7, changeFrequency: 'monthly' },
      { path: '/ca/careers', priority: 0.6, changeFrequency: 'weekly' },
      { path: '/ca/news', priority: 0.7, changeFrequency: 'weekly' },
      { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
      { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' },
    ];

  const items: MetadataRoute.Sitemap = staticPaths.map(({ path, priority, changeFrequency }) => ({
    url: asUrl(siteUrl, path),
    lastModified: now,
    changeFrequency,
    priority,
  }));

  for (const post of getStaticBlogPosts('ng')) {
    items.push({
      url: asUrl(siteUrl, `/ng/blog/${post.slug}`),
      lastModified: new Date(post.createdAt),
      changeFrequency: 'monthly',
      priority: 0.55,
    });
  }

  for (const program of getStaticPrograms('ng')) {
    items.push({
      url: asUrl(siteUrl, `/ng/programs/${program.id}`),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  for (const post of NG_NEWS_POSTS) {
    items.push({
      url: asUrl(siteUrl, `/ng/news/${post.slug}`),
      lastModified: new Date(post.publishedDate),
      changeFrequency: 'yearly',
      priority: 0.45,
    });
  }

  return items;
}

