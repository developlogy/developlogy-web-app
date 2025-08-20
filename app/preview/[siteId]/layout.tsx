import type React from "react"
export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="preview-mode">{children}</div>
}
