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
          const { data: profile, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle()

          if (error) {
            console.error("[v0] Error fetching user profile:", error)
          }

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              name: profile.full_name || session.user.email?.split("@")[0] || "User",
              role: profile.role === "admin" ? "Executive" : profile.role === "bid_manager" ? "BidManager" : "BidUser",
              created_at: profile.created_at,
            })
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.email?.split("@")[0] || "User",
              role: "BidUser",
              created_at: new Date().toISOString(),
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
        const { data: profile, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle()

        if (error) {
          console.error("[v0] Error fetching user profile:", error)
        }

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.full_name || session.user.email?.split("@")[0] || "User",
            role: profile.role === "admin" ? "Executive" : profile.role === "bid_manager" ? "BidManager" : "BidUser",
            created_at: profile.created_at,
          })
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.email?.split("@")[0] || "User",
            role: "BidUser",
            created_at: new Date().toISOString(),
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
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle()

      if (profileError) {
        console.error("[v0] Error fetching user profile:", profileError)
      }

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.full_name || data.user.email?.split("@")[0] || "User",
          role: profile.role === "admin" ? "Executive" : profile.role === "bid_manager" ? "BidManager" : "BidUser",
          created_at: profile.created_at,
        })
      } else {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          name: data.user.email?.split("@")[0] || "User",
          role: "BidUser",
          created_at: new Date().toISOString(),
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
