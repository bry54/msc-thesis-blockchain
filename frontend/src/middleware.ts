import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  const { cookies } = request;

  // Check if the Auth cookie is present
  const authCookie = cookies.get('Auth');

  if (!authCookie) {
    // Redirect to the login page if the Auth cookie is missing
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If the Auth cookie is present, continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*'
  ],
}