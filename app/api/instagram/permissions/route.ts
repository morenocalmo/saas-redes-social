import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { decrypt } from '@/lib/instagram/encryption'
import { getUserPermissions, hasRequiredPermissions } from '@/lib/instagram/api'

/**
 * Get Instagram permissions status
 * Returns list of granted permissions and whether all required ones are present
 */
export async function GET() {
    try {
        // Verify user is authenticated
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get integration
        const integration = await prisma.instagramIntegration.findUnique({
            where: { userId: user.id },
        })

        if (!integration) {
            return NextResponse.json(
                { error: 'No Instagram integration found' },
                { status: 404 }
            )
        }

        // Decrypt access token
        const accessToken = decrypt(integration.accessToken)

        // Get permissions from Instagram API
        const permissions = await getUserPermissions(
            integration.instagramUserId,
            accessToken
        )

        // Check if all required permissions are granted
        const allGranted = hasRequiredPermissions(permissions)

        // Required permissions list
        const required = [
            {
                name: 'instagram_basic',
                label: 'Informações Básicas',
                description: 'Acessar dados básicos da conta',
            },
            {
                name: 'instagram_manage_comments',
                label: 'Gerenciar Comentários',
                description: 'Responder automaticamente a comentários',
            },
            {
                name: 'instagram_manage_messages',
                label: 'Gerenciar Mensagens',
                description: 'Enviar DMs automáticas',
            },
        ]

        // Map permissions with status
        const permissionsStatus = required.map(req => {
            const perm = permissions.data.find(p => p.permission === req.name)
            return {
                ...req,
                granted: perm?.status === 'granted',
                status: perm?.status || 'not_requested',
            }
        })

        return NextResponse.json({
            allGranted,
            permissions: permissionsStatus,
            lastChecked: new Date().toISOString(),
        })
    } catch (error) {
        console.error('Permissions check error:', error)
        return NextResponse.json(
            { error: 'Failed to check permissions' },
            { status: 500 }
        )
    }
}
