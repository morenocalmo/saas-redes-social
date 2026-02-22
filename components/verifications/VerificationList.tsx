"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Image as ImageIcon, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"

interface AccessRequest {
    id: string
    followerName: string | null
    followerEmail: string
    secretCodeAttempt: string
    screenshotUrl: string
    createdAt: Date
    material: {
        id: string
        title: string
        secretCode: string
    }
}

interface VerificationListProps {
    requests: AccessRequest[]
}

export default function VerificationList({ requests }: VerificationListProps) {
    // Group requests by material
    const groupedRequests = requests.reduce((acc, request) => {
        const materialId = request.material.id
        if (!acc[materialId]) {
            acc[materialId] = {
                material: request.material,
                requests: []
            }
        }
        acc[materialId].requests.push(request)
        return acc
    }, {} as Record<string, { material: { id: string; title: string; secretCode: string }; requests: AccessRequest[] }>)

    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
        new Set(Object.keys(groupedRequests))
    )

    const toggleGroup = (materialId: string) => {
        const newExpanded = new Set(expandedGroups)
        if (newExpanded.has(materialId)) {
            newExpanded.delete(materialId)
        } else {
            newExpanded.add(materialId)
        }
        setExpandedGroups(newExpanded)
    }

    if (requests.length === 0) {
        return (
            <Card className="glass-effect border-white/20">
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <Clock className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma solicitação pendente</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                        Quando seus seguidores solicitarem acesso aos materiais, eles aparecerão aqui para revisão
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {Object.entries(groupedRequests).map(([materialId, group]) => {
                const isExpanded = expandedGroups.has(materialId)
                const requestCount = group.requests.length

                return (
                    <div key={materialId} className="space-y-2">
                        {/* Group Header */}
                        <button
                            onClick={() => toggleGroup(materialId)}
                            className="w-full flex items-center justify-between p-4 rounded-lg glass-effect border-white/20 hover:border-primary/30 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-primary font-bold">{requestCount}</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold">{group.material.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {requestCount} {requestCount === 1 ? "solicitação" : "solicitações"}
                                    </p>
                                </div>
                            </div>
                            {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                        </button>

                        {/* Requests */}
                        {isExpanded && (
                            <div className="space-y-3 pl-4">
                                {group.requests.map((request) => (
                                    <Card key={request.id} className="glass-effect border-white/20">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">{request.followerName || request.followerEmail}</CardTitle>
                                                    <CardDescription className="mt-1">
                                                        Solicitou acesso a: <span className="font-medium">{request.material.title}</span>
                                                    </CardDescription>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        {new Date(request.createdAt).toLocaleString("pt-BR")}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {/* Screenshot Preview */}
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Comprovante de Inscrição</Label>
                                                    <div className="relative aspect-video rounded-lg overflow-hidden bg-accent/50 border border-white/10">
                                                        {request.screenshotUrl ? (
                                                            <Image
                                                                src={request.screenshotUrl}
                                                                alt="Screenshot de inscrição"
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full">
                                                                <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Code Verification */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label className="text-sm font-medium">Código Informado</Label>
                                                        <div className="mt-2 p-4 rounded-lg bg-accent/50 border border-white/10">
                                                            <p className="font-mono font-bold text-lg">{request.secretCodeAttempt}</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label className="text-sm font-medium">Código Correto</Label>
                                                        <div className="mt-2 p-4 rounded-lg bg-primary/10 border border-primary/20">
                                                            <p className="font-mono font-bold text-lg text-primary">{request.material.secretCode}</p>
                                                        </div>
                                                    </div>

                                                    {request.secretCodeAttempt === request.material.secretCode ? (
                                                        <div className="flex items-center gap-2 text-green-500 text-sm">
                                                            <CheckCircle className="h-4 w-4" />
                                                            Código correto
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-destructive text-sm">
                                                            <XCircle className="h-4 w-4" />
                                                            Código incorreto
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 pt-4">
                                                <form action={`/api/verifications/${request.id}/approve`} method="POST" className="flex-1">
                                                    <Button
                                                        type="submit"
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Aprovar
                                                    </Button>
                                                </form>
                                                <form action={`/api/verifications/${request.id}/reject`} method="POST" className="flex-1">
                                                    <Button
                                                        type="submit"
                                                        variant="destructive"
                                                        className="w-full"
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Rejeitar
                                                    </Button>
                                                </form>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
    return <label className={className}>{children}</label>
}
