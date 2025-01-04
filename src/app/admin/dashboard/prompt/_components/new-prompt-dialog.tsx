'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Plus, Loader2 } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import promptService from '@/commons/services/PromptService'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Switch } from '@/components/ui/switch'
import { PromptInsert, SPromptInsert } from '@/commons/models/PromptModels'
import useAdminPromptInsert from '../lib/hooks/useAdminPromptInsert'
import { toast } from 'sonner'



interface NewPromptDialogProps {
    onSuccess: () => void;
}

export function NewPromptDialog({ onSuccess }: NewPromptDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<PromptInsert>({
        resolver: zodResolver(SPromptInsert),
        defaultValues: {
        },
    })

    const mutation = useAdminPromptInsert(
        () => {
            toast.success("Prompt başarıyla eklendi.")
            form.reset()
            setIsOpen(false)
            onSuccess()
        },
        () => {
            toast.error("Prompt eklenirken bir hata oluştu.")
        }
    )

    const onSubmit = async (values: PromptInsert) => {
        mutation.mutate(values)
        form.reset()
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Ekle
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yeni Prompt</DialogTitle>
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
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="min-w-[100px]"
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Ekleniyor
                                    </>
                                ) : (
                                    'Ekle'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 