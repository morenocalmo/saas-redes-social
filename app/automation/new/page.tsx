"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Plus, Zap, Send, GitBranch, Clock } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Node, Edge } from "reactflow"

// Import FlowEditor dynamically to avoid SSR issues
const FlowEditor = dynamic(() => import("@/components/automation/FlowEditor"), {
    ssr: false,
    loading: () => <div className="w-full h-[calc(100vh-12rem)] flex items-center justify-center">Carregando editor...</div>
})

const initialNodes: Node[] = [
    {
        id: "1",
        type: "trigger",
        position: { x: 250, y: 50 },
        data: { label: "Comentário no Post", trigger: "Quando alguém comentar" },
    },
]

const initialEdges: Edge[] = []

export default function NewAutomationPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [trigger, setTrigger] = useState("COMMENT")
    const [nodes, setNodes] = useState<Node[]>(initialNodes)
    const [edges, setEdges] = useState<Edge[]>(initialEdges)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async (savedNodes: Node[], savedEdges: Edge[]) => {
        if (!name) {
            alert("Por favor, dê um nome para a automação")
            return
        }

        setIsSaving(true)

        try {
            const response = await fetch("/api/automation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    trigger,
                    flowData: {
                        nodes: savedNodes,
                        edges: savedEdges,
                    },
                }),
            })

            if (response.ok) {
                alert("Automação salva com sucesso!")
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

    const addNode = (type: string) => {
        const newNode: Node = {
            id: `${nodes.length + 1}`,
            type,
            position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 200 },
            data: {
                label: type === "trigger" ? "Novo Gatilho" :
                    type === "action" ? "Nova Ação" :
                        type === "condition" ? "Nova Condição" :
                            "Novo Delay"
            },
        }
        setNodes([...nodes, newNode])
    }

    return (
        <div className="min-h-screen bg-background p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/automation">
                            <Button variant="ghost" size="sm" className="mb-2">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">Nova Automação</h1>
                        <p className="text-muted-foreground mt-2">
                            Crie um fluxo de automação arrastando e conectando os cards
                        </p>
                    </div>
                    <Button
                        onClick={() => handleSave(nodes, edges)}
                        disabled={isSaving}
                        className="gradient-primary border-0 text-white"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Salvando..." : "Salvar Automação"}
                    </Button>
                </div>

                {/* Settings */}
                <Card className="glass-effect border-white/20">
                    <CardHeader>
                        <CardTitle>Configurações</CardTitle>
                        <CardDescription>Defina o nome e gatilho da automação</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome da Automação</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Responder comentários com código"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="trigger">Gatilho</Label>
                            <select
                                id="trigger"
                                value={trigger}
                                onChange={(e) => setTrigger(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                            >
                                <option value="COMMENT">Comentário</option>
                                <option value="REEL_COMMENT">Comentário em Reel</option>
                                <option value="DM">Mensagem Direta</option>
                                <option value="STORY_MENTION">Menção no Story</option>
                                <option value="LIKE">Curtida</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Editor */}
                <div className="grid lg:grid-cols-[250px_1fr] gap-6">
                    {/* Sidebar */}
                    <Card className="glass-effect border-white/20 h-fit">
                        <CardHeader>
                            <CardTitle className="text-base">Adicionar Nós</CardTitle>
                            <CardDescription className="text-xs">
                                Clique para adicionar ao fluxo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => addNode("trigger")}
                            >
                                <Zap className="mr-2 h-4 w-4 text-primary" />
                                Gatilho
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => addNode("action")}
                            >
                                <Send className="mr-2 h-4 w-4 text-blue-500" />
                                Ação
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => addNode("condition")}
                            >
                                <GitBranch className="mr-2 h-4 w-4 text-yellow-500" />
                                Condição
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => addNode("delay")}
                            >
                                <Clock className="mr-2 h-4 w-4 text-purple-500" />
                                Aguardar
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Flow Editor */}
                    <FlowEditor
                        initialNodes={nodes}
                        initialEdges={edges}
                        onSave={handleSave}
                    />
                </div>
            </div>
        </div>
    )
}
