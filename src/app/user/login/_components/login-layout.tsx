'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, Shield } from 'lucide-react';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarImage } from '@/components/ui/avatar';
import generalService from '@/commons/services/GeneralService';
import { Combobox } from '@/components/ui/combobox';
import { convertObjectArrayToOptions } from '@/commons/utils/convertObjectArrayToOptions';
import authService from '@/commons/services/AuthService';
import { useRouter } from 'next/navigation';
import tokenService from '@/commons/services/TokenService';
import { UserLogin } from '@/commons/models/AuthModels';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/authContext';
import { z } from 'zod';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useMutation, useQuery } from '@tanstack/react-query'
import Link from 'next/link';

const formSchema = z.object({
    username: z.string().min(3, { message: "Kullanıcı adı en az 3 karakter olmalıdır" }),
    password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır" }),
    location: z.object({ label: z.string(), value: z.string() })
});

const LoginLayout = () => {
    const router = useRouter()
    const { showToast } = useToast();
    const { onSetAuthenticated, onSetUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            location: { label: "", value: "" }
        },
    })

    const locationQuery = useQuery({
        queryKey: ['location'],
        queryFn: generalService.getLocation,
    });

    useEffect(() => {
        const authToken = !tokenService.isAccessTokenExpired();
        if (authToken) {
            router.push("/user/login");
        }
    }, [router]);

    const loginUserMutation = useMutation({
        mutationKey: ["user-login"],
        mutationFn: (data: UserLogin) => authService.userLogin(data),
        onSuccess: (data) => {
            onSetAuthenticated(true);
            onSetUser(data);
            router.push("/user/chat");
        },
        onError: () => {
            showToast("Hatalı giriş, Lütfen tekrar deneyiniz.", 'error');
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!data.location.value) {
            showToast('Lütfen bir lokasyon seçiniz', 'error');
            return;
        }
        setIsLoading(true);
        loginUserMutation.mutate({
            username: data.username,
            password: data.password,
            locationId: data.location.value
        });
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative">
            <div className="absolute top-4 right-4">
                <Shield className="h-10 w-10 text-red-600 hover:bg-red-600 rounded-full p-1 bg-opacity-20 hover:bg-opacity-100  hover:text-white cursor-pointer transition-all duration-300" onClick={() => router.push('/admin/login')} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-2xl w-96 h-[420px] relative overflow-hidden"
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-6 justify-center flex items-center"
                >
                    <Avatar>
                        <AvatarImage alt="Logo" />
                    </Avatar>
                </motion.div>

                <motion.div
                    className="absolute inset-0 bg-red-600"
                    initial={{ height: '100%' }}
                    animate={{ height: '5px' }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                />
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-3xl font-semibold mb-6 text-center text-black items-end"
                >
                    <motion.h1 className="text-4xl font-extrabold text-center text-black items-end">
                        Point AI
                    </motion.h1>
                    Hoş Geldiniz
                </motion.h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Combobox
                                                selected={String(field.value.label)}
                                                options={convertObjectArrayToOptions(
                                                    locationQuery.data?.data || [],
                                                    'locationId',
                                                    'locationName'
                                                )}
                                                onChange={(option) => field.onChange(option)}
                                                placeholder='Lokasyon Seçiniz'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Kullanıcı Adı"
                                                className="w-full px-4 py-2 rounded border border-primary focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                            className="relative"
                        >
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    {...field}
                                                    placeholder="Şifre"
                                                    className="w-full px-4 py-2 rounded border border-primary focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="" />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className='flex justify-center items-center flex-col pt-3 gap-5'
                        >
                            <Button
                                type="submit"
                                className="w-full bg-red-600 text-white py-2 rounded hover:bg-black transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Giriş yapılıyor...
                                    </>
                                ) : (
                                    'Giriş Yap'
                                )}
                            </Button>
                            <Link
                                href="/user/forgot-password"
                                className="text-sm text-primary hover:text-rose-700"
                            >
                                Şifremi unuttum
                            </Link>
                        </motion.div>
                    </form>
                </Form>
            </motion.div>
        </div>
    );
};

export default LoginLayout;
