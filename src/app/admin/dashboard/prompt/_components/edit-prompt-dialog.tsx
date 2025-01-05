'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pencil, Loader2 } from 'lucide-react'
import promptService from '@/commons/services/PromptService'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { PromptUpdate } from '@/commons/models/PromptModels'
import { SPromptUpdate } from '@/commons/models/PromptModels'
import useAdminPromptUpdate from '../lib/hooks/useAdminPromptUpdate'
import { toast } from 'sonner'

const formSchema = z.object({
    promptName: z.string().min(1, {
        message: "Prompt boş olamaz.",
    }),
    promptState: z.boolean()
})

interface EditPromptDialogProps {
    promptId: number;
    promptName: string;
    promptState: boolean;
    onSuccess: () => void;
}

export function EditPromptDialog({ promptId, promptName, promptState, onSuccess }: EditPromptDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<PromptUpdate>({
        resolver: zodResolver(SPromptUpdate),
        defaultValues: {
            promptId: promptId,
            promptName: promptName,
            promptState: promptState
        },
    })

    useEffect(() => {
        form.reset({
            promptId: promptId,
            promptName: promptName,
            promptState: promptState
        })
    }, [promptId, promptName, promptState])

    const mutation = useAdminPromptUpdate(() => {
        toast.success("Prompt başarıyla güncellendi.")
        setIsOpen(false)
        onSuccess()
    }, () => {
        toast.error("Prompt güncellenirken bir hata oluştu.")
    })

    const onSubmit = async (values: PromptUpdate) => {
        mutation.mutate({
            promptId: promptId,
            promptName: values.promptName,
            promptState: values.promptState
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Prompt Düzenle</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="promptName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Prompt adını girin..."
                                            className="min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="promptState"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <span>Pasif</span>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <span>Aktif</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="min-w-[100px]"
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Kaydediliyor
                                    </>
                                ) : (
                                    'Kaydet'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 