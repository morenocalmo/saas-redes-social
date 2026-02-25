"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    FileText,
    CheckSquare,
    Settings,
    CreditCard,
    LogOut,
    Menu,
    X,
    Sparkles,
    Zap
} from "lucide-react"
import { useState } from "react"

interface DashboardLayoutProps {
    children: React.ReactNode
    user: {
        displayName: string | null
        email: string
        subscriptionStatus: string
    }
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        router.push("/")
    }

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Materiais", href: "/materials", icon: FileText },
        { name: "Verificações", href: "/verifications", icon: CheckSquare },
        { name: "Configurações", href: "/settings/profile", icon: Settings },
        { name: "Assinatura", href: "/subscription", icon: CreditCard },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar - Desktop */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-card/50 backdrop-blur-xl hidden lg:block">
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            ExclusiveLink
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-3 py-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive
                                        ? "bg-primary/20 text-primary"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User info & Logout */}
                    <div className="border-t border-white/10 p-4">
                        <div className="mb-3 rounded-lg bg-accent/50 p-3">
                            <p className="text-sm font-medium truncate">{user.displayName || user.email}</p>
                            <p className="text-xs text-muted-foreground capitalize">{user.subscriptionStatus.toLowerCase()}</p>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground hover:text-destructive"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sair
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-card/50 backdrop-blur-xl px-4 lg:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </Button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        ExclusiveLink
                    </span>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm lg:hidden">
                    <div className="fixed inset-y-0 left-0 w-full max-w-xs border-r border-white/10 bg-card p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    ExclusiveLink
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                <X />
                            </Button>
                        </div>

                        <nav className="space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive
                                            ? "bg-primary/20 text-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>

                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="mb-3 rounded-lg bg-accent/50 p-3">
                                <p className="text-sm font-medium truncate">{user.displayName || user.email}</p>
                                <p className="text-xs text-muted-foreground capitalize">{user.subscriptionStatus.toLowerCase()}</p>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-muted-foreground hover:text-destructive"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="lg:pl-64">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
