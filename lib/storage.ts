// Storage abstraction layer for easy DB swap later

export interface IStorage {
  // Sites
  getSites(userId: string): Promise<Site[]>
  getSite(siteId: string): Promise<Site | null>
  createSite(site: Omit<Site, "id" | "createdAt" | "updatedAt">): Promise<Site>
  updateSite(siteId: string, updates: Partial<Site>): Promise<Site>
  deleteSite(siteId: string): Promise<void>

  // Users
  getUser(userId: string): Promise<User | null>
  createUser(user: Omit<User, "id" | "createdAt">): Promise<User>

  // Orders
  saveOrder(order: Order): Promise<Order>
  getOrder(orderId: string): Promise<Order | null>
  getOrdersByUser(userId: string): Promise<Order[]>

  // Analytics
  saveAnalyticsEvent(event: Omit<AnalyticsEvent, "id" | "timestamp">): Promise<AnalyticsEvent>
  getAnalyticsEvents(siteId: string, startDate?: Date, endDate?: Date): Promise<AnalyticsEvent[]>
  getAnalyticsStats(siteId: string): Promise<AnalyticsStats>
  deleteAnalyticsEvents(siteId: string): Promise<void>
}

import type { Site, User, Order, AnalyticsEvent, AnalyticsStats } from "@/types"

class LocalStorage implements IStorage {
  private SITES_KEY = "developlogy_sites"
  private USERS_KEY = "developlogy_users"
  private ORDERS_KEY = "developlogy_orders"
  private CURRENT_USER_KEY = "developlogy_current_user"
  private ANALYTICS_KEY = "developlogy_analytics"

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private getCurrentUserId(): string {
    if (typeof window === "undefined") return ""
    return localStorage.getItem(this.CURRENT_USER_KEY) || ""
  }

  async getSites(userId: string): Promise<Site[]> {
    if (typeof window === "undefined") return []
    const sites = JSON.parse(localStorage.getItem(this.SITES_KEY) || "[]")
    return sites.filter((site: Site) => site.id.startsWith(userId))
  }

  async getSite(siteId: string): Promise<Site | null> {
    if (typeof window === "undefined") return null
    const sites = JSON.parse(localStorage.getItem(this.SITES_KEY) || "[]")
    const site = sites.find((s: Site) => s.id === siteId)
    return site ? { ...site, createdAt: new Date(site.createdAt), updatedAt: new Date(site.updatedAt) } : null
  }

  async createSite(siteData: Omit<Site, "id" | "createdAt" | "updatedAt">): Promise<Site> {
    if (typeof window === "undefined") throw new Error("Cannot create site on server")

    const userId = this.getCurrentUserId()
    const site: Site = {
      ...siteData,
      id: `${userId}_${this.generateId()}`,
      ecommerceEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const sites = JSON.parse(localStorage.getItem(this.SITES_KEY) || "[]")
    sites.push(site)
    localStorage.setItem(this.SITES_KEY, JSON.stringify(sites))

    return site
  }

  async updateSite(siteId: string, updates: Partial<Site>): Promise<Site> {
    if (typeof window === "undefined") throw new Error("Cannot update site on server")

    const sites = JSON.parse(localStorage.getItem(this.SITES_KEY) || "[]")
    const index = sites.findIndex((s: Site) => s.id === siteId)

    if (index === -1) throw new Error("Site not found")

    sites[index] = { ...sites[index], ...updates, updatedAt: new Date() }
    localStorage.setItem(this.SITES_KEY, JSON.stringify(sites))

    return sites[index]
  }

  async deleteSite(siteId: string): Promise<void> {
    if (typeof window === "undefined") return

    const sites = JSON.parse(localStorage.getItem(this.SITES_KEY) || "[]")
    const filtered = sites.filter((s: Site) => s.id !== siteId)
    localStorage.setItem(this.SITES_KEY, JSON.stringify(filtered))
  }

  async getUser(userId: string): Promise<User | null> {
    if (typeof window === "undefined") return null
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || "[]")
    const user = users.find((u: User) => u.id === userId)
    return user ? { ...user, createdAt: new Date(user.createdAt) } : null
  }

  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    if (typeof window === "undefined") throw new Error("Cannot create user on server")

