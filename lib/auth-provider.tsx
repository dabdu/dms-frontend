"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type AuthContextType = {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated on initial load
    const token = localStorage.getItem("auth_token")
    setIsAuthenticated(!!token)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!isAuthenticated && pathname !== "/login" && pathname !== "/") {
      router.push("/login")
    }

    // Redirect to dashboard if authenticated and on login page
    if (isAuthenticated && (pathname === "/login" || pathname === "/")) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, pathname, router])

  const login = (token: string) => {
    localStorage.setItem("auth_token", token)
    setIsAuthenticated(true)
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setIsAuthenticated(false)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}
