import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { Plus, FileText, Download, Eye, EyeOff, Trash2, Edit } from "lucide-react"
import Link from "next/link"

async function getMaterials(userId: string) {
    return await prisma.material.findMany({
        where: { creatorId: userId },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { accessRequests: true }
            }
        }
    })
}

export default async function MaterialsPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/")
    }

    const materials = await getMaterials(user.id)

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Meus Materiais</h1>
                        <p className="text-muted-foreground mt-2">
                            Gerencie seus arquivos exclusivos e códigos secretos
                        </p>
                    </div>
                    <Link href="/materials/new">
                        <Button className="gradient-primary border-0 text-white font-semibold">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Material
                        </Button>
                    </Link>
                </div>

                {/* Materials Grid */}
                {materials.length === 0 ? (
                    <Card className="glass-effect border-white/20">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Nenhum material cadastrado</h3>
                            <p className="text-muted-foreground text-center mb-6 max-w-md">
                                Comece adicionando seu primeiro material exclusivo para compartilhar com seus seguidores
                            </p>
                            <Link href="/materials/new">
                                <Button className="gradient-primary border-0 text-white font-semibold">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar Primeiro Material
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {materials.map((material) => (
                            <Card key={material.id} className="glass-effect border-white/20 hover:border-primary/50 transition-all">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg line-clamp-1">{material.title}</CardTitle>
                                            <CardDescription className="line-clamp-2 mt-2">
                                                {material.description || "Sem descrição"}
                                            </CardDescription>
                                        </div>
                                        {material.isActive ? (
                                            <Eye className="h-4 w-4 text-green-500 flex-shrink-0 ml-2" />
                                        ) : (
                                            <EyeOff className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Downloads</p>
                                            <p className="font-semibold text-lg">{material.downloadCount}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Solicitações</p>
                                            <p className="font-semibold text-lg">{material._count.accessRequests}</p>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-lg bg-accent/50">
                                        <p className="text-xs text-muted-foreground mb-1">Código Secreto</p>
                                        <p className="font-mono font-semibold">{material.secretCode}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Edit className="mr-2 h-3 w-3" />
                                            Editar
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
