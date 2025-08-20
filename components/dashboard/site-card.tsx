"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Eye, Edit, MoreVertical, Trash2, Copy } from "lucide-react"
import Link from "next/link"
import type { Site } from "@/types"

interface SiteCardProps {
  site: Site
  onDelete: (siteId: string) => void
}

export function SiteCard({ site, onDelete }: SiteCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(site.id)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Failed to delete site:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add a toast notification here
  }

  const getThumbnailUrl = (site: Site) => {
    // Generate thumbnail based on site theme and industry
    const color = encodeURIComponent(site.theme.color)
    return `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(site.name)}&bg=${color.replace("#", "")}`
  }

  const getIndustryColor = (industry: string) => {
    const colors: Record<string, string> = {
      "Restaurants & Cafés": "bg-orange-100 text-orange-800",
      "Clinics & Hospitals": "bg-green-100 text-green-800",
      "Real Estate Agencies": "bg-blue-100 text-blue-800",
      "Small E-commerce Stores": "bg-purple-100 text-purple-800",
      "Salons & Spas": "bg-pink-100 text-pink-800",
      "Freelancers & Agencies": "bg-gray-100 text-gray-800",
    }
    return colors[industry] || "bg-gray-100 text-gray-800"
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
        {/* Thumbnail */}
        <div className="relative overflow-hidden">
          <img
            src={getThumbnailUrl(site) || "/placeholder.svg"}
            alt={`${site.name} preview`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

          {/* Quick Actions Overlay */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" asChild className="h-8 w-8 p-0">
                <Link href={`/preview/${site.id}`}>
                  <Eye className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="sm" variant="secondary" asChild className="h-8 w-8 p-0">
                <Link href={`/builder/${site.id}`}>
                  <Edit className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Industry Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className={`text-xs ${getIndustryColor(site.industry)}`}>
              {site.industry}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {site.logoUrl && (
                <img
                  src={site.logoUrl || "/placeholder.svg"}
                  alt={`${site.name} logo`}
                  className="w-6 h-6 rounded object-cover flex-shrink-0"
                />
              )}
              <CardTitle className="text-lg truncate">{site.name}</CardTitle>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/builder/${site.id}`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/preview/${site.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyToClipboard(`/preview/${site.id}`)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardDescription className="flex items-center gap-2">
            <span>Last edited: {new Date(site.updatedAt).toLocaleDateString()}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{site.blocks.length} sections</span>
              <span>•</span>
              <span style={{ color: site.theme.color }} className="font-medium">
                {site.theme.color}
              </span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/preview/${site.id}`}>
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/builder/${site.id}`}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>

          {/* Publish Status */}
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant="outline" className="text-xs">
                Draft
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Website</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{site.name}"? This action cannot be undone and will permanently remove
              all content and settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Website"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
