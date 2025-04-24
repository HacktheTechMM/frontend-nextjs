'use client'

import { Calendar, Home, Inbox, Search, Settings, BotMessageSquare, NotebookPen } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { SideBarNavUser } from "./components/sidebar-nav-user"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "AI Mentor",
    url: "/chats",
    icon: BotMessageSquare,
    matchPattern: "/chats"
  },
  {
    title: "Test",
    url: "/chat/test",
    icon: Inbox,
    matchPattern: "/chat/test"
  },
  {
    title: "Discussion",
    url: "/chat/discussion",
    icon: Calendar,
    matchPattern: "/chat/discussion"
  },
  {
    title: "Take Quizz",
    url: "/chats/quizz",
    icon: NotebookPen,
    matchPattern: "/chats/quizz"
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    matchPattern: "/settings"
  },
]

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()

    const isActive = (itemUrl: string, itemMatchPattern: string) => {
      // Exact match
      if (pathname === itemUrl) return true
      
      // Nested route match (e.g., /chats/123 should match /chats)
      if (itemUrl !== '/' && pathname.startsWith(itemUrl)) {
        // Special case for /chats to not match /chats/quizz
        if (itemUrl === '/chats' && pathname.startsWith('/chats/quizz')) {
          return false
        }
        return true
      }
      
      // Match by pattern if provided
      if (itemMatchPattern && pathname.startsWith(itemMatchPattern)) {
        return true
      }
      
      return false
    }

    return (
        //* SM size
        <div className="flex flex-col min-h-screen md:flex-row">
            {/* Mobile Navigation (shown on sm screens) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
                <div className="flex justify-around py-2">
                    {items.map((item) => {
                        const active = isActive(item.url, item.matchPattern)

                        return (
                            <Link href={item.url} key={item.title} className="w-full">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "flex flex-col items-center gap-1 p-2 w-full",
                                        active && "bg-gray-300 hover:bg-gray-400 dark:bg-primary dark:text-black dark:hover:bg-primary/80"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5", active && "text-black")} />
                                    <span className="text-xs">{item.title}</span>
                                </Button>
                            </Link>
                        )
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-auto pb-16 md:pb-0">
                {children}
            </div>

            {/* Desktop Sidebar (shown on md screens and above) */}
            <SidebarProvider className="hidden md:flex md:mt-20 md:space-x-5">
                <div className="flex flex-col h-auto">
                    <Sidebar collapsible="icon" className="rounded-2xl overflow-hidden mt-20">
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupLabel className="text-xl font-bold mb-5">
                                    Learn With Us
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {items.map((item) => {
                                            const active = isActive(item.url, item.matchPattern)
                                            return (
                                                <SidebarMenuItem key={item.title}>
                                                    <Link href={item.url} className="w-full">
                                                        <Button
                                                            variant="ghost"
                                                            className={cn(
                                                                "cursor-pointer w-full dark:bg-accent dark:text-white dark:hover:bg-accent/80 p-5.5 mb-3 justify-start",
                                                                active && "bg-gray-300 hover:bg-gray-400 dark:bg-primary dark:text-black dark:hover:bg-primary/80"
                                                            )}
                                                        >
                                                            <div className="flex flex-row items-center">
                                                                <item.icon className={cn(active && "text-black")} />
                                                                <span className={cn("ml-2", active && "font-semibold")}>
                                                                    {item.title}
                                                                </span>
                                                            </div>
                                                        </Button>
                                                    </Link>
                                                </SidebarMenuItem>
                                            )
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                        <SidebarFooter className="mt-auto mb-20">
                            <SideBarNavUser
                                user={{
                                    name: "User Name",
                                    email: "user@example.com",
                                    avatar: "path/to/avatar.jpg"
                                }}
                            />
                        </SidebarFooter>
                    </Sidebar>
                </div>
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </SidebarProvider>
        </div>
    )
}

export default ChatLayout