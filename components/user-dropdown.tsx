// components/user-dropdown.tsx
'use client'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export function UserDropdown() {


  const logout = ()=>{
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    // localStorage.removeItem("user_id");

    // redirect("/login")

    console.log("hello")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="/avatar.png" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem><Link href={'/createProfile'}>Profile</Link></DropdownMenuItem>
        <DropdownMenuItem><Link href={'/profile/account'}>Account</Link></DropdownMenuItem>
        <DropdownMenuItem className="text-red-500">
          <LogOut className="mr-2 size-4" onClick={logout}/> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
