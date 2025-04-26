"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type NavigationItem = {
    title: string
    icon: React.ComponentType<{ className?: string }>
    url: string
    matchPattern?: RegExp
}

interface MobileNavigationProps {
    items: NavigationItem[]
}

export function MobileNavigation({ items }: MobileNavigationProps) {
    const pathname = usePathname()

    // Check if a path is active
    const isActive = (path: string, pattern?: RegExp) => {
        if (pattern) {
            return pattern.test(pathname)
        }
        return pathname === path
    }

    return (
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
                                    active && "",
                                )}
                            >
                                <div className={cn("flex items-center justify-center", active ? "text-primary border p-2 rounded border-primary" : "opacity-70")}>
                                    <item.icon className={cn("h-5 w-5", active && "text-primary")} />
                                </div>
                                {/* <span className="text-xs">{item.title}</span> */}
                            </Button>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
