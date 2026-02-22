import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, username, displayName } = body

        // Validate required fields
        if (!email || !password || !username || !displayName) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios" },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "E-mail ou nome de usuário já cadastrado" },
                { status: 400 }
            )
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // Create user with trial subscription
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                username: username.toLowerCase(),
                displayName,
                subscriptionStatus: "TRIAL",
                subscriptionExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
            },
        })

        return NextResponse.json(
            {
                message: "Conta criada com sucesso!",
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    displayName: user.displayName
                }
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Registration error:", error)
        console.error("Error details:", JSON.stringify(error, null, 2))

        // Return more specific error message
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"

        return NextResponse.json(
            {
                error: "Erro ao criar conta",
                details: errorMessage
            },
            { status: 500 }
        )
    }
}
