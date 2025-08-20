"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EditableText } from "@/components/builder/editable-text"
import { ProductDetailModal } from "@/components/products/product-detail-modal"
import { Plus, Edit, Trash2, ShoppingBag, ImageIcon } from "lucide-react"
import { useAppStore } from "@/lib/store"
import type { ProductsBlock, Product, Theme } from "@/types"

interface ProductsBlockRendererProps {
  block: ProductsBlock
  theme?: Theme
  isEditing: boolean
  onUpdate: (updates: Partial<ProductsBlock>) => void
  onDelete?: () => void
}

export function ProductsBlockRenderer({ block, theme, isEditing, onUpdate, onDelete }: ProductsBlockRendererProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const { addToCart, setCartOpen } = useAppStore()

  const defaultTheme = { color: "#f97316", fontScale: 1 }
  const activeTheme = theme || defaultTheme

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `product_${Date.now()}`,
      name: "New Product",
      price: 0,
      description: "Product description",
      image: "/diverse-products-still-life.png",
      badges: [],
      category: "",
      inStock: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    onUpdate({
      products: [...block.products, newProduct],
    })
    setEditingProduct(newProduct)
    setIsAddingProduct(true)
  }

  const handleUpdateProduct = (productId: string, updates: Partial<Product>) => {
    const updatedProducts = block.products.map((product) =>
      product.id === productId ? { ...product, ...updates, updatedAt: new Date() } : product,
    )
    onUpdate({ products: updatedProducts })
  }

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = block.products.filter((product) => product.id !== productId)
    onUpdate({ products: updatedProducts })
  }

  const handleQuickAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening product detail modal
    if (product.inStock) {
      addToCart(product, 1)
      setCartOpen(true)
    }
  }

  const handleProductClick = (product: Product) => {
    if (!isEditing) {
      setSelectedProduct(product)
    }
  }

  const ProductEditDialog = ({
    product,
    isOpen,
    onClose,
  }: { product: Product; isOpen: boolean; onClose: () => void }) => {
    const [formData, setFormData] = useState(product)

    const handleSave = () => {
      handleUpdateProduct(product.id, formData)
      onClose()
    }

    const handleAddBadge = (badge: string) => {
      if (badge && !formData.badges?.includes(badge)) {
        setFormData({
          ...formData,
          badges: [...(formData.badges || []), badge],
        })
      }
    }

    const handleRemoveBadge = (badge: string) => {
      setFormData({
        ...formData,
        badges: formData.badges?.filter((b) => b !== badge) || [],
      })
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Electronics, Clothing, Books"
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/diverse-products-still-life.png"
              />
            </div>

            <div>
              <Label>Badges</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.badges?.map((badge) => (
                  <Badge
                    key={badge}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveBadge(badge)}
                  >
                    {badge} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleAddBadge("New")}>
                  + New
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleAddBadge("Sale")}>
                  + Sale
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleAddBadge("Popular")}>
                  + Popular
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Product</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="py-16 px-4" style={{ backgroundColor: `${activeTheme.color}08` }}>
      <div className="max-w-6xl mx-auto">
        {/* Block Header */}
        <div className="text-center mb-12">
          <EditableText
            value={block.title}
            onChange={(title) => onUpdate({ title })}
            className={`text-4xl font-bold text-gray-900 mb-4`}
            style={{ fontSize: `${2.25 * activeTheme.fontScale}rem` }}
            placeholder="Our Products"
            isEditing={isEditing}
          />
        </div>

        {/* Block Settings (Editor Only) */}
        {isEditing && (
          <div className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Products Settings</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="displayMode">Display:</Label>
                  <Select
                    value={block.displayMode}
                    onValueChange={(value: "grid" | "list") => onUpdate({ displayMode: value })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="showPrices"
                    checked={block.showPrices}
                    onCheckedChange={(checked) => onUpdate({ showPrices: checked })}
                  />
                  <Label htmlFor="showPrices">Show Prices</Label>
                </div>
                <Button onClick={handleAddProduct} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid/List */}
        {block.products.length > 0 ? (
          <div
            className={
              block.displayMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"
            }
          >
            {block.products.map((product) => (
              <Card
                key={product.id}
                className={`group relative overflow-hidden hover:shadow-lg transition-shadow ${
                  !isEditing ? "cursor-pointer" : ""
                }`}
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image */}
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

                  {/* Badges */}
                  {product.badges && product.badges.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {product.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Editor Controls */}
                  {isEditing && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button size="sm" variant="secondary" onClick={() => setEditingProduct(product)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

                    {block.showPrices && (
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold" style={{ color: activeTheme.color }}>
                          ${product.price.toFixed(2)}
                        </span>
                        {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                      </div>
                    )}

                    {!isEditing && product.inStock && (
                      <Button
                        className="w-full mt-3"
                        style={{ backgroundColor: activeTheme.color }}
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
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-6">Add your first product to get started</p>
            {isEditing && (
              <Button onClick={handleAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>
        )}

        {/* Delete Block Button (Editor Only) */}
        {isEditing && onDelete && (
          <div className="mt-8 text-center">
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Products Block
            </Button>
          </div>
        )}
      </div>

      {/* Product Edit Dialog */}
      {editingProduct && (
        <ProductEditDialog
          product={editingProduct}
          isOpen={!!editingProduct}
          onClose={() => {
            setEditingProduct(null)
            setIsAddingProduct(false)
          }}
        />
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        theme={theme}
      />
    </div>
  )
}
