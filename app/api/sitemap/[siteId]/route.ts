import { type NextRequest, NextResponse } from "next/server"
import { storage } from "@/lib/storage"
import { generateSitemapXML } from "@/utils/seo"

export async function GET(request: NextRequest, { params }: { params: { siteId: string } }) {
  try {
    const site = await storage.getSite(params.siteId)

    if (!site) {
      return new NextResponse("Site not found", { status: 404 })
    }

    const sitemap = generateSitemapXML([site], process.env.NEXT_PUBLIC_BASE_URL)

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
