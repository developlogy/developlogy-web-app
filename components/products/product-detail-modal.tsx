"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingBag, Plus, Minus, ImageIcon, X } from "lucide-react"
import { useAppStore } from "@/lib/store"
import type { Product, Theme } from "@/types"

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  theme?: Theme
}

export function ProductDetailModal({ product, isOpen, onClose, theme }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart, setCartOpen } = useAppStore()

  const defaultTheme = { color: "#f97316", fontScale: 1 }
  const activeTheme = theme || defaultTheme

  if (!product) return null

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setCartOpen(true)
    onClose()
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Product Image */}
          <div className="relative bg-gray-50 flex items-center justify-center min-h-[400px]">
            {product.image ? (
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="w-24 h-24 mb-4" />
                <p>No image available</p>
              </div>
            )}

            {/* Badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}

            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-2xl font-bold text-left">{product.name}</DialogTitle>
            </DialogHeader>

            <ScrollArea className="flex-1 px-6">
              <div className="space-y-6">
                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold" style={{ color: activeTheme.color }}>
                    ${product.price.toFixed(2)}
                  </span>
                  {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                </div>

                {/* Category */}
                {product.category && (
                  <div>
                    <span className="text-sm text-muted-foreground">Category: </span>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>

                {/* Stock Status */}
                <div>
                  <h3 className="font-semibold mb-2">Availability</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-sm">{product.inStock ? "In Stock" : "Out of Stock"}</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                {product.inStock && (
                  <div>
                    <h3 className="font-semibold mb-3">Quantity</h3>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => handleQuantityChange(quantity + 1)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Add to Cart Button */}
            <div className="p-6 pt-4 border-t">
              {product.inStock ? (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAddToCart}
                  style={{ backgroundColor: activeTheme.color }}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add {quantity} to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
              ) : (
                <Button className="w-full" size="lg" disabled>
                  Out of Stock
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
