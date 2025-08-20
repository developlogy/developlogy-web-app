"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import type { Site, Product } from "@/types"
import { BlockRenderer } from "@/components/builder/block-renderer"

interface SiteRendererProps {
  site: Site
  showPreviewHeader?: boolean
}

export function SiteRenderer({ site, showPreviewHeader = false }: SiteRendererProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])

  const theme = {
    color: site.theme.color,
    fontScale: site.theme.fontScale,
  }

  useEffect(() => {
    const allProducts: Product[] = []
    site.blocks.forEach((block) => {
      if (block.type === "products") {
        allProducts.push(...block.products)
      }
    })
    setProducts(allProducts)
  }, [site.blocks])

  const handleCheckout = () => {
    router.push(`/checkout/${site.id}`)
  }

  const handleViewAllProducts = () => {
    router.push(`/products/${site.id}`)
  }

  return (
    <div
      className="min-h-screen"
      style={
        {
          "--primary-color": site.theme.color,
          "--font-scale": site.theme.fontScale,
        } as React.CSSProperties
      }
    >
      {showPreviewHeader && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.push(`/builder/${site.id}`)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Editor
                </Button>
                <div className="text-sm text-muted-foreground">
                  Previewing: <span className="font-medium">{site.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {site.ecommerceEnabled && products.length > 0 && (
                  <>
                    <Button variant="outline" size="sm" onClick={handleViewAllProducts}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View All Products
                    </Button>
                    <CartSidebar products={products} onCheckout={handleCheckout} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            description: site.seo.description,
            url: typeof window !== "undefined" ? window.location.origin : "",
            telephone: site.businessInfo.phone,
            email: site.businessInfo.email,
            address: site.businessInfo.address
              ? {
                  "@type": "PostalAddress",
                  streetAddress: site.businessInfo.address,
                }
              : undefined,
            sameAs: [
              site.businessInfo.socials?.facebook,
              site.businessInfo.socials?.twitter,
              site.businessInfo.socials?.instagram,
              site.businessInfo.socials?.linkedin,
            ].filter(Boolean),
          }),
        }}
      />

      {/* Render all blocks */}
      <div className="space-y-0">
        {site.blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            theme={theme}
            isEditing={false}
            onUpdate={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>
    </div>
  )
}
