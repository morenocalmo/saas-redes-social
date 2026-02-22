"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, FileText } from "lucide-react"
import Link from "next/link"

export default function NewMaterialPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        secretCode: "",
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!file) {
            alert("Por favor, selecione um arquivo")
            return
        }

        setIsLoading(true)

        try {
            // First, upload the file
            const fileFormData = new FormData()
            fileFormData.append("file", file)

            const uploadResponse = await fetch("/api/upload", {
                method: "POST",
                body: fileFormData,
            })

            if (!uploadResponse.ok) {
                throw new Error("Erro ao fazer upload do arquivo")
            }

            const { fileUrl } = await uploadResponse.json()

            // Then create the material
            const response = await fetch("/api/materials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    fileUrl,
                    fileType: file.type,
                }),
            })

            if (response.ok) {
                router.push("/materials")
            } else {
                const data = await response.json()
                alert(data.error || "Erro ao criar material")
            }
        } catch (error) {
            alert("Erro ao processar requisição")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background p-6 lg:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <Link href="/materials">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Novo Material</h1>
                    <p className="text-muted-foreground mt-2">
                        Adicione um novo arquivo exclusivo para seus seguidores
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card className="glass-effect border-white/20">
                        <CardHeader>
                            <CardTitle>Informações do Material</CardTitle>
                            <CardDescription>
                                Preencha os detalhes do material que você deseja compartilhar
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* File Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="file">Arquivo *</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="file"
                                        type="file"
                                        accept=".pdf,.xlsx,.xls,.doc,.docx,.ppt,.pptx,.zip"
                                        onChange={handleFileChange}
                                        required
                                    />
                                    {file && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <FileText className="h-4 w-4" />
                                            {file.name}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Formatos aceitos: PDF, Excel, Word, PowerPoint, ZIP
                                </p>
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Título *</Label>
                                <Input
                                    id="title"
                                    placeholder="Ex: E-book Completo de Marketing Digital"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Descreva o que está incluído neste material..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Secret Code */}
                            <div className="space-y-2">
                                <Label htmlFor="secretCode">Código Secreto *</Label>
                                <Input
                                    id="secretCode"
                                    placeholder="Ex: EXCLUSIVO2024"
                                    value={formData.secretCode}
                                    onChange={(e) => setFormData({ ...formData, secretCode: e.target.value.toUpperCase() })}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Este código será mencionado no seu vídeo para que os seguidores possam resgatar o material
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <Link href="/materials" className="flex-1">
                                    <Button type="button" variant="outline" className="w-full">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    className="flex-1 gradient-primary border-0 text-white font-semibold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        "Criando..."
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Criar Material
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    )
}
