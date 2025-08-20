// SEO utilities for meta tags, structured data, and social sharing

import type { SEO, Site } from "@/types"

export interface SEOConfig extends SEO {
  ogImage?: string
  canonical?: string
}

export interface SEOValidation {
  isValid: boolean
  issues: string[]
}

export function validateSEO(seo: SEO): SEOValidation {
  const issues: string[] = []

  if (!seo.title || seo.title.length < 10) {
    issues.push("Title is too short (minimum 10 characters)")
  }
  if (seo.title && seo.title.length > 60) {
    issues.push("Title is too long (maximum 60 characters)")
  }
  if (!seo.description || seo.description.length < 50) {
    issues.push("Description is too short (minimum 50 characters)")
  }
  if (seo.description && seo.description.length > 160) {
    issues.push("Description is too long (maximum 160 characters)")
  }
  if (!seo.keywords || seo.keywords.length < 3) {
    issues.push("Add at least 3 keywords")
  }
  if (seo.keywords && seo.keywords.length > 10) {
    issues.push("Too many keywords (maximum 10)")
  }

  return {
    isValid: issues.length === 0,
    issues,
  }
}

export function generateMetaTags(seo: SEOConfig, siteId?: string) {
  const ogImage = seo.ogImage || (siteId ? `/api/og/${siteId}` : undefined)

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(", "),
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ogImage ? [ogImage] : undefined,
    },
    canonical: seo.canonical,
    robots: {
      index: true,
      follow: true,
    },
  }
}

export function generateStructuredData(site: Site, url?: string) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    description: site.seo.description,
    url: url,
    publisher: {
      "@type": "Organization",
      name: site.name,
      address: site.businessInfo.address
        ? {
            "@type": "PostalAddress",
            streetAddress: site.businessInfo.address,
          }
        : undefined,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: site.businessInfo.phone,
        email: site.businessInfo.email,
      },
    },
  }

  // Add business-specific structured data
  if (site.industry.includes("Restaurant") || site.industry.includes("Café")) {
    return {
      ...structuredData,
      "@type": "Restaurant",
      servesCuisine: "Various",
    }
  }

  if (site.industry.includes("Clinic") || site.industry.includes("Hospital")) {
    return {
      ...structuredData,
      "@type": "MedicalOrganization",
    }
  }

  if (site.industry.includes("Real Estate")) {
    return {
      ...structuredData,
      "@type": "RealEstateAgent",
    }
  }

  return structuredData
}

export function generateDefaultSEO(businessName: string, industry: string): SEO {
  return {
    title: `${businessName} - Professional ${industry} Services`,
    description: `Discover ${businessName}, your trusted ${industry.toLowerCase()} provider. Quality services, professional expertise, and customer satisfaction guaranteed.`,
    keywords: [
      businessName.toLowerCase(),
      industry.toLowerCase(),
      "professional services",
      "quality",
      "trusted",
      "local business",
    ],
  }
}

export function generateSitemapXML(sites: Site[], baseUrl?: string): string {
  const urls = sites
    .map((site) => {
      const url = baseUrl ? `${baseUrl}/preview/${site.id}` : `/preview/${site.id}`
      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${site.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    })
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl || "https://yoursite.com"}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${urls}
</urlset>`
}

export function generateRobotsTXT(baseUrl?: string): string {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl || "https://yoursite.com"}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /builder/
Disallow: /dashboard/
Disallow: /onboarding/
Disallow: /auth/
Disallow: /checkout/`
}

export function generateSEOTags(seo: SEO, businessInfo?: any) {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(", "),
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export function generateSitemap(sites: any[]) {
  return sites.map((site) => ({
    url: `/preview/${site.id}`,
    lastModified: new Date(site.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))
}
