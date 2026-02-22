import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    try {
        const userId = request.cookies.get('user_id')?.value
        const { pathname } = request.nextUrl

        // Protected routes that require authentication
        const protectedRoutes = ['/dashboard', '/materials', '/verifications', '/automation', '/settings', '/subscription']
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

        // Redirect to login if accessing protected route without auth
        if (isProtectedRoute && !userId) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // Redirect to dashboard if accessing login page while authenticated
        if (pathname === '/' && userId) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        return NextResponse.next()
    } catch {
        // If middleware fails, allow the request through
        return NextResponse.next()
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|u/).*)'],
}
