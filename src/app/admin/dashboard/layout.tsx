'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import SideBar from './_components/side-bar'
import NavBar from './_components/nav-bar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <TooltipProvider>
            <div className="grid h-screen w-full pl-[56px]">
                <SideBar />
                <div className="flex flex-col">
                    
                    <NavBar />
                    {children}
                </div>
            </div>
        </TooltipProvider>
    )
}
