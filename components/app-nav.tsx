"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Inbox, Target, FileText, BarChart3 } from "lucide-react"

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
    title: "Opportunities",
    href: "/opportunities",
    icon: Target,
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
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-card">
      <div className="flex items-center gap-1 px-6">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-colors hover:text-foreground",
                isActive ? "border-primary text-foreground" : "text-muted-foreground hover:border-muted-foreground/50",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
