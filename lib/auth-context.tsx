"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration (replace with real Supabase auth later)
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "manager@brightinnovation.co.za": {
    password: "demo123",
    user: {
      id: "1",
      email: "manager@brightinnovation.co.za",
      name: "Sarah Johnson",
      role: "BidManager",
      created_at: new Date().toISOString(),
    },
  },
  "user@brightinnovation.co.za": {
    password: "demo123",
    user: {
      id: "2",
      email: "user@brightinnovation.co.za",
      name: "Michael Chen",
      role: "BidUser",
      created_at: new Date().toISOString(),
    },
  },
  "exec@brightinnovation.co.za": {
    password: "demo123",
    user: {
      id: "3",
      email: "exec@brightinnovation.co.za",
      name: "Linda Mbeki",
      role: "Executive",
      created_at: new Date().toISOString(),
    },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("tender_portal_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const mockUser = MOCK_USERS[email]
    if (!mockUser || mockUser.password !== password) {
      throw new Error("Invalid email or password")
    }

    setUser(mockUser.user)
    localStorage.setItem("tender_portal_user", JSON.stringify(mockUser.user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("tender_portal_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
