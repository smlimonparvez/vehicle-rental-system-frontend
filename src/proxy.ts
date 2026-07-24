import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAdmin    = ['/admin'].some(r => pathname.startsWith(r));
  const isCustomer = ['/dashboard', '/my-bookings'].some(r => pathname.startsWith(r));
  const isAuth     = ['/login', '/register'].some(r => pathname.startsWith(r));

  if ((isAdmin || isCustomer) && !token)
    return NextResponse.redirect(new URL('/login', request.url));
  if (isAuth && token)
    return NextResponse.redirect(new URL('/dashboard', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/my-bookings/:path*', '/login', '/register'],
};