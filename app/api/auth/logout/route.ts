import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export async function POST() {
    const cookieStore = await cookies()
    cookieStore.delete("user_id")

    return NextResponse.json({ message: "Logout realizado com sucesso" })
}
