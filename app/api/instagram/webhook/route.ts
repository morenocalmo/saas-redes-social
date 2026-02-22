import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * Instagram Webhook Endpoint
 * Handles verification and incoming events from Instagram
 */

/**
 * Webhook verification (GET)
 * Instagram sends this to verify the webhook endpoint
 */
export async function GET(request: NextRequest) {
    try {
        const mode = request.nextUrl.searchParams.get('hub.mode')
        const token = request.nextUrl.searchParams.get('hub.verify_token')
        const challenge = request.nextUrl.searchParams.get('hub.challenge')

        const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN

        // Check if verification request
        if (mode === 'subscribe' && token === verifyToken) {
            console.log('Webhook verified successfully')
            return new NextResponse(challenge, { status: 200 })
        }

        console.error('Webhook verification failed')
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 403 }
        )
    } catch (error) {
        console.error('Webhook verification error:', error)
        return NextResponse.json(
            { error: 'Verification error' },
            { status: 500 }
        )
    }
}

/**
 * Webhook events (POST)
 * Receives events from Instagram (comments, messages, etc.)
 */
export async function POST(request: NextRequest) {
    try {
        // Get signature from headers
        const signature = request.headers.get('x-hub-signature-256')

        // Get raw body
        const body = await request.text()

        // Verify signature
        if (!verifySignature(body, signature)) {
            console.error('Invalid webhook signature')
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 403 }
            )
        }

        // Parse event data
        const data = JSON.parse(body)

        console.log('Webhook event received:', JSON.stringify(data, null, 2))

        // Process each entry
        for (const entry of data.entry || []) {
            // Process changes
            for (const change of entry.changes || []) {
                await processWebhookChange(change)
            }
        }

        // Return 200 OK to acknowledge receipt
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Webhook processing error:', error)
        // Still return 200 to prevent Instagram from retrying
        return NextResponse.json({ success: false })
    }
}

/**
 * Verify webhook signature
 */
function verifySignature(payload: string, signature: string | null): boolean {
    if (!signature) return false

    const appSecret = process.env.INSTAGRAM_APP_SECRET
    if (!appSecret) {
        console.error('INSTAGRAM_APP_SECRET not configured')
        return false
    }

    const expectedSignature = crypto
        .createHmac('sha256', appSecret)
        .update(payload)
        .digest('hex')

    const signatureHash = signature.replace('sha256=', '')

    return crypto.timingSafeEqual(
        Buffer.from(signatureHash),
        Buffer.from(expectedSignature)
    )
}

/**
 * Process webhook change event
 */
async function processWebhookChange(change: any) {
    const { field, value } = change

    console.log(`Processing ${field} event:`, value)

    switch (field) {
        case 'comments':
            await handleCommentEvent(value)
            break
        case 'messages':
            await handleMessageEvent(value)
            break
        case 'mentions':
            await handleMentionEvent(value)
            break
        default:
            console.log(`Unhandled event type: ${field}`)
    }
}

/**
 * Handle comment event
 */
async function handleCommentEvent(value: any) {
    console.log('Comment event:', value)

    // TODO: Find matching automation
    // TODO: Execute automation flow
    // TODO: Log execution

    // Placeholder for automation execution
    // This will be implemented when we build the automation execution engine
}

/**
 * Handle message (DM) event
 */
async function handleMessageEvent(value: any) {
    console.log('Message event:', value)

    // TODO: Find matching automation
    // TODO: Execute automation flow
    // TODO: Log execution
}

/**
 * Handle mention event
 */
async function handleMentionEvent(value: any) {
    console.log('Mention event:', value)

    // TODO: Find matching automation
    // TODO: Execute automation flow
    // TODO: Log execution
}
