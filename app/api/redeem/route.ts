import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { materialId, followerName, followerEmail, secretCode, screenshotUrl } = body

        if (!materialId || !followerEmail || !secretCode || !screenshotUrl) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios" },
                { status: 400 }
            )
        }

        // Verify material exists and is active
        const material = await prisma.material.findUnique({
            where: { id: materialId }
        })

        if (!material || !material.isActive) {
            return NextResponse.json(
                { error: "Material não encontrado ou inativo" },
                { status: 404 }
            )
        }

        // Validate secret code
        const isCodeCorrect = secretCode.toUpperCase() === material.secretCode.toUpperCase()

        if (!isCodeCorrect) {
            return NextResponse.json(
                {
                    error: "Código secreto incorreto",
                    message: "O código que você digitou não corresponde ao código mencionado no vídeo. Por favor, verifique e tente novamente."
                },
                { status: 400 }
            )
        }

        // Create access request
        const accessRequest = await prisma.accessRequest.create({
            data: {
                materialId,
                followerName,
                followerEmail,
                secretCodeAttempt: secretCode.toUpperCase(),
                screenshotUrl,
                status: "PENDING"
            }
        })

        return NextResponse.json(
            {
                message: "Solicitação enviada com sucesso! Aguarde a aprovação do criador.",
                requestId: accessRequest.id
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error creating access request:", error)
        return NextResponse.json(
            { error: "Erro ao enviar solicitação" },
            { status: 500 }
        )
    }
}
