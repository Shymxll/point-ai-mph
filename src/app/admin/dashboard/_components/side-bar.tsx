'use client'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Home, Triangle } from 'lucide-react'
import { SquareTerminal, Bot, Code2, Book, Settings2, LifeBuoy, SquareUser } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

export default function SideBar() {
    const router = useRouter()
    const pathname = usePathname()

    const menuItems = [
        {
            icon: <Home className="size-5" />,
            label: "Dashboard",
            path: "/admin/dashboard"
        },
        {
            icon: <SquareTerminal className="size-5" />,
            label: "Playground",
            path: "/admin/dashboard/playground"
        },
        {
            icon: <Book className="size-5" />,
            label: "Documentation",
            path: "/admin/dashboard/docs"
        },
        {
            icon: <Settings2 className="size-5" />,
            label: "Settings",
            path: "/admin/dashboard/settings"
        }
    ]

    const bottomMenuItems = [
        {
            icon: <LifeBuoy className="size-5" />,
            label: "Help",
            path: "/admin/dashboard/help"
        },
        {
            icon: <SquareUser className="size-5" />,
            label: "Account",
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
                {bottomMenuItems.map((item, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`mt-auto rounded-lg ${pathname === item.path ? 'bg-muted' : ''}`}
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
        </aside>
    )
}
