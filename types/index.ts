// Core type definitions for Developlogy Website Builder

export type Industry =
  | "Restaurants & Cafés"
  | "Clinics & Hospitals"
  | "Real Estate Agencies"
  | "Small E-commerce Stores"
  | "Salons & Spas"
  | "Freelancers & Agencies"
  | "Educational Institutes"
  | "Boutiques & Clothing Shops"
  | "Gyms & Fitness Centers"
  | "Travel Agencies"
  | "Event Planners"
  | "Law Firms"
  | "Accounting & Tax Consultants"
  | "Local Retail Shops"
  | "Repair & Maintenance Services"
  | "Home Decor & Furniture Shops"
  | "Photography Studios"
  | "Digital Creators & Influencers"
  | "NGOs & Nonprofits"
  | "Pet Shops & Veterinary Clinics"

export interface BusinessInfo {
  address?: string
  phone?: string
  email?: string
  socials?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
}

export interface Theme {
  color: string
  fontScale: number
}

export interface SEO {
  title: string
  description: string
  keywords: string[]
}

// Block types (discriminated union)
export type Block =
  | HeroBlock
  | AboutBlock
  | ServicesBlock
  | GalleryBlock
  | TestimonialsBlock
  | ContactBlock
  | ProductsBlock

export interface BaseBlock {
  id: string
  type: string
}

export interface HeroBlock extends BaseBlock {
  type: "hero"
  heading: string
  subheading: string
  ctaLabel: string
  backgroundImage?: string
}

export interface AboutBlock extends BaseBlock {
  type: "about"
  title: string
  body: string
  image?: string
}

export interface ServicesBlock extends BaseBlock {
  type: "services"
  title: string
  items: {
    name: string
    description: string
    price?: string
  }[]
}

export interface GalleryBlock extends BaseBlock {
  type: "gallery"
  title: string
  images: string[]
}

export interface TestimonialsBlock extends BaseBlock {
  type: "testimonials"
  title: string
  items: {
    name: string
    quote: string
  }[]
}

export interface ContactBlock extends BaseBlock {
  type: "contact"
  title: string
  email: string
  phone: string
  address: string
  mapEmbedUrl?: string
}

export interface ProductsBlock extends BaseBlock {
  type: "products"
  title: string
  products: Product[]
  displayMode: "grid" | "list"
  showPrices: boolean
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  image?: string
  badges?: string[] // e.g., "New", "Sale", "Popular"
  category?: string
  inStock: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  productId: string
  quantity: number
  price: number // Price at time of adding to cart
}

export interface Cart {
  id: string
  items: CartItem[]
  total: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  customerInfo: {
    name: string
    email: string
    phone?: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  paymentStatus: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}

export interface Site {
  id: string
  name: string
  industry: Industry
  logoUrl?: string
  businessInfo: BusinessInfo
  theme: Theme
  blocks: Block[]
  seo: SEO
  ecommerceEnabled: boolean // New field for e-commerce toggle
  createdAt: Date
  updatedAt: Date
}

export interface Template {
  id: string
  name: string
  industry: Industry
  blocks: Block[]
  theme: Theme
}

export interface User {
  id: string
  email: string
  createdAt: Date
}

export interface AnalyticsEvent {
  id: string
  siteId: string
  type: "pageview" | "cta_click" | "form_submit" | "product_view" | "add_to_cart"
  path: string
  metadata?: {
    ctaText?: string
    ctaPosition?: string
    productId?: string
    formType?: string
    referrer?: string
    userAgent?: string
    sessionId?: string
  }
  timestamp: Date
}

export interface AnalyticsStats {
  siteId: string
  totalPageviews: number
  totalClicks: number
  topPages: { path: string; views: number }[]
  topCTAs: { text: string; clicks: number }[]
  dailyStats: { date: string; pageviews: number; clicks: number }[]
  conversionRate: number
  lastUpdated: Date
}
