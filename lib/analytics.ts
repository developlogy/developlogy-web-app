import { storage } from "./storage"

class AnalyticsTracker {
  private sessionId: string
  private isEnabled = true

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private getUserAgent(): string {
    return typeof window !== "undefined" ? window.navigator.userAgent : ""
  }

  private getReferrer(): string {
    return typeof window !== "undefined" ? document.referrer : ""
  }

  async trackPageview(siteId: string, path: string) {
    if (!this.isEnabled || typeof window === "undefined") return

    try {
      await storage.saveAnalyticsEvent({
        siteId,
        type: "pageview",
        path,
        metadata: {
          referrer: this.getReferrer(),
          userAgent: this.getUserAgent(),
          sessionId: this.sessionId,
        },
      })
    } catch (error) {
      console.error("Failed to track pageview:", error)
    }
  }

  async trackCTAClick(siteId: string, path: string, ctaText: string, ctaPosition?: string) {
    if (!this.isEnabled || typeof window === "undefined") return

    try {
      await storage.saveAnalyticsEvent({
        siteId,
        type: "cta_click",
        path,
        metadata: {
          ctaText,
          ctaPosition,
          sessionId: this.sessionId,
        },
      })
    } catch (error) {
      console.error("Failed to track CTA click:", error)
    }
  }

  async trackProductView(siteId: string, path: string, productId: string) {
    if (!this.isEnabled || typeof window === "undefined") return

    try {
      await storage.saveAnalyticsEvent({
        siteId,
        type: "product_view",
        path,
        metadata: {
          productId,
          sessionId: this.sessionId,
        },
      })
    } catch (error) {
      console.error("Failed to track product view:", error)
    }
  }

  async trackAddToCart(siteId: string, path: string, productId: string) {
    if (!this.isEnabled || typeof window === "undefined") return

    try {
      await storage.saveAnalyticsEvent({
        siteId,
        type: "add_to_cart",
        path,
        metadata: {
          productId,
          sessionId: this.sessionId,
        },
      })
    } catch (error) {
      console.error("Failed to track add to cart:", error)
    }
  }

  async trackFormSubmit(siteId: string, path: string, formType: string) {
    if (!this.isEnabled || typeof window === "undefined") return

    try {
      await storage.saveAnalyticsEvent({
        siteId,
        type: "form_submit",
        path,
        metadata: {
          formType,
          sessionId: this.sessionId,
        },
      })
    } catch (error) {
      console.error("Failed to track form submit:", error)
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
  }

  isTrackingEnabled(): boolean {
    return this.isEnabled
  }
}

// Export singleton instance
export const analytics = new AnalyticsTracker()

// React hook for analytics
export function useAnalytics() {
  return {
    trackPageview: analytics.trackPageview.bind(analytics),
    trackCTAClick: analytics.trackCTAClick.bind(analytics),
    trackProductView: analytics.trackProductView.bind(analytics),
    trackAddToCart: analytics.trackAddToCart.bind(analytics),
    trackFormSubmit: analytics.trackFormSubmit.bind(analytics),
    setEnabled: analytics.setEnabled.bind(analytics),
    isEnabled: analytics.isTrackingEnabled.bind(analytics),
  }
}
