import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { Download, FileText, Clock, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"

async function getDashboardData(userId: string) {
    const [materials, accessRequests, totalDownloads] = await Promise.all([
        prisma.material.count({
            where: { creatorId: userId, isActive: true }
        }),
        prisma.accessRequest.findMany({
            where: {
                material: { creatorId: userId },
                status: "PENDING"
            },
            include: {
                material: { select: { title: true } }
            },
            orderBy: { createdAt: "desc" },
            take: 5
        }),
        prisma.material.aggregate({
            where: { creatorId: userId },
            _sum: { downloadCount: true }
        })
    ])

    return {
        activeMaterials: materials,
        pendingRequests: accessRequests,
        totalDownloads: totalDownloads._sum.downloadCount || 0
    }
}

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/")
    }

    const data = await getDashboardData(user.id)

    return (
        <DashboardLayout user={user}>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Bem-vindo de volta, {user.displayName || user.email}!
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Aqui está um resumo da sua atividade
                    </p>
                </div>

                {/* Metrics Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="glass-effect border-white/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Downloads</CardTitle>
                            <Download className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                {data.totalDownloads}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Materiais baixados pelos seguidores
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="glass-effect border-white/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Materiais Ativos</CardTitle>
                            <FileText className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                {data.activeMaterials}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Disponíveis para resgate
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="glass-effect border-white/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
                            <Clock className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                {data.pendingRequests.length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Aguardando sua aprovação
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Activity */}
                    <Card className="glass-effect border-white/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Atividades Recentes
                            </CardTitle>
                            <CardDescription>
                                Últimas solicitações de acesso aos seus materiais
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.pendingRequests.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>Nenhuma solicitação pendente</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {data.pendingRequests.map((request) => (
                                        <div
                                            key={request.id}
                                            className="flex items-start justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{request.followerName || request.followerEmail}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {request.material.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                                                </p>
                                            </div>
                                            <Link href="/verifications">
                                                <Button size="sm" variant="outline">
                                                    Revisar
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                    {data.pendingRequests.length > 0 && (
                                        <Link href="/verifications">
                                            <Button variant="link" className="w-full">
                                                Ver todas as solicitações →
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card className="glass-effect border-white/20">
                        <CardHeader>
                            <CardTitle>Ações Rápidas</CardTitle>
                            <CardDescription>
                                Gerencie seus materiais e perfil
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/materials/new">
                                <Button className="w-full gradient-primary border-0 text-white font-semibold">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar Novo Material
                                </Button>
                            </Link>
                            <Link href="/materials">
                                <Button variant="outline" className="w-full">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Ver Todos os Materiais
                                </Button>
                            </Link>
                            <Link href="/settings/profile">
                                <Button variant="outline" className="w-full">
                                    Editar Perfil Público
                                </Button>
                            </Link>

                            {user.username && (
                                <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                                    <p className="text-sm font-medium mb-2">Sua página pública:</p>
                                    <Link
                                        href={`/u/${user.username}`}
                                        target="_blank"
                                        className="text-sm text-primary hover:underline break-all"
                                    >
                                        {typeof window !== 'undefined' ? window.location.origin : ''}/u/{user.username}
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
