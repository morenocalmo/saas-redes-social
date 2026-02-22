/**
 * Instagram OAuth Configuration and Helpers
 */

interface TokenResponse {
    access_token: string
    user_id: number
    permissions?: string[]
}

interface LongLivedTokenResponse {
    access_token: string
    token_type: string
    expires_in: number
}

/**
 * Get Instagram OAuth authorization URL
 * @returns URL to redirect user for authorization
 */
export function getAuthUrl(): string {
    const appId = process.env.INSTAGRAM_APP_ID
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI

    if (!appId || !redirectUri) {
        throw new Error('Instagram OAuth credentials not configured')
    }

    const params = new URLSearchParams({
        client_id: appId,
        redirect_uri: redirectUri,
        scope: 'instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list',
        response_type: 'code',
    })

    // Use Facebook Login for Business endpoint (Meta deprecated api.instagram.com/oauth/authorize)
    return `https://www.facebook.com/dialog/oauth?${params.toString()}`
}

/**
 * Exchange authorization code for access token
 * @param code - Authorization code from OAuth callback
 * @returns Token data including access_token and user_id
 */
export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const appId = process.env.INSTAGRAM_APP_ID
    const appSecret = process.env.INSTAGRAM_APP_SECRET
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI

    if (!appId || !appSecret || !redirectUri) {
        throw new Error('Instagram OAuth credentials not configured')
    }

    const response = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: appId,
            client_secret: appSecret,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code,
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to exchange code for token: ${error}`)
    }

    return response.json()
}

/**
 * Exchange short-lived token for long-lived token (60 days)
 * @param shortLivedToken - Short-lived access token
 * @returns Long-lived token data
 */
export async function getLongLivedToken(shortLivedToken: string): Promise<LongLivedTokenResponse> {
    const appSecret = process.env.INSTAGRAM_APP_SECRET

    if (!appSecret) {
        throw new Error('Instagram app secret not configured')
    }

    const params = new URLSearchParams({
        grant_type: 'ig_exchange_token',
        client_secret: appSecret,
        access_token: shortLivedToken,
    })

    const response = await fetch(`https://graph.instagram.com/access_token?${params.toString()}`)

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to get long-lived token: ${error}`)
    }

    return response.json()
}

/**
 * Refresh long-lived token (extends expiration)
 * @param longLivedToken - Current long-lived token
 * @returns Refreshed token data
 */
export async function refreshLongLivedToken(longLivedToken: string): Promise<LongLivedTokenResponse> {
    const params = new URLSearchParams({
        grant_type: 'ig_refresh_token',
        access_token: longLivedToken,
    })

    const response = await fetch(`https://graph.instagram.com/refresh_access_token?${params.toString()}`)

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to refresh token: ${error}`)
    }

    return response.json()
}
