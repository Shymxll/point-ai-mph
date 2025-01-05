'use client'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import ProfilDropDownMenu from './profil-drop-down-menu'
import { menuItems, bottomMenuItems } from '@/commons/consts/adminMenuItems'

export default function SideBar() {
    const router = useRouter()
    const pathname = usePathname()

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
                                <item.icon className="size-5" />
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
