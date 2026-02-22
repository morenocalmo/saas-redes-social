import { PrismaClient } from '@prisma/client'

// Ensure environment variables are loaded
if (!process.env.DATABASE_URL) {
    throw new Error(
        'DATABASE_URL is not defined. Please check your .env file.\n' +
        'Expected format: DATABASE_URL="postgresql://user:password@host:5432/database"'
    )
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
