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

        const automation = await prisma.automation.findUnique({
            where: {
                id: params.id,
            },
            include: {
                integration: true
            }
        })

        if (!automation) {
            return NextResponse.json({ error: "Automação não encontrada" }, { status: 404 })
        }

        if (automation.integration.userId !== user.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
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
        const { name, trigger, flowData } = body

        if (!name || !trigger || !flowData) {
            return NextResponse.json(
                { error: "Nome, gatilho e fluxo são obrigatórios" },
                { status: 400 }
            )
        }

        const automation = await prisma.automation.findUnique({
            where: { id: params.id },
            include: { integration: true }
        })

        if (!automation || automation.integration.userId !== user.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
        }

        const updatedAutomation = await prisma.automation.update({
            where: { id: params.id },
            data: {
                name,
                trigger,
                flowData
            }
        })

        return NextResponse.json({ automation: updatedAutomation })
    } catch (error) {
        console.error("Error updating automation:", error)
        return NextResponse.json({ error: "Erro ao atualizar automação" }, { status: 500 })
    }
}
