import type { MetadataRoute } from "next"
import { storage } from "@/lib/storage"
import { generateSitemap } from "@/utils/seo"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sites = await storage.getAllSites()
  const siteEntries = generateSitemap(sites)

  return [
    {
      url: "/",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "/auth",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "/onboarding",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...siteEntries,
  ]
}
