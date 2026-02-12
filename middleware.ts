import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { updateSupabaseSession } from '@/lib/supabase/middleware';
import { isLanguage, LANGUAGE_COOKIE, type Language } from '@/lib/i18n/language';

const REGION_COOKIE = 'seqher_region';
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

type Region = 'ng' | 'ca';

function isRegion(value: unknown): value is Region {
  return value === 'ng' || value === 'ca';
}

function getCountryFromRequest(request: NextRequest): string | null {
  // `request.geo` exists in some runtimes (e.g. Vercel edge), but may be absent in others.
  const geoCountry = (request as NextRequest & { geo?: { country?: string } }).geo?.country;
  if (geoCountry) return geoCountry.toUpperCase();

  const vercelCountry = request.headers.get('x-vercel-ip-country');
  if (vercelCountry) return vercelCountry.toUpperCase();

  const cloudflareCountry = request.headers.get('cf-ipcountry');
  if (cloudflareCountry) return cloudflareCountry.toUpperCase();

  return null;
}

function detectRegion(request: NextRequest): Region {
  const country = getCountryFromRequest(request);
  if (country === 'CA') return 'ca';

  const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() ?? '';
  if (/\b(fr-ca|en-ca)\b/.test(acceptLanguage)) return 'ca';

  return 'ng';
}

function detectLanguage(request: NextRequest, region: Region): Language {
  const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() ?? '';
  if (region === 'ca' && /\bfr\b/.test(acceptLanguage)) return 'fr';
  return 'en';
}

function withRegionCookie(response: NextResponse, region: Region) {
  response.cookies.set(REGION_COOKIE, region, {
    path: '/',
    maxAge: ONE_YEAR_SECONDS,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}

function withLanguageCookie(response: NextResponse, language: Language) {
  response.cookies.set(LANGUAGE_COOKIE, language, {
    path: '/',
    maxAge: ONE_YEAR_SECONDS,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}

function withSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/admin')
  ) {
    return withSecurityHeaders(NextResponse.next());
  }

  const cookieRegionRaw = request.cookies.get(REGION_COOKIE)?.value;
  const cookieRegion = isRegion(cookieRegionRaw) ? cookieRegionRaw : null;

  const cookieLangRaw = request.cookies.get(LANGUAGE_COOKIE)?.value;
  const cookieLang = isLanguage(cookieLangRaw) ? cookieLangRaw : null;

  const isCanadaPath = pathname === '/ca' || pathname.startsWith('/ca/');
  const isNigeriaPath = pathname === '/ng' || pathname.startsWith('/ng/');

  if (pathname === '/') {
    const region = cookieRegion ?? detectRegion(request);
    const response = await updateSupabaseSession(request);
    if (!cookieRegion) withRegionCookie(response, region);
    if (!cookieLang) withLanguageCookie(response, detectLanguage(request, region));
    return withSecurityHeaders(response);
  }

  if (isCanadaPath) {
    if (!cookieRegion) {
      const response = await updateSupabaseSession(request);
      withRegionCookie(response, 'ca');
      if (!cookieLang) withLanguageCookie(response, detectLanguage(request, 'ca'));
      return withSecurityHeaders(response);
    }
    if (cookieRegion === 'ng') {
      const url = request.nextUrl.clone();
      if (pathname.startsWith('/ca/careers')) url.pathname = '/ng/careers';
      else if (pathname.startsWith('/ca/volunteer')) url.pathname = '/ng/volunteer';
      else if (pathname.startsWith('/ca/news')) url.pathname = '/ng/news';
      else if (pathname.startsWith('/ca/appointment')) url.pathname = '/ng/appointment';
      else if (pathname.startsWith('/ca/donate')) url.pathname = '/ng/donate';
      else if (pathname.startsWith('/ca/health-services')) url.pathname = '/ng/programs';
      else if (pathname.startsWith('/ca/safety-support')) url.pathname = '/ng/appointment';
      else if (pathname.startsWith('/ca/community')) url.pathname = '/ng/news';
      else url.pathname = '/ng';
      url.search = '';
      const redirect = NextResponse.redirect(url);
      if (!cookieLang) withLanguageCookie(redirect, detectLanguage(request, 'ng'));
      return withSecurityHeaders(redirect);
    }
    const response = await updateSupabaseSession(request);
    if (!cookieLang) withLanguageCookie(response, detectLanguage(request, 'ca'));
    return withSecurityHeaders(response);
  }

  if (isNigeriaPath) {
    if (!cookieRegion) {
      const response = await updateSupabaseSession(request);
      withRegionCookie(response, 'ng');
      if (!cookieLang) withLanguageCookie(response, detectLanguage(request, 'ng'));
      return withSecurityHeaders(response);
    }
    if (cookieRegion === 'ca') {
      const url = request.nextUrl.clone();
      if (pathname.startsWith('/ng/subscribe')) {
        const response = await updateSupabaseSession(request);
        if (!cookieLang) withLanguageCookie(response, detectLanguage(request, 'ng'));
        return withSecurityHeaders(response);
      }
      if (pathname.startsWith('/ng/careers')) url.pathname = '/ca/careers';
      else if (pathname.startsWith('/ng/volunteer')) url.pathname = '/ca/volunteer';
      else if (pathname.startsWith('/ng/news')) url.pathname = '/ca/news';
      else if (pathname.startsWith('/ng/appointment')) url.pathname = '/ca/appointment';
      else if (pathname.startsWith('/ng/donate')) url.pathname = '/ca/donate';
      else url.pathname = '/ca';
      url.search = '';
      const redirect = NextResponse.redirect(url);
      if (!cookieLang) withLanguageCookie(redirect, detectLanguage(request, 'ca'));
      return withSecurityHeaders(redirect);
    }
    const response = await updateSupabaseSession(request);
    if (!cookieLang) withLanguageCookie(response, detectLanguage(request, 'ng'));
    return withSecurityHeaders(response);
  }

  const response = await updateSupabaseSession(request);
  if (!cookieLang) {
    const region = cookieRegion ?? detectRegion(request);
    withLanguageCookie(response, detectLanguage(request, region));
  }

  return withSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Run on all routes except:
     * - Next.js internals
     * - static files (including images)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)',
  ],
};
