"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserRound, GraduationCap } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export default function ProfileSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border">
        <div className="px-3 pt-20">
          <h1 className="text-xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your profile settings</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/mentor-profile"}>
              <Link href="/createProfile/mentor-profile">
                <UserRound className="h-5 w-5" />
                <span>Mentor Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/learner-profile"}>
              <Link href="/createProfile/learner-profile">
                <GraduationCap className="h-5 w-5" />
                <span>Learner Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
