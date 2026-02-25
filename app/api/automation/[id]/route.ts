import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const automation = await prisma.automation.findFirst({
            where: {
                id: params.id,
                userId: user.id
            }
        })

        if (!automation) {
            return NextResponse.json({ error: "Automação não encontrada" }, { status: 404 })
        }

        return NextResponse.json({ automation })
    } catch (error) {
        console.error("Error fetching automation:", error)
        return NextResponse.json({ error: "Erro ao buscar automação" }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        const body = await request.json()
        const { name, trigger, flowData, isActive } = body

        // Verify ownership
        const existingAutomation = await prisma.automation.findFirst({
            where: {
                id: params.id,
                userId: user.id
            }
        })

        if (!existingAutomation) {
            return NextResponse.json({ error: "Automação não encontrada" }, { status: 404 })
        }

        // Update automation
        const automation = await prisma.automation.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(trigger && { trigger }),
                ...(flowData && { flowData }),
                ...(isActive !== undefined && { isActive })
            }
        })

        return NextResponse.json({ automation })
    } catch (error) {
        console.error("Error updating automation:", error)
        return NextResponse.json({ error: "Erro ao atualizar automação" }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        // Verify ownership
        const existingAutomation = await prisma.automation.findFirst({
            where: {
                id: params.id,
                userId: user.id
            }
        })

        if (!existingAutomation) {
            return NextResponse.json({ error: "Automação não encontrada" }, { status: 404 })
        }

        // Delete automation
        await prisma.automation.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting automation:", error)
        return NextResponse.json({ error: "Erro ao deletar automação" }, { status: 500 })
    }
}
