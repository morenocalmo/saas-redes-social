"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"

interface MaterialRedemptionPageProps {
    params: {
        username: string
        id: string
    }
}

export default function MaterialRedemptionPage({ params }: MaterialRedemptionPageProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [screenshot, setScreenshot] = useState<File | null>(null)
    const [formData, setFormData] = useState({
        followerName: "",
        followerEmail: "",
        secretCode: "",
    })

    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshot(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!screenshot) {
            alert("Por favor, envie o comprovante de inscrição")
            return
        }

        setIsLoading(true)

        try {
            // Upload screenshot
            const fileFormData = new FormData()
            fileFormData.append("file", screenshot)

            const uploadResponse = await fetch("/api/upload", {
                method: "POST",
                body: fileFormData,
            })

            if (!uploadResponse.ok) {
                throw new Error("Erro ao fazer upload do comprovante")
            }

            const { fileUrl } = await uploadResponse.json()

            // Submit access request
            const response = await fetch("/api/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    materialId: params.id,
                    followerName: formData.followerName,
                    followerEmail: formData.followerEmail,
                    secretCode: formData.secretCode.toUpperCase(),
                    screenshotUrl: fileUrl,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setIsSubmitted(true)
            } else {
                // Show detailed error message
                const errorMessage = data.message || data.error || "Erro ao enviar solicitação"
                alert(errorMessage)
            }
        } catch (error) {
            alert("Erro ao processar requisição")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md glass-effect border-white/20">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Solicitação Enviada!</h3>
                        <p className="text-muted-foreground text-center mb-6">
                            Sua solicitação foi enviada para análise. Você receberá um e-mail com o link de download assim que for aprovada.
                        </p>
                        <Link href={`/u/${params.username}`}>
                            <Button variant="outline">
                                Voltar ao Perfil
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-6 lg:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <Link href={`/u/${params.username}`}>
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Resgatar Material</h1>
                    <p className="text-muted-foreground mt-2">
                        Preencha as informações abaixo para solicitar acesso ao material exclusivo
                    </p>
                </div>

                {/* Instructions */}
                <Card className="glass-effect border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Como Resgatar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>1. Inscreva-se no canal/perfil do criador</p>
                        <p>2. Tire um print/screenshot comprovando sua inscrição</p>
                        <p>3. Anote o código secreto mencionado no vídeo</p>
                        <p>4. Preencha o formulário abaixo e aguarde a aprovação</p>
                    </CardContent>
                </Card>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card className="glass-effect border-white/20">
                        <CardHeader>
                            <CardTitle>Informações de Resgate</CardTitle>
                            <CardDescription>
                                Todos os campos são obrigatórios
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Seu Nome</Label>
                                <Input
                                    id="name"
                                    placeholder="João Silva"
                                    value={formData.followerName}
                                    onChange={(e) => setFormData({ ...formData, followerName: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Seu E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={formData.followerEmail}
                                    onChange={(e) => setFormData({ ...formData, followerEmail: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Você receberá o link de download neste e-mail
                                </p>
                            </div>

                            {/* Secret Code */}
                            <div className="space-y-2">
                                <Label htmlFor="code">Código Secreto</Label>
                                <Input
                                    id="code"
                                    placeholder="Digite o código do vídeo"
                                    value={formData.secretCode}
                                    onChange={(e) => setFormData({ ...formData, secretCode: e.target.value.toUpperCase() })}
                                    required
                                />
                            </div>

                            {/* Screenshot Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="screenshot">Comprovante de Inscrição</Label>
                                <Input
                                    id="screenshot"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleScreenshotChange}
                                    required
                                />
                                {screenshot && (
                                    <p className="text-sm text-muted-foreground">
                                        Arquivo selecionado: {screenshot.name}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full gradient-primary border-0 text-white font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    "Enviando..."
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Solicitar Download
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    )
}
