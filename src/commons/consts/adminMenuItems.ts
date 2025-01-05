import { Home, SquareTerminal, Book, Settings2, StopCircle, Code2, LifeBuoy, SquareUser } from 'lucide-react'

export const menuItems = [
    {
        icon: Home,
        label: "Ana Sayfa",
        path: "/admin/dashboard"
    },
    {
        icon: SquareTerminal,
        label: "Oyun Alanı",
        path: "/admin/dashboard/playground"
    },
    {
        icon: Book,
        label: "Dokümantasyon",
        path: "/admin/dashboard/docs"
    },
    {
        icon: Settings2,
        label: "Ayarlar",
        path: "/admin/dashboard/settings"
    },
    {
        icon: StopCircle,
        label: "Yasaklı",
        path: "/admin/dashboard/banned"
    },
    {
        icon: Code2,
        label: "Komut",
        path: "/admin/dashboard/prompt"
    }
]

export const bottomMenuItems = [
    {
        icon: LifeBuoy,
        label: "Yardım",
        path: "/admin/dashboard/help"
    },
    {
        icon: SquareUser,
        label: "Profil",
        path: "/admin/dashboard/account"
    }
]

export const getNavigationItems = (currentPath: string) => {
    const allItems = [...menuItems, ...bottomMenuItems]
    const currentItem = allItems.find(item => item.path === currentPath)

    if (!currentItem) return []

    // Ana sayfa her zaman ilk eleman olacak
    const breadcrumb = [menuItems[0]]

    // Eğer mevcut sayfa ana sayfa değilse, onu da ekle
    if (currentItem !== menuItems[0]) {
        breadcrumb.push(currentItem)
    }

    return breadcrumb
} 