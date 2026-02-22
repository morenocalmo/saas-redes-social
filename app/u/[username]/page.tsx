import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Youtube, Instagram, FileText, Sparkles, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Helper function to extract YouTube channel ID from URL
function extractYouTubeChannelId(input: string): string {
    if (!input) return ""

    // If it's already just an ID (no slashes or special chars), return it
    if (!input.includes("/") && !input.includes("http")) {
        return input
    }

    // Extract from various YouTube URL formats
    const patterns = [
        /youtube\.com\/channel\/([^/?]+)/,
        /youtube\.com\/c\/([^/?]+)/,
        /youtube\.com\/@([^/?]+)/,
        /youtu\.be\/([^/?]+)/,
    ]

    for (const pattern of patterns) {
        const match = input.match(pattern)
        if (match) return match[1]
    }

    // If no pattern matches, try to extract the last part of the URL
    const parts = input.split("/").filter(Boolean)
    return parts[parts.length - 1] || input
}

async function getCreatorData(username: string) {
    const user = await prisma.user.findUnique({
        where: { username: username.toLowerCase() },
        select: {
            id: true,
            username: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
            youtubeChannelId: true,
            tiktokUsername: true,
            instagramUsername: true,
        }
    })

    if (!user) {
        return null
    }

    const materials = await prisma.material.findMany({
        where: {
            creatorId: user.id,
            isActive: true
        },
        orderBy: { createdAt: "desc" }
    })

    return { user, materials }
}

export default async function PublicCreatorPage({
    params,
}: {
    params: { username: string }
}) {
    const data = await getCreatorData(params.username)

    if (!data) {
        notFound()
    }

    const { user, materials } = data
    const youtubeId = extractYouTubeChannelId(user.youtubeChannelId || "")

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 gradient-primary animate-gradient opacity-20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />

                <div className="relative max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {user.displayName || user.username}
                        </h1>
                        {user.bio && (
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                {user.bio}
                            </p>
                        )}

                        {/* Social Links */}
                        <div className="flex items-center justify-center gap-4 pt-4">
                            {youtubeId && (
                                <a
                                    href={`https://youtube.com/channel/${youtubeId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                                >
                                    <Youtube className="h-5 w-5" />
                                    YouTube
                                </a>
                            )}
                            {user.tiktokUsername && (
                                <a
                                    href={`https://tiktok.com/@${user.tiktokUsername.replace("@", "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black hover:bg-gray-900 text-white transition-colors"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                    TikTok
                                </a>
                            )}
                            {user.instagramUsername && (
                                <a
                                    href={`https://instagram.com/${user.instagramUsername.replace("@", "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
                                >
                                    <Instagram className="h-5 w-5" />
                                    Instagram
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Materials Section */}
            <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">Materiais Exclusivos</h2>
                    <p className="text-muted-foreground">
                        Assista aos vídeos e resgate os materiais exclusivos usando o código secreto mencionado
                    </p>
                </div>

                {materials.length === 0 ? (
                    <Card className="glass-effect border-white/20">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">
                                Nenhum material disponível no momento
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {materials.map((material) => (
                            <Card key={material.id} className="glass-effect border-white/20 hover:border-primary/50 transition-all group">
                                <CardHeader>
                                    <CardTitle className="text-lg line-clamp-2">{material.title}</CardTitle>
                                    <CardDescription className="line-clamp-3">
                                        {material.description || "Material exclusivo disponível"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Link href={`/u/${user.username}/material/${material.id}`}>
                                        <Button className="w-full gradient-primary border-0 text-white font-semibold group-hover:shadow-lg group-hover:shadow-primary/50 transition-all">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Resgatar Material
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 mt-16">
                <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm">Powered by ExclusiveLink</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
