import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout"
import type React from "react"

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
