"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductDetailModal } from "@/components/products/product-detail-modal"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { ArrowLeft, Search, ShoppingBag, ImageIcon } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { storage } from "@/lib/storage"
import type { Site, Product } from "@/types"

interface ProductsPageProps {
  params: {
    siteId: string
  }
}

export default function ProductsPage({ params }: ProductsPageProps) {
  const router = useRouter()
  const { addToCart, setCartOpen } = useAppStore()
  const [site, setSite] = useState<Site | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    const loadSiteData = async () => {
      const siteData = await storage.getSite(params.siteId)
      if (siteData) {
        setSite(siteData)
        // Extract products from all ProductsBlocks
        const allProducts: Product[] = []
        siteData.blocks.forEach((block) => {
          if (block.type === "products") {
            allProducts.push(...block.products)
          }
        })
        setProducts(allProducts)
        setFilteredProducts(allProducts)
      }
    }

    loadSiteData()
  }, [params.siteId])

  useEffect(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchQuery, categoryFilter, sortBy])

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))

  const handleQuickAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    if (product.inStock) {
      addToCart(product, 1)
      setCartOpen(true)
    }
  }

  const handleCheckout = () => {
    router.push(`/checkout/${params.siteId}`)
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push(`/preview/${params.siteId}`)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Site
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{site.name} - Products</h1>
                <p className="text-muted-foreground">Browse our complete product catalog</p>
              </div>
            </div>
            <CartSidebar products={products} onCheckout={handleCheckout} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  {product.badges && product.badges.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {product.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

                    {product.category && (
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-bold" style={{ color: site.theme.color }}>
                        ${product.price.toFixed(2)}
                      </span>
                      {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                    </div>

                    {product.inStock && (
                      <Button
                        className="w-full mt-3"
                        style={{ backgroundColor: site.theme.color }}
                        onClick={(e) => handleQuickAddToCart(product, e)}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setCategoryFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        theme={site.theme}
      />
    </div>
  )
}
