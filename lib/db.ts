import { PrismaClient } from '@prisma/client'

// Ensure environment variables are loaded
if (!process.env.PRISMA_DATABASE_URL) {
    throw new Error(
        'PRISMA_DATABASE_URL is not defined. Please check your .env file.\n' +
        'Expected format: PRISMA_DATABASE_URL="postgresql://user:password@host:6543/database?pgbouncer=true"'
    )
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
        db: {
            url: process.env.PRISMA_DATABASE_URL
        }
    }
})

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
