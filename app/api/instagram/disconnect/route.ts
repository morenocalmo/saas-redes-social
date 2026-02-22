import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * Disconnect Instagram integration
 * Removes integration from database and deactivates related automations
 */
export async function POST() {
    try {
        // Verify user is authenticated
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Find integration
        const integration = await prisma.instagramIntegration.findUnique({
            where: { userId: user.id },
            include: {
                automations: true,
            },
        })

        if (!integration) {
            return NextResponse.json(
                { error: 'No integration found' },
                { status: 404 }
            )
        }

        // Deactivate all automations
        if (integration.automations.length > 0) {
            await prisma.automation.updateMany({
                where: { integrationId: integration.id },
                data: { isActive: false },
            })
        }

        // Delete integration
        await prisma.instagramIntegration.delete({
            where: { id: integration.id },
        })

        return NextResponse.json({
            success: true,
            message: 'Instagram disconnected successfully',
        })
    } catch (error) {
        console.error('Instagram disconnect error:', error)
        return NextResponse.json(
            { error: 'Failed to disconnect Instagram' },
            { status: 500 }
        )
    }
}
