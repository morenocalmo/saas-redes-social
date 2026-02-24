"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Save, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { MobilePreview } from "@/components/automation/MobilePreview"

export default function EditAutomationPage() {
    const router = useRouter()
    const { id: automationId } = useParams()

    const [isLoading, setIsLoading] = useState(true)
    const [name, setName] = useState("")

    // Manychat-style state
    const [triggerKeywords, setTriggerKeywords] = useState<string>("")
    const [responseMessage, setResponseMessage] = useState<string>("")
    const [responseLink, setResponseLink] = useState<string>("")

    // Pro features toggles
    const [proFollowUp, setProFollowUp] = useState(false)
    const [proFollowers, setProFollowers] = useState(false)
    const [proEmails, setProEmails] = useState(false)

    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const fetchAutomation = async () => {
            try {
                const response = await fetch(`/api/automation/${automationId}`)
                if (response.ok) {
                    const data = await response.json()
                    const automation = data.automation

                    setName(automation.name)

                    if (automation.flowData) {
                        const parsedData = typeof automation.flowData === 'string'
                            ? JSON.parse(automation.flowData)
                            : automation.flowData

                        if (parsedData.type === 'linear') {
                            setTriggerKeywords(parsedData.keywords?.join(", ") || "")
                            setResponseMessage(parsedData.responseMessage || "")
                            setResponseLink(parsedData.responseLink || "")
                            setProFollowUp(parsedData.proFeatures?.followUp || false)
                            setProFollowers(parsedData.proFeatures?.followers || false)
                            setProEmails(parsedData.proFeatures?.emails || false)
                        } else {
                            // Fallback for old reactflow data
                            setResponseMessage("Atenção: Esta automação foi migrada do editor antigo. Por favor, reconfigure a sua mensagem.")
                        }
                    }
                } else {
                    alert("Erro ao carregar automação")
                    router.push("/automation")
                }
            } catch (error) {
                console.error("Failed to load automation", error)
                alert("Erro ao carregar automação")
            } finally {
                setIsLoading(false)
            }
        }

        if (automationId) {
            fetchAutomation()
        }
    }, [automationId, router])

    const keywordsArray = triggerKeywords
        .split(",")
        .map(k => k.trim())
        .filter(k => k !== "")

    const handleSave = async () => {
        if (!name) {
            alert("Por favor, dê um nome para a automação no canto superior direito ou esquerdo.")
            return
        }

        setIsSaving(true)

        // The new JSON payload schema
        const flowData = {
            version: "2.0",
            type: "linear",
            keywords: keywordsArray,
            responseMessage,
            responseLink,
            proFeatures: {
                followUp: proFollowUp,
                followers: proFollowers,
                emails: proEmails
            }
        }

        try {
            const response = await fetch(`/api/automation/${automationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    trigger: "DM_KEYWORD",
                    flowData,
                }),
            })

            if (response.ok) {
                alert("Automação atualizada com sucesso!")
                router.push("/automation")
            } else {
                const data = await response.json()
                alert(data.error || "Erro ao salvar automação")
            }
        } catch (error) {
            alert("Erro ao processar requisição")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Carregando automação...</div>
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Topbar */}
            <div className="sticky top-0 z-50 border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between p-4 px-6">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                            <Link href="/automation">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome da sua automação..."
                            className="w-[300px] h-9 bg-transparent border-transparent hover:border-white/20 focus:border-white/20 text-lg font-semibold px-2"
                        />
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="gradient-primary border-0 text-white rounded-full px-6"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Salvando..." : "Salvar Configuração"}
                    </Button>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto">
                <div className="grid lg:grid-cols-[1fr_500px] gap-0 min-h-[calc(100vh-65px)]">

                    {/* Left Column - Configuration */}
                    <div className="p-8 lg:p-12 border-r border-white/5 overflow-y-auto pb-32">
                        <div className="max-w-xl space-y-12">

                            {/* Step 1 */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold tracking-tight">Quando alguém te enviar uma DM com</h2>
                                <Card className="bg-card/50 border-white/10 shadow-none">
                                    <div className="p-5 space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground font-normal">uma palavra ou expressão específica</Label>
                                            <Input
                                                placeholder="Digite uma ou mais palavras..."
                                                value={triggerKeywords}
                                                onChange={(e) => setTriggerKeywords(e.target.value)}
                                                className="bg-transparent border-white/20"
                                            />
                                            <p className="text-[11px] text-muted-foreground mt-1">
                                                Use vírgulas para separar as palavras. Por exemplo: <span className="text-blue-400">Preço, Link, Comprar</span>
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Step 2 */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold tracking-tight">Uma DM com um link será enviada para eles de volta</h2>
                                <Card className="bg-card/50 border-white/10 shadow-none">
                                    <div className="p-5 space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground font-normal">uma DM contendo um link</Label>
                                            <Textarea
                                                placeholder="Ex: Oi! Que bom que você se interessou. Aqui está o link que pediu:"
                                                value={responseMessage}
                                                onChange={(e) => setResponseMessage(e.target.value)}
                                                className="min-h-[100px] bg-transparent border-white/20 resize-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-md p-2 px-3">
                                            <LinkIcon className="w-4 h-4 text-blue-400" />
                                            <Input
                                                placeholder="https://seulink.com"
                                                value={responseLink}
                                                onChange={(e) => setResponseLink(e.target.value)}
                                                className="h-8 border-0 bg-transparent focus-visible:ring-0 shadow-none p-0"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Step 3 */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold tracking-tight">Outros recursos para automatizar</h2>
                                <div className="space-y-3">
                                    <Card className="bg-card/50 border-white/10 shadow-none flex items-center justify-between p-4 py-5 group transition-colors hover:bg-white/5">
                                        <div className="flex-1 pr-6">
                                            <span className="text-sm">Realize um acompanhamento para reengajar e cultivar a confiança</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-sm">PRO</span>
                                            <Switch checked={proFollowUp} onCheckedChange={setProFollowUp} />
                                        </div>
                                    </Card>

                                    <Card className="bg-card/50 border-white/10 shadow-none flex items-center justify-between p-4 py-5 group transition-colors hover:bg-white/5">
                                        <div className="flex-1 pr-6">
                                            <span className="text-sm">Encoraje automaticamente os seguidores a acompanhar você e aumentar seu público</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-sm">PRO</span>
                                            <Switch checked={proFollowers} onCheckedChange={setProFollowers} />
                                        </div>
                                    </Card>

                                    <Card className="bg-card/50 border-white/10 shadow-none flex items-center justify-between p-4 py-5 group transition-colors hover:bg-white/5">
                                        <div className="flex-1 pr-6">
                                            <span className="text-sm">Solicite os e-mails por DM para continuar a comunicação além das redes sociais</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-sm">PRO</span>
                                            <Switch checked={proEmails} onCheckedChange={setProEmails} />
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Preview */}
                    <div className="bg-black/20 hidden lg:block border-l border-white/5 relative">
                        <MobilePreview
                            triggerKeywords={keywordsArray}
                            responseMessage={responseMessage}
                            responseLink={responseLink}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
