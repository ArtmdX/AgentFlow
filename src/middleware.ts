/**
 * Middleware de Autenticação
 *
 * Verifica se o usuário está autenticado antes de acessar rotas protegidas.
 *
 * NOTA: Verificação de permissões por role é feita nas API routes usando:
 * - getAuthSession() para autenticação
 * - hasPermission() para verificação de permissões
 * - Veja: src/lib/authorization.ts e src/lib/permissions.ts
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get('__Secure-next-auth.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/login');

  // Redirecionar para login se não autenticado
  if (!token && !isAuthPage) {
    console.log('User is not authenticated, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirecionar para dashboard se já autenticado e tentando acessar login
  if (token && isAuthPage) {
    console.log('User is authenticated, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/login', '/dashboard/:path*', '/customers/:path*', '/travels/:path*']
};
