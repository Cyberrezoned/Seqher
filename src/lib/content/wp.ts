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

export function extractFirstImageUrl(input: string): string | null {
  const html = stripWpBlockComments(input);
  const match = html.match(/<img[^>]+src=[\"']([^\"']+)[\"'][^>]*>/i);
  return match?.[1] ?? null;
}
