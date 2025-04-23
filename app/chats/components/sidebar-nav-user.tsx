"use client"

import {
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar"

export function SideBarNavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
    </SidebarMenu>
  )
}
