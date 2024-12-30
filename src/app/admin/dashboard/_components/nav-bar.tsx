'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export default function NavBar() {
    const pathname = usePathname()

    const getNavigationItems = () => {
        const paths = pathname.split('/').filter(Boolean)
        const items = paths.map((path) => {
            return path.charAt(0).toUpperCase() + path.slice(1)
        })
        return items
    }

    const navigationItems = getNavigationItems()

    return (
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {navigationItems.map((item, index) => (
                    <div key={index} className="flex items-center">
                        {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                        <span className={index === navigationItems.length - 1 ? "font-medium text-foreground border p-1 rounded-md hover:bg-gray-100  border-b-2 border-b-foreground" : ""}>
                            {item}
                        </span>
                    </div>
                ))}
            </div>
        </header>
    )
}
