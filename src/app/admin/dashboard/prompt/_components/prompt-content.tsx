"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import promptService from '@/commons/services/PromptService'
import useAdminPromptGetList from '../lib/hooks/useAdminPromptGetList'
import { NewPromptDialog } from './new-prompt-dialog'
import { EditPromptDialog } from './edit-prompt-dialog'

interface PromptMainManager {
    promptId: number;
    promptName: string;
    promptState: boolean;
}

export default function PromptContent() {
    const { showToast } = useToast()
    const { data: prompts, isLoading, refetch } = useAdminPromptGetList()
    const [searchTerm, setSearchTerm] = React.useState('')

    const filteredPrompts = prompts?.filter(prompt =>
        prompt.promptName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Komut Promptları</h1>
                    <p className="text-muted-foreground">
                        Sistemde kullanılan promptları yönetin
                    </p>
                </div>
                <NewPromptDialog onSuccess={() => refetch()} />
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Promptlarda ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 max-w-md"
                />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="relative">
                            <CardContent className="p-6">
                                <div className="h-20 animate-pulse bg-muted rounded" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredPrompts?.map((prompt) => (
                        <Card
                            key={prompt.promptId}
                            className={cn(
                                "relative group transition-all duration-200 hover:shadow-lg",
                                !prompt.promptState && "opacity-75"
                            )}
                        >
                            <CardContent className="p-2">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start justify-between pl-1">
                                        <Badge variant={prompt.promptState ? "default" : "secondary"}>
                                            {prompt.promptState ? "Aktif" : "Pasif"}
                                        </Badge>
                                        <div className="flex gap-2 transition-opacity">
                                            <EditPromptDialog
                                                promptId={prompt.promptId}
                                                promptName={prompt.promptName}
                                                promptState={prompt.promptState}
                                                onSuccess={() => refetch()}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium break-all truncate px-2">
                                            {prompt.promptName}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredPrompts?.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">Hiç prompt bulunamadı.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
