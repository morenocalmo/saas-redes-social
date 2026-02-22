import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Instagram, AlertCircle, CheckCircle2 } from "lucide-react"
import { prisma } from "@/lib/db"
import ConnectButton from "@/components/instagram/ConnectButton"
import DisconnectButton from "@/components/instagram/DisconnectButton"

async function getIntegration(userId: string) {
    try {
        return await prisma.instagramIntegration.findUnique({
            where: { userId }
        })
    } catch (error) {
        console.error("Error fetching integration:", error)
        return null
    }
}

interface PageProps {
    searchParams: {
        success?: string
        error?: string
    }
}

export default async function IntegrationPage({ searchParams }: PageProps) {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/")
    }

    const integration = await getIntegration(user.id)
    const { success, error } = searchParams

    return (
        <DashboardLayout user={user}>
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Instagram className="h-8 w-8 text-primary" />
                        Integração Instagram
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Conecte sua conta do Instagram para usar automações
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <Card className="border-green-500/50 bg-green-500/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <p className="text-sm font-medium">
                                    Instagram conectado com sucesso! Agora você pode criar automações.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Error Messages */}
                {error && (
                    <Card className="border-red-500/50 bg-red-500/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                <div>
                                    <p className="text-sm font-medium">
                                        {error === 'access_denied' && 'Você negou o acesso ao Instagram.'}
                                        {error === 'no_code' && 'Código de autorização não recebido.'}
                                        {error === 'oauth_failed' && 'Falha ao conectar com Instagram. Tente novamente.'}
                                        {!['access_denied', 'no_code', 'oauth_failed'].includes(error) && 'Ocorreu um erro. Tente novamente.'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Integration Status */}
                {integration ? (
                    <Card className="glass-effect border-green-500/20 bg-green-500/5">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <CardTitle>Instagram Conectado</CardTitle>
                                </div>
                                <DisconnectButton />
                            </div>
                            <CardDescription>
                                Sua conta do Instagram está conectada e ativa
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className={integration.isActive ? "text-green-500" : "text-gray-500"}>
                                        {integration.isActive ? "Ativo" : "Inativo"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Conectado em:</span>
                                    <span>{new Date(integration.createdAt).toLocaleDateString("pt-BR")}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">ID do Instagram:</span>
                                    <span className="font-mono text-xs">{integration.instagramUserId}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Instructions */}
                        <Card className="glass-effect border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5" />
                                    Como Conectar
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <p>1. Clique no botão "Conectar Instagram" abaixo</p>
                                <p>2. Faça login com sua conta do Facebook/Meta</p>
                                <p>3. Selecione a página do Instagram que deseja conectar</p>
                                <p>4. Autorize as permissões necessárias</p>
                                <p>5. Aguarde a confirmação da conexão</p>
                            </CardContent>
                        </Card>

                        {/* Connect Button */}
                        <Card className="glass-effect border-white/20">
                            <CardHeader>
                                <CardTitle>Conectar sua Conta</CardTitle>
                                <CardDescription>
                                    Você será redirecionado para o Meta/Facebook para autorizar a conexão
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ConnectButton />
                                <p className="text-xs text-muted-foreground mt-4 text-center">
                                    Ao conectar, você autoriza o acesso às permissões necessárias.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Permissions Info */}
                        <Card className="glass-effect border-white/20">
                            <CardHeader>
                                <CardTitle className="text-base">Permissões Necessárias</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Gerenciar Comentários</p>
                                        <p className="text-muted-foreground text-xs">
                                            Para responder automaticamente a comentários
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Gerenciar Mensagens</p>
                                        <p className="text-muted-foreground text-xs">
                                            Para enviar DMs automáticas
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Informações Básicas</p>
                                        <p className="text-muted-foreground text-xs">
                                            Para acessar dados da sua conta
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
