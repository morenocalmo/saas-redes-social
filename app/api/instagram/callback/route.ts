import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { exchangeCodeForToken, getLongLivedToken } from '@/lib/instagram/oauth'
import { getInstagramUser } from '@/lib/instagram/api'
import { encrypt } from '@/lib/instagram/encryption'
import { prisma } from '@/lib/db'

/**
 * Handle Instagram OAuth callback
 * Exchanges authorization code for access token and saves to database
 */
export async function GET(request: NextRequest) {
    try {
        // Verify user is authenticated
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // Get authorization code from query params
        const code = request.nextUrl.searchParams.get('code')
        const error = request.nextUrl.searchParams.get('error')

        // Handle user denial
        if (error) {
            return NextResponse.redirect(
                new URL('/automation/integration?error=access_denied', request.url)
            )
        }

        if (!code) {
            return NextResponse.redirect(
                new URL('/automation/integration?error=no_code', request.url)
            )
        }

        // Exchange code for short-lived token
        const tokenData = await exchangeCodeForToken(code)

        // Exchange for long-lived token (60 days)
        const longLivedToken = await getLongLivedToken(tokenData.access_token)

        // Get Instagram user info
        const instagramUser = await getInstagramUser(longLivedToken.access_token)

        // Encrypt the access token
        const encryptedToken = encrypt(longLivedToken.access_token)

        // Calculate token expiration date
        const expiresAt = new Date()
        expiresAt.setSeconds(expiresAt.getSeconds() + longLivedToken.expires_in)

        // Save or update integration in database
        await prisma.instagramIntegration.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                instagramUserId: instagramUser.id,
                accessToken: encryptedToken,
                isActive: true,
            },
            update: {
                instagramUserId: instagramUser.id,
                accessToken: encryptedToken,
                isActive: true,
            },
        })

        // Redirect to integration page with success message
        return NextResponse.redirect(
            new URL('/automation/integration?success=true', request.url)
        )
    } catch (error: any) {
        console.error('Instagram OAuth callback error:', error)

        // Return error directly for debugging (TEMPORARY)
        return NextResponse.json({
            error: 'OAUTH_FAILED',
            message: error?.message || String(error),
            stack: error?.stack
        }, { status: 500 })
    }
}
