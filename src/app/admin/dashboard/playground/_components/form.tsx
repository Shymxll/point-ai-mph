import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Rabbit, Bird, Turtle, CornerDownLeft, Paperclip, Mic } from 'lucide-react'

export default function Form() {
    return (
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            <div
                className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0"
            >
                <form className="grid w-full items-start gap-6">
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            Ayarlar
                        </legend>
                        <div className="grid gap-3">
                            <Label htmlFor="model">Model</Label>
                            <Select>
                                <SelectTrigger
                                    id="model"
                                    className="items-start [&_[data-description]]:hidden"
                                >
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gpt-4-turbo">
                                        <div className="flex items-start gap-3 text-muted-foreground">
                                            <Rabbit className="size-5" />
                                            <div className="grid gap-0.5">
                                                <p>
                                                    GPT-4{" "}
                                                    <span className="font-medium text-foreground">
                                                        Turbo
                                                    </span>
                                                </p>
                                                <p className="text-xs" data-description>
                                                    En yeni ve en gelişmiş model. Daha hızlı ve daha yetenekli.
                                                </p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="gpt-4">
                                        <div className="flex items-start gap-3 text-muted-foreground">
                                            <Bird className="size-5" />
                                            <div className="grid gap-0.5">
                                                <p>
                                                    GPT-4{" "}
                                                    <span className="font-medium text-foreground">
                                                        Standard
                                                    </span>
                                                </p>
                                                <p className="text-xs" data-description>
                                                    Güçlü ve güvenilir. Karmaşık görevler için ideal.
                                                </p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="gpt-3.5-turbo">
                                        <div className="flex items-start gap-3 text-muted-foreground">
                                            <Turtle className="size-5" />
                                            <div className="grid gap-0.5">
                                                <p>
                                                    GPT-3.5{" "}
                                                    <span className="font-medium text-foreground">
                                                        Turbo
                                                    </span>
                                                </p>
                                                <p className="text-xs" data-description>
                                                    Hızlı ve ekonomik. Genel kullanım için uygun.
                                                </p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="temperature">Sıcaklık</Label>
                            <Input id="temperature" type="number" placeholder="0.4" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="top-p">Top P</Label>
                                <Input id="top-p" type="number" placeholder="0.7" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="top-k">Top K</Label>
                                <Input id="top-k" type="number" placeholder="0.0" />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            Mesajlar
                        </legend>
                        <div className="grid gap-3">
                            <Label htmlFor="role">Role</Label>
                            <Select defaultValue="system">
                                <SelectTrigger>
                                    <SelectValue placeholder="Bir rol seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="system">Sistem</SelectItem>
                                    <SelectItem value="user">Kullanıcı</SelectItem>
                                    <SelectItem value="assistant">Asistan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="content">İçerik</Label>
                            <Textarea
                                id="content"
                                placeholder="You are a..."
                                className="min-h-[9.5rem]"
                            />
                        </div>
                    </fieldset>
                </form>
            </div>
            <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
                <Badge variant="outline" className="absolute right-3 top-3">
                    Çıktı
                </Badge>
                <div className="flex-1" />
                <form
                    className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring" x-chunk="dashboard-03-chunk-1"
                >
                    <Label htmlFor="message" className="sr-only">
                        Mesaj
                    </Label>
                    <Textarea
                        id="message"
                        placeholder="Type your message here..."
                        className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                    />
                    <div className="flex items-center p-3 pt-0">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Paperclip className="size-4" />
                                    <span className="sr-only">Dosya ekle</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Dosya ekle</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Mic className="size-4" />
                                    <span className="sr-only">Mikrofon kullan</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Mikrofon kullan</TooltipContent>
                        </Tooltip>
                        <Button type="submit" size="sm" className="ml-auto gap-1.5">
                            Mesaj gönder
                            <CornerDownLeft className="size-3.5" />
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    )
}
