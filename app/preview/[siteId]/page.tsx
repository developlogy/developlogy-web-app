import { notFound } from "next/navigation"
import { storage } from "@/lib/storage"
import { generateSEOTags } from "@/utils/seo"
import { SiteRenderer } from "@/components/preview/site-renderer"
import type { Metadata } from "next"

interface PreviewPageProps {
  params: { siteId: string }
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const site = await storage.getSite(params.siteId)

  if (!site) {
    return {
      title: "Site Not Found",
      description: "The requested site could not be found.",
    }
  }

  return generateSEOTags(site.seo, site.businessInfo)
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const site = await storage.getSite(params.siteId)

  if (!site) {
    notFound()
  }

  return <SiteRenderer site={site} showPreviewHeader={true} />
}
