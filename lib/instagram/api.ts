/**
 * Instagram Graph API Client
 */

interface InstagramUser {
    id: string
    username: string
    account_type?: string
    media_count?: number
}

interface InstagramPermissions {
    data: Array<{
        permission: string
        status: string
    }>
}

/**
 * Get Instagram user information
 * @param accessToken - Instagram access token
 * @returns User profile data
 */
export async function getInstagramUser(accessToken: string): Promise<InstagramUser> {
    const fields = 'id,username,account_type,media_count'
    const response = await fetch(
        `https://graph.instagram.com/me?fields=${fields}&access_token=${accessToken}`
    )

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to get Instagram user: ${error}`)
    }

    return response.json()
}

/**
 * Get user's granted permissions
 * @param userId - Instagram user ID
 * @param accessToken - Access token
 * @returns List of permissions and their status
 */
export async function getUserPermissions(
    userId: string,
    accessToken: string
): Promise<InstagramPermissions> {
    const response = await fetch(
        `https://graph.instagram.com/${userId}/permissions?access_token=${accessToken}`
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
    ]

    const granted = permissions.data
        .filter(p => p.status === 'granted')
        .map(p => p.permission)

    return required.every(perm => granted.includes(perm))
}

/**
 * Get user's recent media
 * @param accessToken - Access token
 * @param limit - Number of media items to fetch
 * @returns List of media items
 */
export async function getUserMedia(accessToken: string, limit: number = 10) {
    const fields = 'id,caption,media_type,media_url,permalink,timestamp'
    const response = await fetch(
        `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
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
        `https://graph.instagram.com/${commentId}/replies`,
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
