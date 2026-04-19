"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Sprout, 
  ShieldAlert, 
  MessageSquare, 
  MapPin, 
  ClipboardList, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Menu
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Disease Intelligence",
    href: "/dashboard/disease-scan",
    icon: Sprout,
  },
  {
    title: "Risk Advisor",
    href: "/dashboard/risk-intel",
    icon: ShieldAlert,
  },
  {
    title: "Farmer Copilot",
    href: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    title: "Supplier Finder",
    href: "/dashboard/suppliers",
    icon: MapPin,
  },
  {
    title: "Crop Records",
    href: "/dashboard/records",
    icon: ClipboardList,
  },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
        <SidebarHeader className="h-16 flex items-center px-6">
          <Link href="/" className="flex items-center gap-2 font-headline font-bold text-xl text-sidebar-primary">
            <Sprout className="h-6 w-6" />
            <span className="group-data-[collapsible=icon]:hidden">TUAI</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.title}
                  className={cn(
                    "h-11 transition-all duration-200",
                    pathname === item.href ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-sidebar-foreground/70 hover:text-destructive">
                <Link href="/login">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-[1px] bg-border mx-2" />
            <h1 className="font-headline font-semibold text-lg text-primary">
              {navItems.find(item => item.href === pathname)?.title || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end">
               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Region</span>
               <span className="text-sm font-semibold">Selangor, Malaysia</span>
             </div>
             <Button variant="outline" size="sm" className="rounded-full px-4 border-primary text-primary hover:bg-primary/10">
               Support
             </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F0F4F6]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}