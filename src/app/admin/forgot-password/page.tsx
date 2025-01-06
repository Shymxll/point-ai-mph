'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import Link from 'next/link'
import useUserForgetPassword from '@/app/user/forgot-password/lib/hooks/useUserForgetPassword'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    const forgetPasswordMutation = useUserForgetPassword(
        () => {
            toast.success("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.")
            router.push('/admin/login')
            setEmail('')
        },
        (error: string) => {
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.")
        }
    )
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        forgetPasswordMutation.mutate(email)
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center">
                    <Image
                        src="/mphLogo.png"
                        alt="MPH Logo"
                        width={150}
                        height={150}
                        className="mb-8"
                    />
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                        Şifrenizi mi unuttunuz?
                    </h2>
                    <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
                        E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder="E-posta adresiniz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2"
                        />
                    </div>

                    {message && (
                        <p className={`text-sm text-center ${message.includes('hata') ? 'text-red-500' : 'text-green-500'
                            }`}>
                            {message}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-rose-700 text-white"
                    >
                        {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
                    </Button>

                    <div className="text-center">
                        <Link
                            href="/admin/login"
                            className="text-sm text-primary hover:text-rose-700"
                        >
                            Giriş sayfasına dön
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
} 