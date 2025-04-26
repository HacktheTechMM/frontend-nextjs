import { Metadata } from "next"
import Image from "next/image"
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout"

// import { Separator } from "@/registry/new-york/ui/separator"
import { Separator } from "@/components/ui/separator" 
// import { SidebarNav } from "@/app/(app)/examples/forms/components/sidebar-nav"
import { SidebarNav } from "./components/sidebar-nav" 
export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Account",
    href: "/profile/account",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <AuthenticatedLayout>
      <div className=" space-y-12 p-10 md:pt-0 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
      </AuthenticatedLayout>
    </>
  )
}
