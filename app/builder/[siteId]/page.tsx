"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { BlockEditor } from "@/components/builder/block-editor"
import { storage } from "@/lib/storage"
import { useAppStore } from "@/lib/store"
import { Loader2 } from "lucide-react"
import type { Site } from "@/types"

export default function BuilderPage() {
  const params = useParams()
  const router = useRouter()
  const { user, setCurrentSite } = useAppStore()
  const [site, setSite] = useState<Site | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const siteId = params.siteId as string

  useEffect(() => {
    const loadSite = async () => {
      if (!user) {
        router.push("/auth")
        return
      }

      try {
        const siteData = await storage.getSite(siteId)
        if (!siteData) {
          setError("Website not found")
          return
        }

        // Check if user owns this site
        if (!siteData.id.startsWith(user.id)) {
          setError("Access denied")
          return
        }

        setSite(siteData)
        setCurrentSite(siteData)
      } catch (err) {
        console.error("Failed to load site:", err)
        setError("Failed to load website")
      } finally {
        setIsLoading(false)
      }
    }

    loadSite()
  }, [siteId, user, router, setCurrentSite])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    )
  }

  if (error || !site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Error</h1>
          <p className="text-muted-foreground mb-4">{error || "Website not found"}</p>
          <button onClick={() => router.push("/dashboard")} className="text-primary hover:underline">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <BlockEditor site={site} />
}
