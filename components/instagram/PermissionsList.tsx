'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Permission {
    name: string
    label: string
    description: string
    granted: boolean
    status: string
}

interface PermissionsData {
    allGranted: boolean
    permissions: Permission[]
    lastChecked: string
}

export default function PermissionsList() {
    const [data, setData] = useState<PermissionsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchPermissions()
    }, [])

    const fetchPermissions = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/instagram/permissions')

            if (response.ok) {
                const result = await response.json()
                setData(result)
            } else {
                setError('Falha ao carregar permissões')
            }
        } catch (err) {
            setError('Erro ao carregar permissões')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <Card className="glass-effect border-white/20">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error || !data) {
        return (
            <Card className="glass-effect border-red-500/20 bg-red-500/5">
                <CardContent className="pt-6">
                    <p className="text-sm text-red-500">{error || 'Erro desconhecido'}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="glass-effect border-white/20">
            <CardContent className="pt-6 space-y-3">
                {data.permissions.map((permission) => (
                    <div
                        key={permission.name}
                        className="flex items-start gap-3 p-3 rounded-lg bg-accent/30"
                    >
                        {permission.granted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                            <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                            <p className="font-medium text-sm">{permission.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {permission.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Status: <span className={permission.granted ? 'text-green-500' : 'text-red-500'}>
                                    {permission.granted ? 'Concedida' : 'Não concedida'}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}

                <div className="pt-2 text-xs text-muted-foreground text-center">
                    Última verificação: {new Date(data.lastChecked).toLocaleString('pt-BR')}
                </div>
            </CardContent>
        </Card>
    )
}
