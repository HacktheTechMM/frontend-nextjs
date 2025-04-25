"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BotMessageSquare, Brain, ChevronRight, Code, Home, LaptopMinimalCheck, LayoutDashboard, Settings, UserRoundSearch, Users } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "../theme-toggle"
import { UserDropdown } from "../user-dropdown"

// Navigation items with icons - exported for reuse in mobile navigation
export const navigationItems = [
    {
        title: "AI Mentor",
        icon: BotMessageSquare,
        url: "/chats",
    },
    {
        title: "Mentor Session",
        icon: UserRoundSearch,
        url: "/chats/mentorship",
    },
    {
        title: "Code Test",
        icon: Code,
        url: "/chats/code-test",
    },
    {
        title: "Quiz",
        icon: Brain,
        url: "/chats/quizz",
    },
    {
        title: "AI Interview",
        icon: LaptopMinimalCheck,
        url: "/interviews",
    },
]

// Navigation sections with collapsible sub-items
const navigationSections = [
    {
        title: "Analytics",
        items: [
            { title: "Overview", url: "/analytics" },
            { title: "Reports", url: "/analytics/reports" },
            { title: "Metrics", url: "/analytics/metrics" },
        ],
    },
    {
        title: "Content",
        items: [
            { title: "Pages", url: "/content/pages" },
            { title: "Blog", url: "/content/blog" },
            { title: "Media", url: "/content/media" },
        ],
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    // Check if a path is active
    const isActive = (path: string) => {
        return pathname === path
    }

    return (
        <Sidebar className="hidden md:flex" collapsible="icon">
            <SidebarHeader className="border-b p-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <LayoutDashboard className="h-4 w-4" />
                    </div>
                    {/* <span className="font-semibold">AppName</span> */}
                </div>
            </SidebarHeader>
            <SidebarContent>
                {/* Main navigation items */}
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                                        <Link href={item.url} className="flex items-center gap-2">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Collapsible sections */}
                {navigationSections.map((section) => (
                    <Collapsible key={section.title} className="group/collapsible">
                        <SidebarGroup>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger className="flex w-full items-center justify-between">
                                    {section.title}
                                    <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />


                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {section.items.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                                                    <Link href={item.url}>{item.title}</Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                ))}
            </SidebarContent>
            <SidebarFooter className="border-t p-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted"></div>
                    <div className="flex flex-col text-sm">
                        <span className="font-medium">John Doe</span>
                        <span className="text-muted-foreground">john@example.com</span>
                    </div>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
