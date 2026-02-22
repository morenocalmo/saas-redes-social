import { cookies } from "next/headers"
import { prisma } from "@/lib/db"

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies()
        const userId = cookieStore.get("user_id")?.value

        if (!userId) {
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                displayName: true,
                bio: true,
                avatarUrl: true,
                youtubeChannelId: true,
                tiktokUsername: true,
                instagramUsername: true,
                subscriptionStatus: true,
                subscriptionExpiresAt: true,
            }
        })

        return user
    } catch (error) {
        console.error("Error getting current user:", error)
        return null
    }
}
