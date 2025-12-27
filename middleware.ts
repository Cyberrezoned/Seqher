import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const REGION_COOKIE = 'seqher_region';
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

type Region = 'ng' | 'ca';

function isRegion(value: unknown): value is Region {
  return value === 'ng' || value === 'ca';
}

function withRegionCookie(response: NextResponse, region: Region) {
  response.cookies.set(REGION_COOKIE, region, {
    path: '/',
    maxAge: ONE_YEAR_SECONDS,
    sameSite: 'lax',
  });
  return response;
}

export function middleware(request: NextRequest) {
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
    return NextResponse.next();
  }

  const cookieRegionRaw = request.cookies.get(REGION_COOKIE)?.value;
  const cookieRegion = isRegion(cookieRegionRaw) ? cookieRegionRaw : null;

  const isCanadaPath = pathname === '/ca' || pathname.startsWith('/ca/');
  const isNigeriaPath = pathname === '/ng' || pathname.startsWith('/ng/');

  if (pathname === '/') {
    if (cookieRegion) {
      const url = request.nextUrl.clone();
      url.pathname = `/${cookieRegion}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isCanadaPath) {
    if (!cookieRegion) {
      return withRegionCookie(NextResponse.next(), 'ca');
    }
    if (cookieRegion === 'ng') {
      const url = request.nextUrl.clone();
      if (pathname.startsWith('/ca/careers')) url.pathname = '/ng/careers';
      else if (pathname.startsWith('/ca/volunteer')) url.pathname = '/ng/volunteer';
      else if (pathname.startsWith('/ca/news')) url.pathname = '/ng/news';
      else if (pathname.startsWith('/ca/appointment')) url.pathname = '/ng/appointment';
      else if (pathname.startsWith('/ca/donate')) url.pathname = '/ng/donate';
      else url.pathname = '/ng';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isNigeriaPath) {
    if (!cookieRegion) {
      return withRegionCookie(NextResponse.next(), 'ng');
    }
    if (cookieRegion === 'ca') {
      const url = request.nextUrl.clone();
      if (pathname.startsWith('/ng/careers')) url.pathname = '/ca/careers';
      else if (pathname.startsWith('/ng/volunteer')) url.pathname = '/ca/volunteer';
      else if (pathname.startsWith('/ng/news')) url.pathname = '/ca/news';
      else if (pathname.startsWith('/ng/appointment')) url.pathname = '/ca/appointment';
      else if (pathname.startsWith('/ng/donate')) url.pathname = '/ca/donate';
      else url.pathname = '/ca';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!cookieRegion) return NextResponse.next();

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*).*)'],
};
