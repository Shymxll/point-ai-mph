'use client'

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, User } from 'lucide-react';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarImage } from '@/components/ui/avatar';
import authService from '@/commons/services/AuthService';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/authContext';
import { convertObjectArrayToOptions } from '@/commons/utils/convertObjectArrayToOptions';
import Combobox from '@/components/ui/combobox';
import generalService from '@/commons/services/GeneralService';
import { UserLogin } from '@/commons/models/AuthModels';
import useAdminLogin from './lib/hooks/useAdminLogin';
import { toast } from 'sonner';

interface AdminLoginFormInputs {
    locationId: { label: string; value: string };
    username: string;
    password: string;
}

export default function AdminLoginPage() {
    const router = useRouter()
    const { onSetAuthenticated, onSetUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, formState: { errors } } = useForm<AdminLoginFormInputs>({
        defaultValues: {
            locationId: { label: '', value: '' },
            username: '',
            password: '',
        }
    });

    const locationQuery = useQuery({
        queryKey: ['location'],
        queryFn: generalService.getLocation,
    });

    const adminLoginMutation = useAdminLogin();


    const onSubmit = async (data: AdminLoginFormInputs) => {
        if (!data.username || !data.password) {
            toast.error('Kullanıcı adı ve şifre alanlarını doldurunuz');
            return;
        }
        adminLoginMutation.mutate({
            username: data.username,
            password: data.password,
            locationId: data.locationId.value
        });
        setIsLoading(true);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="absolute top-4 left-4">
                <User className="h-10 w-10 text-red-600 hover:bg-red-600 rounded-full p-1 bg-opacity-20 hover:bg-opacity-100  hover:text-white cursor-pointer transition-all duration-300" onClick={() => router.push('/user/login')} />
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-2xl w-96 h-[380px] relative overflow-hidden"
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
                    Admin Panel
                </motion.h1>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Controller
                            name="locationId"
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
                        {errors.locationId && <span>This field is required</span>}
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
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Admin Kullanıcı Adı"
                                    className="w-full px-4 py-2 rounded border border-primary focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            )}
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
                            className="w-full bg-red-600 text-white py-2 rounded hover:bg-black transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Giriş yapılıyor...
                                </>
                            ) : (
                                'Admin Girişi'
                            )}
                        </Button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
} 