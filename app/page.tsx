"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
        displayName: ""
    })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register"
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                router.push("/dashboard")
            } else {
                // Show detailed error message
                const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error
                alert(errorMsg || "Ocorreu um erro")
                console.error("API Error:", data)
            }
        } catch (error) {
            console.error("Request error:", error)
            alert("Erro ao processar requisição")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 gradient-primary animate-gradient opacity-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />

            <Card className="w-full max-w-md relative z-10 glass-effect border-white/20">
                <CardHeader className="space-y-3 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        ExclusiveLink
                    </CardTitle>
                    <CardDescription className="text-base">
                        {isLogin
                            ? "Entre na sua conta para gerenciar seus materiais exclusivos"
                            : "Crie sua conta e comece a compartilhar conteúdo exclusivo"}
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {!isLogin && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Nome de usuário</Label>
                                    <Input
                                        id="username"
                                        placeholder="seuusuario"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Nome de exibição</Label>
                                    <Input
                                        id="displayName"
                                        placeholder="Seu Nome"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        required={!isLogin}
                                    />
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full gradient-primary border-0 text-white font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? "Processando..." : (isLogin ? "Entrar" : "Cadastrar-se")}
                        </Button>

                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            {isLogin
                                ? "Não tem uma conta? Cadastre-se"
                                : "Já tem uma conta? Entre"}
                        </button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
