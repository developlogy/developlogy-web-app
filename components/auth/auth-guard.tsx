"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth"
import { useAppStore } from "@/lib/store"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = "/auth" }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user, setUser } = useAppStore()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await auth.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        } else {
          router.push(redirectTo)
          return
        }
      } catch (error) {
        router.push(redirectTo)
        return
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, redirectTo, setUser])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
