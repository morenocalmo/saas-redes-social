'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DisconnectButton() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleDisconnect = async () => {
        if (!confirm('Tem certeza que deseja desconectar sua conta do Instagram? Todas as automações serão desativadas.')) {
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/instagram/disconnect', {
                method: 'POST',
            })

            if (response.ok) {
                // Refresh the page to show disconnected state
                router.refresh()
            } else {
                const data = await response.json()
                alert(data.error || 'Erro ao desconectar')
            }
        } catch (error) {
            console.error('Disconnect error:', error)
            alert('Erro ao desconectar')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleDisconnect}
            disabled={isLoading}
            variant="destructive"
            size="sm"
        >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? 'Desconectando...' : 'Desconectar'}
        </Button>
    )
}
