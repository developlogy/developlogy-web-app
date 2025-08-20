"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { auth } from "@/lib/auth"
import { useAppStore } from "@/lib/store"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const setUser = useAppStore((state) => state.setUser)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setError("")

    try {
      // Simulate magic link sending
      setIsSuccess(true)

      // After 2 seconds, simulate successful authentication
      setTimeout(async () => {
        try {
          const user = await auth.signIn(email)
          setUser(user)
          router.push("/dashboard")
        } catch (err) {
          setError("Authentication failed. Please try again.")
          setIsSuccess(false)
        } finally {
          setIsLoading(false)
        }
      }, 2000)
    } catch (err) {
      setError("Failed to send magic link. Please try again.")
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Check Your Email</h3>
        <p className="text-muted-foreground mb-4">
          We've sent a magic link to <strong>{email}</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          Click the link in your email to sign in. This may take a few seconds...
        </p>
        <div className="flex items-center justify-center mt-4">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Signing you in...</span>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading || !email.trim()}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Sending Magic Link...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            Send Magic Link
          </>
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">Don't have an account? We'll create one for you automatically.</p>
      </div>
    </form>
  )
}
