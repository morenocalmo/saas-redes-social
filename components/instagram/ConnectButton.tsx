'use client'

import { Button } from '@/components/ui/button'
import { Instagram } from 'lucide-react'
import { useState } from 'react'

export default function ConnectButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleConnect = () => {
        setIsLoading(true)
        // Redirect to OAuth endpoint
        window.location.href = '/api/instagram/auth'
    }

    return (
        <Button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full gradient-primary border-0 text-white"
            size="lg"
        >
            <Instagram className="mr-2 h-5 w-5" />
            {isLoading ? 'Conectando...' : 'Conectar Instagram'}
        </Button>
    )
}
