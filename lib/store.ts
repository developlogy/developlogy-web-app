// Zustand store for global state management

import { create } from "zustand"
import type { Site, User, Block, Cart, CartItem, Product } from "@/types"

interface AppState {
  // Auth state
  user: User | null
  isAuthenticated: boolean

  // Sites state
  sites: Site[]
  currentSite: Site | null

  // Cart state
  cart: Cart | null
  isCartOpen: boolean

  // UI state
  isLoading: boolean

  // Actions
  setUser: (user: User | null) => void
  setSites: (sites: Site[]) => void
  setCurrentSite: (site: Site | null) => void
  updateCurrentSite: (updates: Partial<Site>) => void
  updateSiteBlocks: (blocks: Block[]) => void
  setLoading: (loading: boolean) => void

  // Cart actions
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartItemQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setCartOpen: (open: boolean) => void
  getCartTotal: () => number
  getCartItemCount: () => number
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  sites: [],
  currentSite: null,
  cart: null,
  isCartOpen: false,
  isLoading: false,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setSites: (sites) => set({ sites }),

  setCurrentSite: (site) => set({ currentSite: site }),

  updateCurrentSite: (updates) => {
    const { currentSite } = get()
    if (currentSite) {
      const updatedSite = { ...currentSite, ...updates, updatedAt: new Date() }
      set({ currentSite: updatedSite })
    }
  },

  updateSiteBlocks: (blocks) => {
    const { currentSite } = get()
    if (currentSite) {
      const updatedSite = { ...currentSite, blocks, updatedAt: new Date() }
      set({ currentSite: updatedSite })
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  addToCart: (product, quantity = 1) => {
    const { cart } = get()
    const now = new Date()

    if (!cart) {
      // Create new cart
      const newCart: Cart = {
        id: `cart_${Date.now()}`,
        items: [
          {
            productId: product.id,
            quantity,
            price: product.price,
          },
        ],
        total: product.price * quantity,
        createdAt: now,
        updatedAt: now,
      }
      set({ cart: newCart })
    } else {
      // Update existing cart
      const existingItemIndex = cart.items.findIndex((item) => item.productId === product.id)

      let updatedItems: CartItem[]
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        updatedItems = cart.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        // Add new item
        updatedItems = [
          ...cart.items,
          {
            productId: product.id,
            quantity,
            price: product.price,
          },
        ]
      }

      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      set({
        cart: {
          ...cart,
          items: updatedItems,
          total,
          updatedAt: now,
        },
      })
    }
  },

  removeFromCart: (productId) => {
    const { cart } = get()
    if (!cart) return

    const updatedItems = cart.items.filter((item) => item.productId !== productId)
    const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    set({
      cart: {
        ...cart,
        items: updatedItems,
        total,
        updatedAt: new Date(),
      },
    })
  },

  updateCartItemQuantity: (productId, quantity) => {
    const { cart } = get()
    if (!cart) return

    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }

    const updatedItems = cart.items.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    set({
      cart: {
        ...cart,
        items: updatedItems,
        total,
        updatedAt: new Date(),
      },
    })
  },

  clearCart: () => {
    set({ cart: null })
  },

  setCartOpen: (isCartOpen) => set({ isCartOpen }),

  getCartTotal: () => {
    const { cart } = get()
    return cart?.total || 0
  },

  getCartItemCount: () => {
    const { cart } = get()
    return cart?.items.reduce((count, item) => count + item.quantity, 0) || 0
  },
}))
