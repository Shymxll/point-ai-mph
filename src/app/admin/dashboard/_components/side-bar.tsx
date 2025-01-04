'use client'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Home, LogOut, StopCircle, Triangle } from 'lucide-react'
import { SquareTerminal, Bot, Code2, Book, Settings2, LifeBuoy, SquareUser } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import ProfilDropDownMenu from './profil-drop-down-menu'

export default function SideBar() {
    const router = useRouter()
    const pathname = usePathname()

    const menuItems = [
        {
            icon: <Home className="size-5" />,
            label: "Ana Sayfa",
            path: "/admin/dashboard"
        },
        {
            icon: <SquareTerminal className="size-5" />,
            label: "Oyun Alanı",
            path: "/admin/dashboard/playground"
        },
        {
            icon: <Book className="size-5" />,
            label: "Dokümantasyon",
            path: "/admin/dashboard/docs"
        },
        {
            icon: <Settings2 className="size-5" />,
            label: "Ayarlar",
            path: "/admin/dashboard/settings"
        },
        {
            icon: <StopCircle className="size-5" />,
            label: "Yasaklı",
            path: "/admin/dashboard/banned"
        },
        {
            icon: <Code2 className="size-5" />,
            label: "Komut",
            path: "/admin/dashboard/prompt"
        }
    ]

    const bottomMenuItems = [
        {
            icon: <LifeBuoy className="size-5" />,
            label: "Yardım",
            path: "/admin/dashboard/help"
        },
        {
            icon: <SquareUser className="size-5" />,
            label: "Profil",
            path: "/admin/dashboard/account"
        }
    ]

    return (
        <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
            <div className="border-b p-2">
                <Button
                    variant="outline"
                    size="icon"
                    aria-label="Home"
                    onClick={() => router.push('/admin/dashboard')}
                >
                    <Image src="/mphLogo.png" alt="Logo" width={20} height={20} />
                </Button>
            </div>
            <nav className="grid gap-1 p-2">
                {menuItems.map((item, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`rounded-lg ${pathname === item.path ? 'bg-muted' : ''}`}
                                aria-label={item.label}
                                onClick={() => router.push(item.path)}
                            >
                                {item.icon}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={5}>
                            {item.label}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </nav>
            <nav className="mt-auto grid gap-1 p-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ProfilDropDownMenu />
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                        Profil
                    </TooltipContent>
                </Tooltip>
            </nav>
        </aside>
    )
}
