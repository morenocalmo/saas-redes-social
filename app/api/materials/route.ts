import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const materials = await prisma.material.findMany({
            where: { creatorId: user.id },
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { accessRequests: true }
                }
            }
        })

        return NextResponse.json({ materials })
    } catch (error) {
        console.error("Error fetching materials:", error)
        return NextResponse.json({ error: "Erro ao buscar materiais" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, fileUrl, fileType, secretCode } = body

        if (!title || !fileUrl || !secretCode) {
            return NextResponse.json(
                { error: "Título, arquivo e código secreto são obrigatórios" },
                { status: 400 }
            )
        }

        const material = await prisma.material.create({
            data: {
                creatorId: user.id,
                title,
                description,
                fileUrl,
                fileType,
                secretCode: secretCode.toUpperCase(),
                isActive: true,
            },
        })

        return NextResponse.json({ material }, { status: 201 })
    } catch (error) {
        console.error("Error creating material:", error)
        return NextResponse.json({ error: "Erro ao criar material" }, { status: 500 })
    }
}
