import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const pathname = request.nextUrl.pathname
  
  // Manage route protection
  const isAuth = await getToken({ req: request })
  const isAuthPage = pathname.startsWith('/auth')
  const isApiRoute = pathname.startsWith('/api')
  
  // Check for static files and public assets
  const isStaticFile = 
    pathname.startsWith('/_next') || 
    pathname.endsWith('.svg') || 
    pathname.endsWith('.png') || 
    pathname.endsWith('.jpg') || 
    pathname.endsWith('.jpeg') || 
    pathname.endsWith('.ico') || 
    pathname.endsWith('.css') || 
    pathname.endsWith('.js')
  
  const isPublicRoute = pathname === '/' || isApiRoute || isStaticFile

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/dashboards', request.url))
  }

  // Redirect unauthenticated users to login if trying to access protected routes
  if (!isPublicRoute && !isAuthPage && !isAuth) {
    const url = new URL('/auth/signin', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
} 