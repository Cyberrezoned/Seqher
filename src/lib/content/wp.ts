export function stripWpBlockComments(input: string): string {
  if (!input) return '';
  return input.replace(/<!--\s*\/?wp:[\s\S]*?-->/g, '');
}

export function htmlToText(input: string): string {
  const html = stripWpBlockComments(input);
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function makeExcerpt(input: string, maxChars = 160): string {
  const text = htmlToText(input);
  if (text.length <= maxChars) return text;
  const sliced = text.slice(0, maxChars);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

export function sanitizeNyScReferences(input: string): string {
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

export function extractFirstImageUrl(input: string): string | null {
  const html = stripWpBlockComments(input);
  const match = html.match(/<img[^>]+src=[\"']([^\"']+)[\"'][^>]*>/i);
  return match?.[1] ?? null;
}

export function isBlockedSeqherWpMediaUrl(url: string): boolean {
  // Previously blocked WP media hotlinks. We now allow them so blog/program images
  // referenced from exports (SQL/WordPress) can render as real images.
  return false;
}
