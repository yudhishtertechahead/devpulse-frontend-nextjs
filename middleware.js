import { NextResponse } from 'next/server';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/contact',
];

const AUTH_ONLY_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hasRefreshCookie = request.cookies.has(REFRESH_TOKEN_COOKIE);

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const isAuthOnlyPath = AUTH_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isPublicPath && !hasRefreshCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthOnlyPath && hasRefreshCookie) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = '/';
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.svg|icons.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
