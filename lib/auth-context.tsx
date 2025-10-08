"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setSupabaseUser(session.user)
          // Fetch user profile from database
          const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              name: profile.full_name || session.user.email?.split("@")[0] || "User",
              role: profile.role === "admin" ? "Executive" : profile.role === "bid_manager" ? "BidManager" : "BidUser",
              created_at: profile.created_at,
            })
          }
        }
      } catch (error) {
        console.error("[v0] Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state changed:", event)

      if (session?.user) {
        setSupabaseUser(session.user)
        // Fetch user profile
        const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.full_name || session.user.email?.split("@")[0] || "User",
            role: profile.role === "admin" ? "Executive" : profile.role === "bid_manager" ? "BidManager" : "BidUser",
            created_at: profile.created_at,
          })
        }
      } else {
        setSupabaseUser(null)
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (data.user) {
      setSupabaseUser(data.user)
      // Fetch user profile
      const { data: profile } = await supabase.from("users").select("*").eq("id", data.user.id).single()

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.full_name || data.user.email?.split("@")[0] || "User",
          role: profile.role === "admin" ? "Executive" : profile.role === "bid_manager" ? "BidManager" : "BidUser",
          created_at: profile.created_at,
        })
      }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, supabaseUser, login, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
