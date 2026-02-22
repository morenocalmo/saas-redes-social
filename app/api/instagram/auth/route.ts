import { NextRequest, NextResponse } from 'next/server'
import { getAuthUrl } from '@/lib/instagram/oauth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

/**
 * Initiate Instagram OAuth flow
 * Redirects user to Instagram authorization page
 */
export async function GET(request: NextRequest) {
    try {
        // Check if user is authenticated via session cookie
        const cookieStore = cookies()
        const userIdCookie = cookieStore.get('user_id')

        if (!userIdCookie) {
            // Redirect to login page
            return NextResponse.redirect(new URL('/', request.url))
        }

        // Get Instagram OAuth URL
        const authUrl = getAuthUrl()

        // Redirect to Instagram
        return NextResponse.redirect(authUrl)
    } catch (error) {
        console.error('Instagram auth error:', error)
        return NextResponse.redirect(
            new URL('/automation/integration?error=auth_failed', request.url)
        )
    }
}
