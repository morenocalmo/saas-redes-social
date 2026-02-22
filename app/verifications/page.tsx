import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { prisma } from "@/lib/db"
import VerificationList from "@/components/verifications/VerificationList"

async function getAccessRequests(userId: string) {
    return await prisma.accessRequest.findMany({
        where: {
            material: { creatorId: userId },
            status: "PENDING"
        },
        include: {
            material: {
                select: {
                    id: true,
                    title: true,
                    secretCode: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    })
}

export default async function VerificationsPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/")
    }

    const requests = await getAccessRequests(user.id)

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Verificações</h1>
                    <p className="text-muted-foreground mt-2">
                        Revise e aprove solicitações de acesso aos seus materiais
                    </p>
                </div>

                {/* Verification List */}
                <VerificationList requests={requests} />
            </div>
        </DashboardLayout>
    )
}
