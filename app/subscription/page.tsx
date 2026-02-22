import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Check } from "lucide-react"

export default async function SubscriptionPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/")
    }

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Assinatura</h1>
                    <p className="text-muted-foreground mt-2">
                        Gerencie sua assinatura do ExclusiveLink
                    </p>
                </div>

                {/* Current Status */}
                <Card className="glass-effect border-white/20">
                    <CardHeader>
                        <CardTitle>Status Atual</CardTitle>
                        <CardDescription>
                            Informações sobre sua assinatura
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                            <div>
                                <p className="font-semibold capitalize">{user.subscriptionStatus.toLowerCase()}</p>
                                {user.subscriptionExpiresAt && (
                                    <p className="text-sm text-muted-foreground">
                                        Expira em: {new Date(user.subscriptionExpiresAt).toLocaleDateString("pt-BR")}
                                    </p>
                                )}
                            </div>
                            {user.subscriptionStatus === "ACTIVE" && (
                                <div className="flex items-center gap-2 text-green-500">
                                    <Check className="h-5 w-5" />
                                    <span className="font-medium">Ativa</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing */}
                <Card className="glass-effect border-primary/20">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Plano Criador</CardTitle>
                        <CardDescription>
                            Acesso completo a todas as funcionalidades
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                R$ 49,00
                            </div>
                            <p className="text-muted-foreground mt-1">por mês</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>Materiais ilimitados</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>Verificação de acessos</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>Página pública personalizada</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>Suporte prioritário</span>
                            </div>
                        </div>

                        {user.subscriptionStatus !== "ACTIVE" && (
                            <Button className="w-full gradient-primary border-0 text-white font-semibold">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Assinar Agora
                            </Button>
                        )}

                        <p className="text-xs text-center text-muted-foreground">
                            Pagamento via Stripe • Aceita cartão de crédito e PIX
                        </p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
