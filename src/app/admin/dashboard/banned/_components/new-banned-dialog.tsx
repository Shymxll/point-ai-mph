'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/context/ToastContext"
import { useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import bannedService from "@/commons/services/BannedService"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { BannedMainManager } from "@/commons/models/BannedModels"
import { Switch } from "@/components/ui/switch"
import { useAdminBannedInsert } from "../lib/hooks/useAdminBannedInsert"
import { DialogOverlay } from "@radix-ui/react-dialog"
import { toast } from "sonner"



interface NewBannedDialogProps {
    onSuccess: () => void;
}

export function NewBannedDialog({ onSuccess }: NewBannedDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<BannedMainManager>({
        defaultValues: {
            bannedName: "",
        }
    })

    const addMutation = useAdminBannedInsert(
        () => {
            toast.success("Yasaklı prompt başarıyla eklendi")
            form.reset()
            setIsOpen(false)
            onSuccess()
        },
        () => {
            toast.error("Yasaklı prompt eklenirken bir hata oluştu")
        }
    )

    function onSubmit(values: BannedMainManager) {
        addMutation.mutate({
            bannedId: 0,
            bannedName: values.bannedName,
            bannedState: !values.bannedState
        })
        form.reset()
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogOverlay className="bg-red-100/30 backdrop-blur-lg" />
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Ekle
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yeni Yasaklı Prompt</DialogTitle>
                    <DialogDescription>
                        Sisteme yeni bir yasaklı prompt ekleyin.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="bannedName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Yasaklamak istediğiniz promptu girin..."
                                            className="min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Bu prompt sistem genelinde yasaklanacaktır.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bannedState"
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
                                disabled={addMutation.isPending}
                                className="min-w-[100px]"
                            >
                                {addMutation.isPending ? (
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