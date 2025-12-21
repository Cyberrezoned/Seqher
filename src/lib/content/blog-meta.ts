import { htmlToText } from '@/lib/content/wp';

export function estimateReadingMinutes(html: string): number {
  const text = htmlToText(html);
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.ceil(words / 220);
  return Math.max(1, minutes);
}

export function getBlogCategoryLabel(imageId: string): string {
  switch (imageId) {
    case 'blog-hiv-health':
      return 'HIV & STI Care';
    case 'blog-trans-awareness':
      return 'Trans Awareness';
    case 'blog-human-rights':
      return 'Human Rights';
    case 'blog-mental-health':
      return 'Mental Health';
    case 'blog-emergency-response':
      return 'Emergency Response';
    case 'blog-capacity-building':
      return 'Capacity Building';
    case 'blog-careers':
      return 'Opportunities';
    case 'blog-health-equity':
      return 'Health Equity';
    case 'blog-vogue':
      return 'Culture';
    case 'blog-community':
    case 'blog-community-gardens':
    case 'blog-volunteer-story':
    default:
      return 'Community';
  }
}

