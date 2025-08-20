"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, ShoppingBag, CheckCircle, AlertCircle } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { storage } from "@/lib/storage"
import { createPaymentGateway } from "@/lib/payments"
import type { Site, Product, Order } from "@/types"

interface CheckoutPageProps {
  params: {
    siteId: string
  }
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const router = useRouter()
  const { cart, clearCart, getCartTotal } = useAppStore()
  const [site, setSite] = useState<Site | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [orderStatus, setOrderStatus] = useState<"form" | "processing" | "success" | "error">("form")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
  })

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
      }
    }

    loadSiteData()
  }, [params.siteId])

  const getProductById = (productId: string) => {
    return products.find((p) => p.id === productId)
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1]
      setCustomerInfo((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }))
    } else {
      setCustomerInfo((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const validateForm = () => {
    const required = ["name", "email", "address.street", "address.city", "address.state", "address.zipCode"]
    for (const field of required) {
      if (field.startsWith("address.")) {
        const addressField = field.split(".")[1]
        if (!customerInfo.address[addressField as keyof typeof customerInfo.address]) {
          return false
        }
      } else {
        if (!customerInfo[field as keyof typeof customerInfo]) {
          return false
        }
      }
    }
    return true
  }

  const handleSubmitOrder = async () => {
    if (!cart || !validateForm()) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    setOrderStatus("processing")
    setErrorMessage("")

    try {
      const paymentGateway = createPaymentGateway()
      const total = getCartTotal()

      // Create order
      const newOrder: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        items: cart.items,
        total,
        customerInfo,
        paymentStatus: "pending",
        paymentMethod: "mock_gateway",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Process payment
      const paymentResult = await paymentGateway.processPayment({
        amount: total,
        currency: "USD",
        orderId: newOrder.id,
        customerInfo: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
      })

      if (paymentResult.success) {
        // Update order with payment success
        newOrder.paymentStatus = "completed"
        newOrder.updatedAt = new Date()

        // Save order (in real app, this would be to database)
        await storage.saveOrder(newOrder)

        setOrderId(newOrder.id)
        setOrderStatus("success")
        clearCart()
      } else {
        setOrderStatus("error")
        setErrorMessage(paymentResult.error || "Payment failed. Please try again.")
      }
    } catch (error) {
      setOrderStatus("error")
      setErrorMessage("An unexpected error occurred. Please try again.")
      console.error("Checkout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Add some products before checking out</p>
            <Button onClick={() => router.push(`/preview/${params.siteId}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (orderStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Order Confirmed!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for your purchase. Your order #{orderId} has been successfully processed.
            </p>
            <Button onClick={() => router.push(`/preview/${params.siteId}`)}>Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (orderStatus === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Payment Failed</h2>
            <p className="text-muted-foreground mb-4">{errorMessage}</p>
            <div className="space-y-2">
              <Button onClick={() => setOrderStatus("form")} className="w-full">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => router.push(`/preview/${params.siteId}`)} className="w-full">
                Back to Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push(`/preview/${params.siteId}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={customerInfo.address.street}
                  onChange={(e) => handleInputChange("address.street", e.target.value)}
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={customerInfo.address.city}
                    onChange={(e) => handleInputChange("address.city", e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={customerInfo.address.state}
                    onChange={(e) => handleInputChange("address.state", e.target.value)}
                    placeholder="NY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={customerInfo.address.zipCode}
                    onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                    placeholder="10001"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={customerInfo.address.country}
                    onChange={(e) => handleInputChange("address.country", e.target.value)}
                    placeholder="US"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.items.map((item) => {
                  const product = getProductById(item.productId)
                  if (!product) return null

                  return (
                    <div key={item.productId} className="flex gap-3">
                      <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  )
                })}

                <Separator />

                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full"
                    onClick={handleSubmitOrder}
                    disabled={isLoading || orderStatus === "processing"}
                  >
                    {orderStatus === "processing" ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Complete Order
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <Badge variant="secondary" className="text-xs">
                    <CreditCard className="w-3 h-3 mr-1" />
                    Secure Mock Payment
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
