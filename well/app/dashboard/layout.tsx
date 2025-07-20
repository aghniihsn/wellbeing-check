"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Smile,
  Users,
  X,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Teams",
    href: "/dashboard/teams",
    icon: Users,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: Calendar,
  },
  {
    title: "Mood Dashboard",
    href: "/dashboard/mood",
    icon: Smile,
  },
  {
    title: "Check-in/out",
    href: "/dashboard/checkin",
    icon: CheckCircle,
  },
  {
    title: "Comfort Tips",
    href: "/dashboard/tips",
    icon: MessageSquare,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },

]

const memberNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Check-in/out",
    href: "/dashboard/checkin",
    icon: CheckCircle,
  },
  {
    title: "Comfort Tips",
    href: "/dashboard/tips",
    icon: MessageSquare,
  },

]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  }, [isMobile])

  useEffect(() => {
    // Jika user belum login, redirect ke login setelah loading selesai
    if (!isLoading && user === null) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  // Pilih navItems sesuai role
  let navItems: NavItem[] = [];
  if (user?.role === "project_manager" || user?.role === "admin") {
    navItems = [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
      },
      {
        title: "Teams",
        href: "/dashboard/teams",
        icon: Users,
      },
      {
        title: "Projects",
        href: "/dashboard/projects",
        icon: Calendar,
      },
      {
        title: "Check-in/out",
        href: "/dashboard/checkin",
        icon: CheckCircle,
      },
      {
        title: "Comfort Tips",
        href: "/dashboard/tips",
        icon: MessageSquare,
      },
      {
        title: "Reports",
        href: "/dashboard/reports",
        icon: BarChart3,
      },
    ];
  } else if (user?.role === "member") {
    navItems = [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
      },
      {
        title: "Check-in/out",
        href: "/dashboard/checkin",
        icon: CheckCircle,
      },
      {
        title: "Comfort Tips",
        href: "/dashboard/tips",
        icon: MessageSquare,
      },
    ];
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r bg-background transition-transform duration-300 md:static",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20",
        )}
      >
        <div className="flex h-16 items-center border-b px-4">
          <div className={cn("flex items-center gap-2 font-bold text-xl", !isSidebarOpen && "md:hidden")}>
            <span className="text-primary">Well</span>Check
          </div>
          <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                  pathname === item.href && "bg-muted",
                  !isSidebarOpen && "md:justify-center md:px-0",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className={cn("", !isSidebarOpen && "md:hidden")}>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <div className={cn("flex items-center gap-3", !isSidebarOpen && "md:justify-center")}> 
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col", !isSidebarOpen && "md:hidden")}> 
              <span className="text-sm font-medium">{user?.name ?? "User"}</span>
              <span className="text-xs text-muted-foreground">{user?.email ?? "-"}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 z-10 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-auto flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <div className="flex items-center gap-2 md:hidden">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                  </Avatar>
                </div>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs">
                <nav className="grid gap-4 py-4">
                  <div className="flex items-center gap-4 px-2">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                      <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                      <div className="font-medium">{user?.name ?? "User"}</div>
                      <div className="text-sm text-muted-foreground">{user?.email ?? "-"}</div>
                    </div>
                  </div>
                  <div className="grid gap-2 px-2">
                    <button
                      onClick={() => logout()}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden gap-2 md:flex">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                  </Avatar>
                  <span>{user?.name ?? "User"}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
