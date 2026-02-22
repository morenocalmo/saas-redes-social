import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        // Get user's Instagram integration
        const integration = await prisma.instagramIntegration.findUnique({
            where: { userId: user.id },
            include: {
                automations: {
                    orderBy: { createdAt: "desc" }
                }
            }
        })

        if (!integration) {
            return NextResponse.json({ error: "Instagram não conectado" }, { status: 404 })
        }

        return NextResponse.json({ automations: integration.automations })
    } catch (error) {
        console.error("Error fetching automations:", error)
        return NextResponse.json({ error: "Erro ao buscar automações" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
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

        // Get user's Instagram integration
        const integration = await prisma.instagramIntegration.findUnique({
            where: { userId: user.id }
        })

        if (!integration) {
            return NextResponse.json(
                { error: "Você precisa conectar o Instagram primeiro" },
                { status: 404 }
            )
        }

        // Create automation
        const automation = await prisma.automation.create({
            data: {
                integrationId: integration.id,
                name,
                trigger,
                flowData,
                isActive: true
            }
        })

        return NextResponse.json({ automation }, { status: 201 })
    } catch (error) {
        console.error("Error creating automation:", error)
        return NextResponse.json({ error: "Erro ao criar automação" }, { status: 500 })
    }
}
