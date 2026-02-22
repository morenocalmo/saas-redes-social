import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: "E-mail e senha são obrigatórios" },
                { status: 400 }
            )
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json(
                { error: "Credenciais inválidas" },
                { status: 401 }
            )
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash)

        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Credenciais inválidas" },
                { status: 401 }
            )
        }

        // Create session (simple cookie-based auth for now)
        const cookieStore = await cookies()
        cookieStore.set("user_id", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/"
        })

        return NextResponse.json({
            message: "Login realizado com sucesso",
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                subscriptionStatus: user.subscriptionStatus
            }
        })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            { error: "Erro ao fazer login" },
            { status: 500 }
        )
    }
}
