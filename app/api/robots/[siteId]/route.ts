import { type NextRequest, NextResponse } from "next/server"
import { generateRobotsTXT } from "@/utils/seo"

export async function GET(request: NextRequest, { params }: { params: { siteId: string } }) {
  try {
    const robots = generateRobotsTXT(process.env.NEXT_PUBLIC_BASE_URL)

    return new NextResponse(robots, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    })
  } catch (error) {
    console.error("Error generating robots.txt:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
