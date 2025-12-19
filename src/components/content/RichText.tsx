'use client';

import DOMPurify from 'dompurify';
import { stripWpBlockComments } from '@/lib/content/wp';

type Props = {
  html: string;
  className?: string;
};

export default function RichText({ html, className }: Props) {
  const withoutWp = stripWpBlockComments(html || '');
  const cleaned = withoutWp
    .replace(/<img\b(?![^>]*\bsrc=)[^>]*>/gi, '')
    .replace(/<img\b[^>]*\bsrc=(["'])\s*\1[^>]*>/gi, '');
  const safe = DOMPurify.sanitize(cleaned, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'script'],
    ADD_ATTR: ['target', 'rel'],
    ALLOWED_ATTR: [
      'href',
      'target',
      'rel',
      'src',
      'alt',
      'title',
      'width',
      'height',
      'loading',
      'decoding',
      'srcset',
      'sizes',
      'class',
    ],
  });

  return <div className={className} dangerouslySetInnerHTML={{ __html: safe }} />;
}
