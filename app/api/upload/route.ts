import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
        }

        // Obter credenciais do Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            console.error("Credenciais do Supabase ausentes no .env")
            return NextResponse.json({ error: "Configuração de storage ausente no servidor" }, { status: 500 })
        }

        // Converter arquivo
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Gerar nome único
        const timestamp = Date.now()
        const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

        // Fazer upload direto para o Supabase Storage via REST API (sem precisar do SDK)
        const bucketName = "materials"
        const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${filename}`

        const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${supabaseKey}`,
                "Content-Type": file.type || "application/octet-stream",
            },
            body: buffer
        })

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text()
            console.error("Erro no Supabase Storage:", uploadResponse.status, errorText)

            if (errorText.includes("Bucket not found") || errorText.includes("does not exist")) {
                return NextResponse.json({
                    error: "O bucket 'materials' não foi criado no Supabase. Crie-o primeiro no painel!"
                }, { status: 500 })
            }

            return NextResponse.json({ error: `Erro Supabase (${uploadResponse.status}): ${errorText}` }, { status: 500 })
        }

        // Retornar a URL pública do arquivo
        const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filename}`

        return NextResponse.json({ fileUrl })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Erro interno ao processar upload" }, { status: 500 })
    }
}
