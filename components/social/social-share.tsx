"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Mail, Copy, Check, ExternalLink } from "lucide-react"
import type { Site } from "@/types"

interface SocialShareProps {
  site: Site
  url: string
}

export function SocialShare({ site, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [customMessage, setCustomMessage] = useState("")

  const shareUrl = url
  const ogImageUrl = `/api/og/${site.id}`
  const shareTitle = site.seo.title || site.name
  const shareDescription = site.seo.description || `Check out ${site.name} - ${site.industry}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "#1877F2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "#1DA1F2",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}&via=Developlogy`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "#0A66C2",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "#25D366",
      url: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} - ${shareUrl}`)}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "#EA4335",
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`Check out this website: ${shareTitle}\n\n${shareDescription}\n\n${shareUrl}`)}`,
    },
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Website</DialogTitle>
          <DialogDescription>Share {site.name} with others using the options below</DialogDescription>
        </DialogHeader>

        {/* Preview Card */}
        <div className="border border-border rounded-lg p-4 space-y-3">
          <div className="aspect-[1200/630] bg-muted rounded-lg overflow-hidden relative">
            <img
              src={ogImageUrl || "/placeholder.svg"}
              alt="Social preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <Badge className="absolute top-2 right-2 bg-white/90 text-black">Preview</Badge>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm truncate">{shareTitle}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{shareDescription}</p>
            <p className="text-xs text-muted-foreground truncate">{shareUrl}</p>
          </div>
        </div>

        <Separator />

        {/* Share URL */}
        <div className="space-y-2">
          <Label>Share Link</Label>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="px-3 bg-transparent">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Social Platforms */}
        <div className="space-y-3">
          <Label>Share on Social Media</Label>
          <div className="grid grid-cols-2 gap-2">
            {shareLinks.map((platform) => (
              <Button
                key={platform.name}
                variant="outline"
                size="sm"
                className="justify-start bg-transparent"
                onClick={() => window.open(platform.url, "_blank", "width=600,height=400")}
              >
                <platform.icon className="w-4 h-4 mr-2" style={{ color: platform.color }} />
                {platform.name}
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Message */}
        <div className="space-y-2">
          <Label htmlFor="custom-message">Custom Message (Optional)</Label>
          <Input
            id="custom-message"
            placeholder="Add a personal message..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            This message will be included when sharing via email or messaging apps
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
