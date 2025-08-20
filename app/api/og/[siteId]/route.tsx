import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import { storage } from "@/lib/storage"

export const runtime = "edge"

export async function GET(request: NextRequest, { params }: { params: { siteId: string } }) {
  try {
    const site = await storage.getSite(params.siteId)

    if (!site) {
      return new Response("Site not found", { status: 404 })
    }

    // Get hero block for background content
    const heroBlock = site.blocks.find((block) => block.type === "hero") as any

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          backgroundImage: `linear-gradient(135deg, ${site.theme.color}15 0%, ${site.theme.color}05 100%)`,
          position: "relative",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 25% 25%, ${site.theme.color}10 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${site.theme.color}08 0%, transparent 50%)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "80px",
            zIndex: 1,
          }}
        >
          {/* Site Name */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: site.theme.color,
              marginBottom: "24px",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {site.name}
          </div>

          {/* Industry Badge */}
          <div
            style={{
              backgroundColor: site.theme.color,
              color: "white",
              padding: "16px 32px",
              borderRadius: "50px",
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "32px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {site.industry}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "32px",
              color: "#374151",
              maxWidth: "800px",
              lineHeight: 1.4,
              marginBottom: "40px",
            }}
          >
            {site.seo.description || heroBlock?.subheading || `Professional ${site.industry.toLowerCase()} services`}
          </div>

          {/* Powered by */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "20px",
              color: "#9CA3AF",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#D97706",
                borderRadius: "8px",
                marginRight: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
              }}
            >
              D
            </div>
            Built with Developlogy
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error("Error generating OG image:", error)
    return new Response("Failed to generate image", { status: 500 })
  }
}
