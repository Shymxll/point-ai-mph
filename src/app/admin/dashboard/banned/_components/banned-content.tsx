"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NewBannedDialog } from './new-banned-dialog'
import { EditBannedDialog } from './edit-banned-dialog'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Search } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { BannedMainManager } from '@/commons/models/BannedModels'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import bannedService from '@/commons/services/BannedService'
import useAdminBannedGetList from '../lib/hooks/useAdminBannedGetList'

export default function BannedContent() {
    const { showToast } = useToast()
    const { data: bannedPrompts, isLoading, refetch } = useAdminBannedGetList()
    const [searchTerm, setSearchTerm] = React.useState('')



    const filteredPrompts = bannedPrompts?.filter(prompt =>
        prompt.bannedName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Yasaklı Promptlar</h1>
                    <p className="text-muted-foreground">
                        Sistemde yasaklanmış promptları yönetin
                    </p>
                </div>
                <NewBannedDialog onSuccess={() => refetch()} />
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
                            key={prompt.bannedId}
                            className={cn(
                                "relative group transition-all duration-200 hover:shadow-lg",
                                !prompt.bannedState && "opacity-75"
                            )}
                        >
                            <CardContent className="p-2">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start justify-between pl-1">
                                        <Badge variant={prompt.bannedState ? "default" : "secondary"} >
                                            {prompt.bannedState ? "Aktif" : "Pasif"}
                                        </Badge>
                                        <div className="flex gap-2  transition-opacity">
                                            <EditBannedDialog
                                                bannedId={prompt.bannedId}
                                                bannedName={prompt.bannedName}
                                                bannedState={prompt.bannedState}
                                                onSuccess={() => refetch()}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium break-all truncate px-2" >
                                            {prompt.bannedName}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredPrompts?.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">Hiç yasaklı prompt bulunamadı.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