    const user: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date(),
    }

    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || "[]")
    users.push(user)
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
    localStorage.setItem(this.CURRENT_USER_KEY, user.id)

    return user
  }

  async saveOrder(order: Order): Promise<Order> {
    if (typeof window === "undefined") throw new Error("Cannot save order on server")

    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || "[]")
    const existingIndex = orders.findIndex((o: Order) => o.id === order.id)

    if (existingIndex >= 0) {
      orders[existingIndex] = order
    } else {
      orders.push(order)
    }

    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders))
    return order
  }

  async getOrder(orderId: string): Promise<Order | null> {
    if (typeof window === "undefined") return null
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || "[]")
    const order = orders.find((o: Order) => o.id === orderId)
    return order ? { ...order, createdAt: new Date(order.createdAt), updatedAt: new Date(order.updatedAt) } : null
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    if (typeof window === "undefined") return []
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || "[]")
    return orders
      .filter((order: Order) => order.customerInfo.email) // Basic filtering - in real app would use proper user association
      .map((order: Order) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
      }))
  }

  async saveAnalyticsEvent(eventData: Omit<AnalyticsEvent, "id" | "timestamp">): Promise<AnalyticsEvent> {
    if (typeof window === "undefined") throw new Error("Cannot save analytics on server")

    const event: AnalyticsEvent = {
      ...eventData,
      id: this.generateId(),
      timestamp: new Date(),
    }

    const events = JSON.parse(localStorage.getItem(this.ANALYTICS_KEY) || "[]")
    events.push(event)

    if (events.length > 10000) {
      events.splice(0, events.length - 10000)
    }

    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(events))
    return event
  }

  async getAnalyticsEvents(siteId: string, startDate?: Date, endDate?: Date): Promise<AnalyticsEvent[]> {
    if (typeof window === "undefined") return []

    const events = JSON.parse(localStorage.getItem(this.ANALYTICS_KEY) || "[]")
    return events
      .filter((event: AnalyticsEvent) => {
        if (event.siteId !== siteId) return false

        const eventDate = new Date(event.timestamp)
        if (startDate && eventDate < startDate) return false
        if (endDate && eventDate > endDate) return false

        return true
      })
      .map((event: AnalyticsEvent) => ({
        ...event,
        timestamp: new Date(event.timestamp),
      }))
  }

  async getAnalyticsStats(siteId: string): Promise<AnalyticsStats> {
    const events = await this.getAnalyticsEvents(siteId)

    const pageviews = events.filter((e) => e.type === "pageview")
    const clicks = events.filter((e) => e.type === "cta_click")

    const pageStats = pageviews.reduce(
      (acc, event) => {
        acc[event.path] = (acc[event.path] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topPages = Object.entries(pageStats)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    const ctaStats = clicks.reduce(
      (acc, event) => {
        const ctaText = event.metadata?.ctaText || "Unknown CTA"
        acc[ctaText] = (acc[ctaText] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topCTAs = Object.entries(ctaStats)
      .map(([text, clicks]) => ({ text, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentEvents = events.filter((e) => new Date(e.timestamp) >= thirtyDaysAgo)
    const dailyStats = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const dateStr = date.toISOString().split("T")[0]

      const dayEvents = recentEvents.filter((e) => new Date(e.timestamp).toISOString().split("T")[0] === dateStr)

      return {
        date: dateStr,
        pageviews: dayEvents.filter((e) => e.type === "pageview").length,
        clicks: dayEvents.filter((e) => e.type === "cta_click").length,
      }
    })

    const conversionRate = pageviews.length > 0 ? (clicks.length / pageviews.length) * 100 : 0

    return {
      siteId,
      totalPageviews: pageviews.length,
      totalClicks: clicks.length,
      topPages,
      topCTAs,
      dailyStats,
      conversionRate: Math.round(conversionRate * 100) / 100,
      lastUpdated: new Date(),
    }
  }

  async deleteAnalyticsEvents(siteId: string): Promise<void> {
    if (typeof window === "undefined") return

    const events = JSON.parse(localStorage.getItem(this.ANALYTICS_KEY) || "[]")
    const filtered = events.filter((event: AnalyticsEvent) => event.siteId !== siteId)
    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(filtered))
  }
}

export const storage: IStorage = new LocalStorage()
