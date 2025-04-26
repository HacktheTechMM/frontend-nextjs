'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar, navigationItems } from '@/components/layout/app-sidebar'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserDropdown } from '@/components/user-dropdown'
import { MobileNavigation } from '@/components/layout/mobile-navigation'

interface AuthenticatedLayoutProps {
    children: React.ReactNode
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token')

            if (!token) {
                logout()
                return
            }

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                // You can store user info in context/state if needed
                console.log('Authenticated user:', response.data)
                setLoading(false)
            } catch (error) {
                console.error('Authentication failed:', error)
                logout()
            }
        }

        const logout = () => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/login')
        }

        checkAuth()
    }, [router])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Checking authentication...</p>
            </div>
        )
    }
g
    return <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger className="hidden md:flex" />
                <Separator orientation="vertical" className="h-6 hidden md:flex" />
                <div className="flex justify-between w-full items-center">
                    <div className="font-semibold">Dashboard</div>
                    <div className="flex items-center gap-x-4">
                        <ThemeToggle />
                        <UserDropdown />
                    </div>
                </div>
            </header>
            <main className="flex-1 py-10 md:pb-6">{children}</main>
            <MobileNavigation items={navigationItems} />
        </SidebarInset>
    </SidebarProvider>
}

export default AuthenticatedLayout
