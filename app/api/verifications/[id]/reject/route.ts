import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const requestId = params.id

        // Verify the request belongs to the user's material
        const accessRequest = await prisma.accessRequest.findUnique({
            where: { id: requestId },
            include: {
                material: {
                    select: { creatorId: true }
                }
            }
        })

        if (!accessRequest || accessRequest.material.creatorId !== user.id) {
            return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 })
        }

        // Update request status
        await prisma.accessRequest.update({
            where: { id: requestId },
            data: {
                status: "REJECTED",
                reviewedAt: new Date(),
                rejectionReason: "Código incorreto ou comprovante inválido"
            }
        })

        // TODO: Send email notification to follower

        return NextResponse.redirect(new URL("/verifications", request.url))
    } catch (error) {
        console.error("Error rejecting request:", error)
        return NextResponse.json({ error: "Erro ao rejeitar solicitação" }, { status: 500 })
    }
}
