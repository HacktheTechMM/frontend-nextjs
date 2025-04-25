import type React from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import AuthenticatedLayout from "../AuthenticatedLayout"
import { AppSidebar, navigationItems } from "@/components/layout/app-sidebar"
import { MobileNavigation } from "@/components/layout/mobile-navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserDropdown } from "@/components/user-dropdown"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthenticatedLayout>
            
                    {children}
                    
        </AuthenticatedLayout>
    )
}
