"use client"

import { useEffect } from "react"
import { auth } from "@/lib/auth"
import { useAppStore } from "@/lib/store"

export function useAuth() {
  const { user, setUser, isAuthenticated } = useAppStore()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await auth.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Auth initialization failed:", error)
        setUser(null)
      }
    }

    initAuth()
  }, [setUser])

  const signIn = async (email: string) => {
    try {
      const user = await auth.signIn(email)
      setUser(user)
      return user
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
      setUser(null)
    } catch (error) {
      throw error
    }
  }

  return {
    user,
    isAuthenticated,
    signIn,
    signOut,
    isLoading: false, // Could be enhanced with loading state
  }
}
