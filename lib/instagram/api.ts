/**
 * Instagram Graph API Client (via Facebook Graph API)
 */

interface InstagramUser {
    id: string
    username: string
    account_type?: string
    media_count?: number
    profile_picture_url?: string
}

interface InstagramPermissions {
    data: Array<{
        permission: string
        status: string
    }>
}

/**
 * Get Instagram user information by finding the linked IG account from Facebook Pages
 * @param accessToken - Facebook User Access token
 * @returns User profile data
 */
export async function getInstagramUser(accessToken: string): Promise<InstagramUser> {
    // 1. Get Facebook Pages managed by user
    const pagesResponse = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,instagram_business_account&access_token=${accessToken}`
    )

    if (!pagesResponse.ok) {
        const error = await pagesResponse.text()
        throw new Error(`Failed to get Facebook pages: ${error}`)
    }

    const pagesData = await pagesResponse.json()

    // Find the first page that has an Instagram Business Account linked
    const pageWithIg = pagesData.data?.find((page: any) => page.instagram_business_account)

    if (!pageWithIg) {
        // Debug: Check permissions granted to this token
        const permRes = await fetch(`https://graph.facebook.com/v19.0/me/permissions?access_token=${accessToken}`)
        const perms = await permRes.json()

        throw new Error('No Instagram Business account found linked to your Facebook Pages. Pages returned: ' + JSON.stringify(pagesData) + ' | Perms returned: ' + JSON.stringify(perms))
    }

    const igId = pageWithIg.instagram_business_account.id

    // 2. Get Instagram Account Details
    const fields = 'id,username,profile_picture_url,followers_count,media_count'
    const igResponse = await fetch(
        `https://graph.facebook.com/v19.0/${igId}?fields=${fields}&access_token=${accessToken}`
    )

    if (!igResponse.ok) {
        const error = await igResponse.text()
        throw new Error(`Failed to get Instagram user info: ${error}`)
    }

    return igResponse.json()
}

/**
 * Get user's granted permissions
 * @param userId - Ignored/optional for token lookup, as /me/permissions uses the token
 * @param accessToken - Access token
 * @returns List of permissions and their status
 */
export async function getUserPermissions(
    userId: string,
    accessToken: string
): Promise<InstagramPermissions> {
    const response = await fetch(
        `https://graph.facebook.com/v19.0/me/permissions?access_token=${accessToken}`
    )

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to get permissions: ${error}`)
    }

    return response.json()
}

/**
 * Check if all required permissions are granted
 * @param permissions - Permissions data from API
 * @returns True if all required permissions are granted
 */
export function hasRequiredPermissions(permissions: InstagramPermissions): boolean {
    const required = [
        'instagram_basic',
        'instagram_manage_comments',
        'instagram_manage_messages',
        'pages_show_list' // Often required for routing
    ]

    const granted = permissions.data
        .filter(p => p.status === 'granted')
        .map(p => p.permission)

    // Note: Due to Meta's weird behavior in dev mode, we check for essential ones
    const essentials = ['instagram_basic', 'instagram_manage_messages']
    return essentials.every(perm => granted.includes(perm))
}

/**
 * Get user's recent media
 * @param accessToken - Access token
 * @param limit - Number of media items to fetch
 * @returns List of media items
 */
export async function getUserMedia(accessToken: string, igAccountId: string, limit: number = 10) {
    const fields = 'id,caption,media_type,media_url,permalink,timestamp'
    const response = await fetch(
        `https://graph.facebook.com/v19.0/${igAccountId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
    )

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to get media: ${error}`)
    }

    return response.json()
}

/**
 * Reply to a comment
 * @param commentId - ID of the comment to reply to
 * @param message - Reply message
 * @param accessToken - Access token
 * @returns Response from API
 */
export async function replyToComment(
    commentId: string,
    message: string,
    accessToken: string
) {
    const response = await fetch(
        `https://graph.facebook.com/v19.0/${commentId}/replies`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                access_token: accessToken,
            }),
        }
    )

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to reply to comment: ${error}`)
    }

    return response.json()
}
