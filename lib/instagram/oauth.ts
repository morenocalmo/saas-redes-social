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
        scope: 'instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement,business_management',
        response_type: 'code',
    })

    // Use Facebook Login for Business endpoint
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

    const params = new URLSearchParams({
        client_id: appId,
        redirect_uri: redirectUri,
        client_secret: appSecret,
        code,
    })

    const response = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?${params.toString()}`, {
        method: 'GET',
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to exchange code for token: ${error}`)
    }

    // Graph API access token response does not return user_id, it returns { access_token, token_type, expires_in }
    const data = await response.json()
    return {
        ...data,
        user_id: 0, // Placeholder, actual ID is fetched later
    }
}

/**
 * Exchange short-lived token for long-lived token (60 days)
 * @param shortLivedToken - Short-lived access token
 * @returns Long-lived token data
 */
export async function getLongLivedToken(shortLivedToken: string): Promise<LongLivedTokenResponse> {
    const appId = process.env.INSTAGRAM_APP_ID
    const appSecret = process.env.INSTAGRAM_APP_SECRET

    if (!appId || !appSecret) {
        throw new Error('Instagram app credentials not configured')
    }

    const params = new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: shortLivedToken,
    })

    const response = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?${params.toString()}`)

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
        grant_type: 'fb_exchange_token',
        fb_exchange_token: longLivedToken,
    })

    // Note: Facebook user access tokens (which is what we get via FB Login) 
    // are typically not refreshed this way; they are normally renewed by sending the user through the login flow again.
    // However, if it's a page token, it doesn't expire as long as the user token is valid.
    const response = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?${params.toString()}`)

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to refresh token: ${error}`)
    }

    return response.json()
}
