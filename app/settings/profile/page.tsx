"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, ArrowLeft } from "lucide-react"

export default function ProfileSettingsPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        displayName: "",
        bio: "",
        youtubeChannelId: "",
        tiktokUsername: "",
        instagramUsername: "",
    })

    // Load user data on mount
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const response = await fetch("/api/profile")
                if (response.ok) {
                    const data = await response.json()
                    setFormData({
                        displayName: data.displayName || "",
                        bio: data.bio || "",
                        youtubeChannelId: data.youtubeChannelId || "",
                        tiktokUsername: data.tiktokUsername || "",
                        instagramUsername: data.instagramUsername || "",
                    })
                }
            } catch (error) {
                console.error("Error loading profile:", error)
            }
        }
        loadUserData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                alert("Perfil atualizado com sucesso!")
                router.refresh()
            } else {
                const data = await response.json()
                alert(data.error || "Erro ao atualizar perfil")
            }
        } catch (error) {
            alert("Erro ao processar requisição")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background p-6 lg:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Back Button */}
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar ao Painel
                    </Button>
                </Link>

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configurações de Perfil</h1>
                    <p className="text-muted-foreground mt-2">
                        Personalize sua página pública e adicione seus links de redes sociais
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card className="glass-effect border-white/20">
                        <CardHeader>
                            <CardTitle>Informações Públicas</CardTitle>
                            <CardDescription>
                                Essas informações serão exibidas na sua página pública
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Display Name */}
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Nome de Exibição</Label>
                                <Input
                                    id="displayName"
                                    placeholder="Seu Nome ou Nome do Canal"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                />
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <Label htmlFor="bio">Biografia</Label>
                                <textarea
                                    id="bio"
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Conte um pouco sobre você e seu conteúdo..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            {/* YouTube */}
                            <div className="space-y-2">
                                <Label htmlFor="youtube">ID do Canal do YouTube</Label>
                                <Input
                                    id="youtube"
                                    placeholder="UCxxxxxxxxxxxxxxxxxx"
                                    value={formData.youtubeChannelId}
                                    onChange={(e) => setFormData({ ...formData, youtubeChannelId: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Encontre o ID do seu canal na URL: youtube.com/channel/[ID]
                                </p>
                            </div>

                            {/* TikTok */}
                            <div className="space-y-2">
                                <Label htmlFor="tiktok">Usuário do TikTok</Label>
                                <Input
                                    id="tiktok"
                                    placeholder="@seuusuario"
                                    value={formData.tiktokUsername}
                                    onChange={(e) => setFormData({ ...formData, tiktokUsername: e.target.value.replace("@", "") })}
                                />
                            </div>

                            {/* Instagram */}
                            <div className="space-y-2">
                                <Label htmlFor="instagram">Usuário do Instagram</Label>
                                <Input
                                    id="instagram"
                                    placeholder="@seuusuario"
                                    value={formData.instagramUsername}
                                    onChange={(e) => setFormData({ ...formData, instagramUsername: e.target.value.replace("@", "") })}
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full gradient-primary border-0 text-white font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    "Salvando..."
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Alterações
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
