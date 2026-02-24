import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Plus, Instagram } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/db"

async function getIntegrationStatus(userId: string) {
    try {
        const integration = await prisma.instagramIntegration.findUnique({
            where: { userId }
        })
        return integration
    } catch (error) {
        console.error("Error fetching integration:", error)
        return null
    }
}

async function getAutomations(userId: string) {
    try {
        const integration = await prisma.instagramIntegration.findUnique({
            where: { userId },
            include: {
                automations: {
                    orderBy: { createdAt: "desc" }
                }
            }
        })
        return integration?.automations || []
    } catch (error) {
        console.error("Error fetching automations:", error)
        return []
    }
}

export default async function AutomationPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/")
    }

    const integration = await getIntegrationStatus(user.id)
    const automations = await getAutomations(user.id)

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Zap className="h-8 w-8 text-primary" />
                            Automação
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Crie automações inteligentes para seu Instagram
                        </p>
                    </div>
                    {integration && (
                        <Button asChild className="gradient-primary border-0 text-white">
                            <Link href="/automation/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Automação
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Instagram Integration Status */}
                {!integration ? (
                    <Card className="glass-effect border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Instagram className="h-5 w-5" />
                                Conectar Instagram
                            </CardTitle>
                            <CardDescription>
                                Para começar a usar automações, você precisa conectar sua conta do Instagram
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="gradient-primary border-0 text-white">
                                <Link href="/automation/integration">
                                    <Instagram className="mr-2 h-4 w-4" />
                                    Conectar Agora
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Integration Status Card */}
                        <Card className="glass-effect border-green-500/20 bg-green-500/5">
                            <CardContent className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Instagram className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Instagram Conectado</p>
                                        <p className="text-sm text-muted-foreground">
                                            {integration.isActive ? "Ativo" : "Inativo"}
                                        </p>
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/automation/integration">
                                        Gerenciar
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Automations List */}
                        {automations.length === 0 ? (
                            <Card className="glass-effect border-white/20">
                                <CardContent className="flex flex-col items-center justify-center py-16">
                                    <Zap className="h-16 w-16 text-muted-foreground/50 mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Nenhuma automação criada</h3>
                                    <p className="text-muted-foreground text-center max-w-md mb-6">
                                        Crie sua primeira automação para começar a interagir automaticamente com seus seguidores
                                    </p>
                                    <Button asChild className="gradient-primary border-0 text-white">
                                        <Link href="/automation/new">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Criar Primeira Automação
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {automations.map((automation) => (
                                    <Card key={automation.id} className="glass-effect border-white/20 hover:border-primary/50 transition-all group">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="text-lg">{automation.name}</CardTitle>
                                                <div className={`px-2 py-1 rounded text-xs font-medium ${automation.isActive
                                                    ? "bg-green-500/20 text-green-500"
                                                    : "bg-gray-500/20 text-gray-500"
                                                    }`}>
                                                    {automation.isActive ? "Ativo" : "Inativo"}
                                                </div>
                                            </div>
                                            <CardDescription>
                                                Gatilho: {automation.trigger}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button asChild variant="outline" className="w-full">
                                                <Link href={`/automation/${automation.id}`}>
                                                    Editar Automação
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
