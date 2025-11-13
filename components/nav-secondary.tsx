"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"

import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {

  const pathname = usePathname()
  // Helper function to check if current path matches or is a child of the item path
  const isActive = (itemUrl: string) => {
    if (itemUrl === '/') {
      return pathname === '/'
    }
    return pathname === itemUrl || pathname.startsWith(itemUrl + '/')
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
        {items.map((item) => {
            const active = isActive(item.url)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title} 
                  isActive={active}
                  className={active ? "bg-green-500 text-white hover:bg-green-600 data-[active=true]:bg-green-500" : ""}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
