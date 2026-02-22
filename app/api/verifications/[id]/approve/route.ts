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
                    select: { creatorId: true, downloadCount: true }
                }
            }
        })

        if (!accessRequest || accessRequest.material.creatorId !== user.id) {
            return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 })
        }

        // Update request status and increment download count
        await prisma.$transaction([
            prisma.accessRequest.update({
                where: { id: requestId },
                data: {
                    status: "APPROVED",
                    reviewedAt: new Date()
                }
            }),
            prisma.material.update({
                where: { id: accessRequest.materialId },
                data: {
                    downloadCount: { increment: 1 }
                }
            })
        ])

        // TODO: Send email notification to follower with download link

        return NextResponse.redirect(new URL("/verifications", request.url))
    } catch (error) {
        console.error("Error approving request:", error)
        return NextResponse.json({ error: "Erro ao aprovar solicitação" }, { status: 500 })
    }
}
