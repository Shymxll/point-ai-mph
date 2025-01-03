'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import bannedService from '@/commons/services/BannedService'
import { BannedMainManager } from '@/commons/models/BannedModels'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import useAdminBannedGetById from '../lib/hooks/useAdminBannedGetById'
import useAdminBannedUpdate from '../lib/hooks/useAdminbannedUpdate'

interface EditBannedDialogProps {
    bannedId: number;
    bannedName: string;
    bannedState: boolean;
    onSuccess: () => void;
}

export function EditBannedDialog({ bannedId, bannedName, bannedState, onSuccess }: EditBannedDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { showToast } = useToast()

    const getBannedById = useAdminBannedGetById(bannedId)

    useEffect(() => {
        getBannedById.refetch()
    }, [bannedId])

    console.log("getBannedById",bannedId)
    console.log(getBannedById)

    const updateMutation = useAdminBannedUpdate(
        () => {
            showToast("Yasaklı prompt başarıyla güncellendi.", "success")
            setIsOpen(false)
            onSuccess()
        },
        (error: string) => {
            showToast(error, "error")
        }
    )



    const handleSubmit = async (data: BannedMainManager) => {
        updateMutation.mutate(data)
    }

    const form = useForm<BannedMainManager>({
        defaultValues: {
            bannedId: bannedId,
            bannedName: bannedName,
            bannedState: bannedState
        }
    })


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogOverlay className="bg-red-100/30 backdrop-blur-lg" />
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yasaklı Prompt Düzenle</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="bannedName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Yasaklı Prompt Adı</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Yasaklı prompt adı"
                                            defaultValue={bannedName}
                                            onChange={field.onChange} 
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bannedState"
                            render={({ field }) => (
                                <FormItem className='flex flex-row gap-2'>
                                    <FormControl className='flex flex-row gap-2'>
                                        <div className='flex flex-row gap-2 items-center'>
                                            <p>Pasif</p>
                                            <Switch
                                                defaultChecked={    bannedState}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <p>Aktif</p>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Kaydediliyor..." : "Kaydet"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 