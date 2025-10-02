import type React from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <div className="flex-1 pl-60">
        <Header />
        <main className="pt-16">{children}</main>
      </div>
    </div>
  )
}
