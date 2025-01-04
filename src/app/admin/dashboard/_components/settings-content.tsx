'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useToast } from "@/context/ToastContext"
import { toast } from "sonner"

export default function SettingsContent() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = () => {
        setIsLoading(true)
        // Burada ayarları kaydetme işlemi yapılacak
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Ayarlar başarıyla kaydedildi")
        }, 1000)
    }

    return (
        <main className="flex-1 overflow-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Settings</h2>
                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90"
                >
                    {isLoading ? "Kaydediliyor..." : "Kaydet"}
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Sistem Promptları</CardTitle>
                        <CardDescription>
                            AI modelinin varsayılan davranışını ve rolünü belirleyin
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="default-prompt">Varsayılan System Prompt</Label>
                            <Textarea
                                id="default-prompt"
                                placeholder="Örn: Sen yardımcı bir asistansın..."
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tone">Konuşma Tonu</Label>
                            <Select defaultValue="professional">
                                <SelectTrigger>
                                    <SelectValue placeholder="Ton seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professional">Profesyonel</SelectItem>
                                    <SelectItem value="friendly">Arkadaşça</SelectItem>
                                    <SelectItem value="formal">Resmi</SelectItem>
                                    <SelectItem value="casual">Günlük</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Model Ayarları</CardTitle>
                        <CardDescription>
                            AI modelinin davranışını kontrol eden parametreler
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="temperature">Temperature</Label>
                                <Input
                                    id="temperature"
                                    type="number"
                                    placeholder="0.7"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Yanıtların yaratıcılık seviyesi (0-2 arası)
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="max-tokens">Maksimum Token</Label>
                                <Input
                                    id="max-tokens"
                                    type="number"
                                    placeholder="2000"
                                    min="1"
                                    max="4000"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Maksimum yanıt uzunluğu
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="model">AI Modeli</Label>
                            <Select defaultValue="gpt-4">
                                <SelectTrigger>
                                    <SelectValue placeholder="Model seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
} 