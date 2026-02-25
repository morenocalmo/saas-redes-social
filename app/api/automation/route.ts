import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

// Schema para validação dos dados de criação da automação linear
const createAutomationSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    trigger: z.string().min(1, "O gatilho é obrigatório"),
    isActive: z.boolean().default(true),
    flowData: z.object({
        type: z.literal("linear"),
        trigger: z.string(),
        keywords: z.array(z.string()),
        responseMessage: z.string(),
        responseLink: z.string().optional(),
        proFeatures: z.object({
            followUp: z.boolean().optional(),
            emailCapture: z.boolean().optional(),
        }).optional()
    })
})

export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user || !user.id) {
            return NextResponse.json(
                { error: "Não autorizado" },
                { status: 401 }
            )
        }

        const automations = await prisma.automation.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(automations)

    } catch (error) {
        console.error("Error fetching automations:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user || !user.id) {
            return NextResponse.json(
                { error: "Não autorizado" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const validatedData = createAutomationSchema.parse(body)

        // Criar a automação diretamente para o usuário
        const automation = await prisma.automation.create({
            data: {
                userId: user.id,
                name: validatedData.name,
                trigger: validatedData.trigger,
                isActive: validatedData.isActive,
                flowData: validatedData.flowData as any,
            }
        })

        return NextResponse.json(automation)

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Dados inválidos", details: error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        console.error("Error creating automation:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}
