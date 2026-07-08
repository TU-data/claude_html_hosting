import { NextResponse } from 'next/server';
import { checkBasicAuth, unauthorizedResponse } from './lib/meta.js';

const PROTECTED_PAGE_PREFIXES = ['/upload', '/trash'];

function isProtected(pathname) {
  if (PROTECTED_PAGE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return true;
  }
  if (pathname.startsWith('/api/upload')) return true;
  if (pathname.startsWith('/api/trash/')) return true;
  if (/^\/api\/reports\/[^/]+\/delete$/.test(pathname)) return true;
  return false;
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (isProtected(pathname) && !checkBasicAuth(request)) {
    return unauthorizedResponse();
  }

  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
