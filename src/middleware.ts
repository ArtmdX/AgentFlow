// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token')?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/login');

  if (!token && !isAuthPage) {
    console.log('User is not authenticated, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && isAuthPage) {
    console.log('User is authenticated, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/login', '/dashboard/:path*', '/customers/:path*', '/travels/:path*']
};
