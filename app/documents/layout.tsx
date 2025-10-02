import type React from "react"
import { AppHeader } from "@/components/app-header"
import { SidebarNav } from "@/components/sidebar-nav"

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SidebarNav />
      <div className="pl-60">
        <AppHeader />
        <main className="pt-16">{children}</main>
      </div>
    </div>
  )
}
