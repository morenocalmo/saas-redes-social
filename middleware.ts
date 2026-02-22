import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Minimal passthrough - testing Edge Runtime compatibility
export function middleware(_request: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
