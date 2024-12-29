'use client'

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query'
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

const LoginLayout = () => {
    interface LoginFormInputs {
        username: string;
        password: string;
        location: { label: string; value: string };
    }
    const router = useRouter()
    const { showToast } = useToast();
    const { onSetAuthenticated, onSetUser } = useAuth();



    const { handleSubmit, control, formState: { errors } } = useForm<LoginFormInputs>({
        defaultValues: {
            username: '',
            password: '',
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)

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


    const onSubmit = async (data: {
        username: string;
        password: string;
        location: { label: string; value: string };
    }) => {
        if (!data.location.value) {
            showToast('Lütfen bir lokasyon seçiniz', 'error');
            return;
        }
        if (!data.username || !data.password) {
            showToast('Kullanıcı adı ve şifre alanlarını doldurunuz', 'error');
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
                className="bg-white p-8  rounded-lg shadow-2xl w-96 h-[420px] relative overflow-hidden  "
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-6 justify-center flex items-center "
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
                    <motion.h1 className="text-4xl font-extrabold  text-center text-black items-end">
                        Point AI
                    </motion.h1>
                    Hoş Geldiniz
                </motion.h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Controller
                            name="location"
                            control={control}
                            defaultValue={{ label: '', value: '' }}
                            render={({ field }) => (
                                <Combobox
                                    selected={String(field.value.label)}
                                    options={
                                        convertObjectArrayToOptions(
                                            locationQuery.data?.data || [],
                                            'locationId',
                                            'locationName'
                                        )
                                    }
                                    onChange={(option) => field.onChange(option)}
                                    placeholder='Lokasyon Seçiniz'
                                />
                            )}
                        />
                        {errors.location && <span>This field is required</span>}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Controller
                            name="username"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <Input {...field} placeholder="Kullanıcı Adı" className="w-full px-4 py-2 rounded border border-primary focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />}
                        />
                        {errors.username && <span>This field is required</span>}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        className="relative"
                    >
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
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
                            )}
                        />
                        {errors.password && <span>This field is required</span>}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className='flex justify-end flex-col pt-3'
                    >
                        <Button
                            type="submit"
                            className="w-full  bg-red-600 text-white py-2 rounded hover:bg-black transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
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
                        <Button
                            type="button"
                            variant="link"
                            className="mb-2 text-sm text-gray-600 hover:text-red-600"
                            onClick={() => router.push('forgot-password')}
                        >
                            Şifremi Unuttum
                        </Button>
                    </motion.div>
                </form>

            </motion.div>
        </div>
    );
};

export default LoginLayout;
