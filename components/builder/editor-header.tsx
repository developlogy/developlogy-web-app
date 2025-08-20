"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe, Save, Eye, X, Palette, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PublishDialog } from "./publish-dialog"
import type { Site } from "@/types"

interface EditorHeaderProps {
  site: Site
  onSave: () => void
  isSaving: boolean
  onToggleTheme: () => void
  showThemeSidebar: boolean
}

export function EditorHeader({ site, onSave, isSaving, onToggleTheme, showThemeSidebar }: EditorHeaderProps) {
  const router = useRouter()
  const [showPublishDialog, setShowPublishDialog] = useState(false)

  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left - Site Info */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-foreground">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary-foreground" />
              </div>
              Developlogy
            </Link>

            <div className="h-6 w-px bg-border" />

            <div className="flex items-center gap-2">
              {site.logoUrl && (
                <img
                  src={site.logoUrl || "/placeholder.svg"}
                  alt="Site logo"
                  className="w-6 h-6 rounded object-cover"
                />
              )}
              <div>
                <div className="font-medium text-foreground">{site.name}</div>
                <div className="text-xs text-muted-foreground">{site.industry}</div>
              </div>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant={showThemeSidebar ? "default" : "outline"}
              size="sm"
              onClick={onToggleTheme}
              className="hidden sm:flex"
            >
              <Palette className="w-4 h-4 mr-2" />
              Theme & SEO
            </Button>

            <Button variant="outline" size="sm" asChild>
              <Link href={`/preview/${site.id}`} target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Link>
            </Button>

            <Button variant="outline" size="sm" onClick={() => setShowPublishDialog(true)} className="bg-transparent">
              <Upload className="w-4 h-4 mr-2" />
              Publish
            </Button>

            <Button onClick={onSave} disabled={isSaving} size="sm">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>

            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <PublishDialog site={site} open={showPublishDialog} onOpenChange={setShowPublishDialog} />
    </>
  )
}
