'use client';

import DOMPurify from 'dompurify';
import { isBlockedSeqherWpMediaUrl, stripWpBlockComments } from '@/lib/content/wp';

type Props = {
  html: string;
  className?: string;
};

export default function RichText({ html, className }: Props) {
  const withoutWp = stripWpBlockComments(html || '');
  const withSafeImageSrc = withoutWp.replace(
    /<img\b[^>]*\bsrc=(["'])([^"']+)\1[^>]*>/gi,
    (imgTag, _quote, src) => {
      if (isBlockedSeqherWpMediaUrl(String(src))) {
        return imgTag
          .replace(/src=(["'])([^"']+)\1/i, 'src="/images/placeholder-teal.svg"')
          .replace(/\s+srcset=(["'])[\s\S]*?\1/gi, '')
          .replace(/\s+sizes=(["'])[\s\S]*?\1/gi, '');
      }
      return imgTag;
    }
  );
  const cleaned = withSafeImageSrc
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
