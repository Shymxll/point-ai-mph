'use client'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from 'lucide-react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import authService from "@/commons/services/AuthService"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/authContext" // auth.user'ı almak için authContext kullanımı

export function Navbar() {
    const auth = useAuth() // Kullanıcı bilgilerini almak için context'ten auth'u çağırıyoruz
    const router = useRouter()

    return (
        <nav className="border-b">
            <div className="flex h-14 items-center justify-between px-4 bg-primary">
                <SidebarTrigger
                    className="bg-gray-100 text-black rounded-full p-2"
                />
                <div className="ml-auto flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-3 w-3 mx-5 rounded-full">
                            <Avatar>
                                {/* Kullanıcı avatarını görüntülemek için IconName'i kullanıyoruz */}
                                <AvatarImage alt="Kullanıcı" />
                                <AvatarFallback className="font-bold">
                                    {auth.user?.iconName || 'MPH'}
                                </AvatarFallback>
                            </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    authService.logout()
                                    router.push('/login')
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Çıkış Yap</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}
