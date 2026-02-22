import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                displayName: true,
                bio: true,
                youtubeChannelId: true,
                tiktokUsername: true,
                instagramUsername: true,
            },
        })

        return NextResponse.json(userData)
    } catch (error) {
        console.error("Error fetching profile:", error)
        return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body = await request.json()
        const { displayName, bio, youtubeChannelId, tiktokUsername, instagramUsername } = body

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                displayName,
                bio,
                youtubeChannelId,
                tiktokUsername,
                instagramUsername,
            },
        })

        return NextResponse.json({ user: updatedUser })
    } catch (error) {
        console.error("Error updating profile:", error)
        return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 })
    }
}
