"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, Palette, Type, Search, ShoppingBag, ExternalLink, AlertCircle, CheckCircle } from "lucide-react"
import type { Site } from "@/types"
import { validateSEO } from "@/utils/seo"

interface ThemeSidebarProps {
  site: Site
  onUpdateSite: (updates: Partial<Site>) => void
  onClose: () => void
}

const colorPresets = [
  { name: "Orange", value: "#D97706" },
  { name: "Blue", value: "#1D4ED8" },
  { name: "Green", value: "#059669" },
  { name: "Purple", value: "#7C3AED" },
  { name: "Pink", value: "#EC4899" },
  { name: "Red", value: "#DC2626" },
  { name: "Teal", value: "#0891B2" },
  { name: "Gray", value: "#374151" },
]

export function ThemeSidebar({ site, onUpdateSite, onClose }: ThemeSidebarProps) {
  const [activeTab, setActiveTab] = useState<"theme" | "seo" | "ecommerce">("theme")

  const seoValidation = validateSEO(site.seo)

  const handleThemeUpdate = (updates: Partial<typeof site.theme>) => {
    onUpdateSite({
      theme: { ...site.theme, ...updates },
    })
  }

  const handleSEOUpdate = (updates: Partial<typeof site.seo>) => {
    onUpdateSite({
      seo: { ...site.seo, ...updates },
    })
  }

  const handleEcommerceToggle = (enabled: boolean) => {
    onUpdateSite({
      ecommerceEnabled: enabled,
    })
  }

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Customize</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={activeTab === "theme" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("theme")}
          >
            <Palette className="w-3 h-3 mr-1" />
            Theme
          </Button>
          <Button
            variant={activeTab === "seo" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("seo")}
          >
            <Search className="w-3 h-3 mr-1" />
            SEO
          </Button>
          <Button
            variant={activeTab === "ecommerce" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => setActiveTab("ecommerce")}
          >
            <ShoppingBag className="w-3 h-3 mr-1" />
            Store
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {activeTab === "theme" && (
            <>
              {/* Primary Color */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Primary Color
                </Label>

                <div className="grid grid-cols-4 gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color.value}
                      className={`w-full h-10 rounded-lg border-2 transition-all ${
                        site.theme.color === color.value
                          ? "border-foreground scale-105"
                          : "border-border hover:border-muted-foreground"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleThemeUpdate({ color: color.value })}
                      title={color.name}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={site.theme.color}
                    onChange={(e) => handleThemeUpdate({ color: e.target.value })}
                    className="w-16 h-10 p-1 border-border"
                  />
                  <Input
                    value={site.theme.color}
                    onChange={(e) => handleThemeUpdate({ color: e.target.value })}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <Separator />

              {/* Font Scale */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Font Size Scale
                </Label>

                <div className="space-y-2">
                  <Slider
                    value={[site.theme.fontScale]}
                    onValueChange={([value]) => handleThemeUpdate({ fontScale: value })}
                    min={0.8}
                    max={1.4}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Small</span>
                    <span>{site.theme.fontScale.toFixed(1)}x</span>
                    <span>Large</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Preview */}
              <div className="space-y-3">
                <Label>Preview</Label>
                <div className="p-4 border border-border rounded-lg space-y-2">
                  <div
                    className="text-lg font-bold"
                    style={{
                      color: site.theme.color,
                      fontSize: `${site.theme.fontScale * 1.125}rem`,
                    }}
                  >
                    Heading Text
                  </div>
                  <div className="text-muted-foreground" style={{ fontSize: `${site.theme.fontScale}rem` }}>
                    Body text will appear like this with your current settings.
                  </div>
                  <Button size="sm" style={{ backgroundColor: site.theme.color }}>
                    Button
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeTab === "seo" && (
            <>
              {/* SEO Health */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>SEO Health</Label>
                  <Badge variant={seoValidation.isValid ? "default" : "destructive"} className="text-xs">
                    {seoValidation.isValid ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Good
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Needs Work
                      </>
                    )}
                  </Badge>
                </div>

                {!seoValidation.isValid && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="space-y-1">
                      {seoValidation.issues.map((issue, index) => (
                        <p key={index} className="text-xs text-destructive flex items-start gap-2">
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {issue}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* SEO Title */}
              <div className="space-y-2">
                <Label htmlFor="seo-title">Page Title</Label>
                <Input
                  id="seo-title"
                  value={site.seo.title}
                  onChange={(e) => handleSEOUpdate({ title: e.target.value })}
                  placeholder="Enter page title"
                />
                <p className="text-xs text-muted-foreground">
                  {site.seo.title.length}/60 characters
                  {site.seo.title.length > 60 && <span className="text-destructive ml-1">• Too long</span>}
                </p>
              </div>

              {/* SEO Description */}
              <div className="space-y-2">
                <Label htmlFor="seo-description">Meta Description</Label>
                <Textarea
                  id="seo-description"
                  value={site.seo.description}
                  onChange={(e) => handleSEOUpdate({ description: e.target.value })}
                  placeholder="Enter meta description"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {site.seo.description.length}/160 characters
                  {site.seo.description.length > 160 && <span className="text-destructive ml-1">• Too long</span>}
                </p>
              </div>

              {/* SEO Keywords */}
              <div className="space-y-2">
                <Label htmlFor="seo-keywords">Keywords</Label>
                <Input
                  id="seo-keywords"
                  value={site.seo.keywords.join(", ")}
                  onChange={(e) =>
                    handleSEOUpdate({
                      keywords: e.target.value
                        .split(",")
                        .map((k) => k.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-muted-foreground">
                  {site.seo.keywords.length} keywords
                  {site.seo.keywords.length > 10 && <span className="text-destructive ml-1">• Too many</span>}
                </p>
              </div>

              <Separator />

              {/* SEO Tools */}
              <div className="space-y-3">
                <Label>SEO Tools</Label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between bg-transparent"
                    onClick={() => window.open(`/api/sitemap/${site.id}`, "_blank")}
                  >
                    <span>View Sitemap</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between bg-transparent"
                    onClick={() => window.open(`/api/robots/${site.id}`, "_blank")}
                  >
                    <span>View Robots.txt</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* SEO Preview */}
              <div className="space-y-3">
                <Label>Search Preview</Label>
                <div className="p-4 border border-border rounded-lg space-y-2">
                  <div className="text-blue-600 text-lg font-medium truncate">{site.seo.title || "Page Title"}</div>
                  <div className="text-green-700 text-sm truncate">yoursite.com/preview/{site.id}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {site.seo.description || "Meta description will appear here..."}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "ecommerce" && (
            <>
              {/* E-commerce Toggle */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Enable E-commerce
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Turn on shopping cart, product management, and checkout features
                    </p>
                  </div>
                  <Switch checked={site.ecommerceEnabled || false} onCheckedChange={handleEcommerceToggle} />
                </div>

                {site.ecommerceEnabled && (
                  <>
                    <Separator />

                    <div className="space-y-3">
                      <Label>E-commerce Features</Label>
                      <div className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Shopping Cart & Checkout</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Product Management</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Order Processing</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Payment Integration</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Getting Started</Label>
                      <div className="p-4 bg-muted rounded-lg space-y-2">
                        <p className="text-sm text-muted-foreground">
                          1. Add a "Products" block to showcase your items
                        </p>
                        <p className="text-sm text-muted-foreground">
                          2. Configure product details, prices, and images
                        </p>
                        <p className="text-sm text-muted-foreground">
                          3. Preview your site to test the shopping experience
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {!site.ecommerceEnabled && (
                  <>
                    <Separator />

                    <div className="space-y-3">
                      <Label>Why Enable E-commerce?</Label>
                      <div className="p-4 bg-muted rounded-lg space-y-2">
                        <p className="text-sm text-muted-foreground">• Sell products directly from your website</p>
                        <p className="text-sm text-muted-foreground">• Accept payments securely online</p>
                        <p className="text-sm text-muted-foreground">• Manage inventory and orders</p>
                        <p className="text-sm text-muted-foreground">• Track sales and customer data</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
