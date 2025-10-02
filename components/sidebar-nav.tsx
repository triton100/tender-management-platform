"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Inbox,
  Search,
  Target,
  CheckSquare,
  FileText,
  BarChart3,
  FileCheck,
  FolderKanban,
  Settings,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tender Inbox",
    href: "/tenders",
    icon: Inbox,
  },
  {
    title: "SA Gov Tender Search",
    href: "/search",
    icon: Search,
  },
  {
    title: "Opportunities",
    href: "/opportunities",
    icon: Target,
    hasSubmenu: true,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Contracts",
    href: "/contracts",
    icon: FileCheck,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Administration",
    href: "/admin",
    icon: Settings,
    hasSubmenu: true,
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <span className="text-lg font-bold text-primary-foreground">BI</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-tight text-foreground">Bright Innovation</h1>
          <p className="text-xs text-muted-foreground">Technical Solutions</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.title}</span>
                {item.hasSubmenu && <ChevronDown className="h-4 w-4 shrink-0" />}
              </Link>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
