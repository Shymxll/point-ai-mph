'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChangeUserPassword, SChangeUserPassword } from "@/commons/models/AuthModels"
import { useUserChangeUserPassword } from "@/app/user/chat/libs/hooks/useUserChangeUserPassword"
import { useAuth } from "@/context/authContext"
import React, { useEffect } from "react"
import authService from "@/commons/services/AuthService"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ChangePasswordDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
    const auth = useAuth()
    const router = useRouter()

    const form = useForm<ChangeUserPassword>({
        resolver: zodResolver(SChangeUserPassword),
        defaultValues: {
            userId: auth.user?.userId,
            oldPassword: "",
            newPassword: "",
            duplicateNewPassword: "",
        },
    })

    useEffect(() => {
        if (auth.user) {
            form.setValue("userId", auth.user.userId)
        }
    }, [auth.user])

    const changePasswordMutation = useUserChangeUserPassword(
        () => {
            form.reset()
            toast.success("Şifre değiştirildi!")
            onOpenChange(false)
            authService.logout()
            router.push('/admin/login')
        },
        (error) => {
            toast.error("Başarısız işlem!")
        }
    )

    const onSubmit = async (data: ChangeUserPassword) => {
        try {
            changePasswordMutation.mutate(data)
        } catch (error) {
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogOverlay className="bg-red-100/30 backdrop-blur-sm " />
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>Şifre Değiştir</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mevcut Şifre</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Yeni Şifre</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="duplicateNewPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Yeni Şifre (Tekrar)</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                İptal
                            </Button>
                            <Button type="submit">Değiştir</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 