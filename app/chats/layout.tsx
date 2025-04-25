"use client"

import type React from "react"

import { Calendar, Inbox, Settings, BotMessageSquare, NotebookPen, PanelLeftClose, Code } from "lucide-react"
import { usePathname } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    useSidebar,
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
        matchPattern: "/chats",
    },
    {
        title: "Test",
        url: "/chat/test",
        icon: Inbox,
        matchPattern: "/chats/test",
    },
    {
        title: "Discussion",
        url: "/chats/discussion",
        icon: Calendar,
        matchPattern: "/chats/discussion",
    },
    {
        title: "Take Quizz",
        url: "/chats/quizz",
        icon: NotebookPen,
        matchPattern: "/chats/quizz",
    },
    {
        title: "Code Test",
        url: "/chats/code-test",
        icon: Code,
        matchPattern: "/chats/code-test",
    },
]

// Custom sidebar trigger component with better positioning
const CustomSidebarTrigger = () => {
    const { state, toggleSidebar } = useSidebar()

    return (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="absolute top-4 right-0 z-10">
            <PanelLeftClose
                className={cn("h-5 w-5 transition-transform duration-200", state === "collapsed" && "rotate-180")}
            />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    )
}

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()

    const isActive = (itemUrl: string, itemMatchPattern: string) => {
        // Exact match
        if (pathname === itemUrl) return true
    
        // Special case: Don't let /chats match everything under /chats/*
        if (itemUrl === "/chats" && pathname.startsWith("/chats/")) {
            return false
        }
    
        // Match by pattern if provided
        if (itemMatchPattern && pathname.startsWith(itemMatchPattern)) {
            return true
        }
    
        // Nested route match for other cases (not /chats)
        if (itemUrl !== "/" && pathname.startsWith(itemUrl)) {
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
                                        active && "bg-gray-300 hover:bg-gray-400 dark:bg-primary dark:text-black dark:hover:bg-primary/80",
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5", active && "text-black dark:text-white")} />
                                    <span className="text-xs">{item.title}</span>
                                </Button>
                            </Link>
                        )
                    })}
                </div>
            </div>


            <div className="flex-1 overflow-auto pb-16 md:pb-0">{children}</div>

            {/* Desktop Sidebar (shown on md screens and above) */}
            <SidebarProvider className="hidden md:flex md:mt-20 md:space-x-5">
                <div className="flex flex-col h-auto relative">
                    <Sidebar collapsible="icon" className="rounded-2xl overflow-hidden mt-20">
                        {/* Custom sidebar trigger positioned inside the sidebar */}
                        <CustomSidebarTrigger />

                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupLabel className="text-xl font-bold mb-10">Learn With Us</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {items.map((item) => {
                                            const active = isActive(item.url, item.matchPattern)
                                            return (
                                                <SidebarMenuItem key={item.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={active}
                                                        tooltip={item.title}
                                                        className="p-0"
                                                    >
                                                        <Link href={item.url} className="w-full mb-5">
                                                            <Button
                                                                variant="ghost"
                                                                className={cn(
                                                                    "h-14 w-full justify-start px-4 transition-all duration-200",
                                                                    active
                                                                        ? "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
                                                                        : "hover:bg-accent/50",
                                                                    // Add this line to shift content left when collapsed
                                                                    "group-[.collapsed]:pl-3" // This will reduce padding-left when collapsed
                                                                )}
                                                            >
                                                                <div className="flex flex-row items-center group-[.collapsed]:ml-1"> {/* Added ml-1 when collapsed */}
                                                                    <item.icon className={cn(
                                                                        "transition-all duration-200",
                                                                        active && "text-black",
                                                                        "group-[.collapsed]:ml-1" // Shift icon slightly left when collapsed
                                                                    )} />
                                                                    <span className={cn(
                                                                        "ml-2 text-md transition-all duration-200",
                                                                        active && "font-semibold",
                                                                        "group-[.collapsed]:hidden" // Hide text when collapsed
                                                                    )}>
                                                                        {item.title}
                                                                    </span>
                                                                </div>
                                                            </Button>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            )
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                        <SidebarFooter className="mt-auto mb-96">
                            <SideBarNavUser
                                user={{
                                    name: "User Name",
                                    email: "user@example.com",
                                    avatar: "path/to/avatar.jpg",
                                }}
                            />
                        </SidebarFooter>
                    </Sidebar>

                </div>
                <div className="flex-1 overflow-auto">{children}</div>
            </SidebarProvider>
        </div>
    )
}

export default ChatLayout


