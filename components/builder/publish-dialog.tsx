"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Download,
  Globe,
  FileText,
  ImageIcon,
  Palette,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react"
import type { Site } from "@/types"

interface PublishDialogProps {
  site: Site
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PublishDialog({ site, open, onOpenChange }: PublishDialogProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportComplete, setExportComplete] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)
    setExportComplete(false)

    try {
      // Simulate export progress
      const steps = [
        { message: "Generating HTML structure...", progress: 20 },
        { message: "Compiling CSS styles...", progress: 40 },
        { message: "Optimizing images...", progress: 60 },
        { message: "Creating static assets...", progress: 80 },
        { message: "Packaging files...", progress: 100 },
      ]

      for (const step of steps) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setExportProgress(step.progress)
      }

      // Call the export API
      const response = await fetch(`/api/export/${site.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Export failed")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setExportComplete(true)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `${site.name.toLowerCase().replace(/\s+/g, "-")}-website.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const resetDialog = () => {
    setExportComplete(false)
    setDownloadUrl(null)
    setExportProgress(0)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen)
        if (!newOpen) {
          setTimeout(resetDialog, 300)
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Publish Website
          </DialogTitle>
          <DialogDescription>Export your website as static HTML files ready for hosting</DialogDescription>
        </DialogHeader>

        {!isExporting && !exportComplete && (
          <div className="space-y-6">
            {/* Site Preview */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {site.logoUrl && (
                    <img
                      src={site.logoUrl || "/placeholder.svg"}
                      alt="Site logo"
                      className="w-8 h-8 rounded object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{site.name}</h3>
                    <p className="text-sm text-muted-foreground">{site.industry}</p>
                  </div>
                </div>
                <Badge variant="secondary">{site.blocks.length} blocks</Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: site.theme.color }} />
                <span>Custom theme</span>
                {site.ecommerceEnabled && (
                  <>
                    <span>•</span>
                    <span>E-commerce enabled</span>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* What's Included */}
            <div className="space-y-3">
              <h4 className="font-medium">What's included in your export:</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>HTML files</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Palette className="w-4 h-4 text-purple-500" />
                  <span>CSS styles</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ImageIcon className="w-4 h-4 text-green-500" />
                  <span>Optimized images</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-orange-500" />
                  <span>SEO meta tags</span>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The exported files are static HTML/CSS. Dynamic features like forms and e-commerce will need server-side
                integration.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={handleExport} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export Website
              </Button>
              <Button variant="outline" asChild>
                <a href={`/preview/${site.id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        )}

        {isExporting && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Exporting your website...</h3>
              <p className="text-sm text-muted-foreground">This may take a few moments</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Please don't close this dialog while exporting...
            </div>
          </div>
        )}

        {exportComplete && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Export Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your website has been successfully exported as static files
              </p>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your website is ready for hosting on any static hosting service like Netlify, Vercel, or GitHub Pages.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download ZIP
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
