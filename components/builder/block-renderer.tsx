"use client"

import { HeroBlockRenderer } from "./blocks/hero-block-renderer"
import { AboutBlockRenderer } from "./blocks/about-block-renderer"
import { ServicesBlockRenderer } from "./blocks/services-block-renderer"
import { GalleryBlockRenderer } from "./blocks/gallery-block-renderer"
import { TestimonialsBlockRenderer } from "./blocks/testimonials-block-renderer"
import { ContactBlockRenderer } from "./blocks/contact-block-renderer"
import { ProductsBlockRenderer } from "./blocks/products-block-renderer"
import type { Block, Theme } from "@/types"

interface BlockRendererProps {
  block: Block
  theme?: Theme
  isEditing: boolean
  onUpdate: (updates: Partial<Block>) => void
  onDelete?: () => void
}

export function BlockRenderer({ block, theme, isEditing, onUpdate, onDelete }: BlockRendererProps) {
  const commonProps = { theme, isEditing, onUpdate, onDelete }

  switch (block.type) {
    case "hero":
      return <HeroBlockRenderer block={block} {...commonProps} />
    case "about":
      return <AboutBlockRenderer block={block} {...commonProps} />
    case "services":
      return <ServicesBlockRenderer block={block} {...commonProps} />
    case "gallery":
      return <GalleryBlockRenderer block={block} {...commonProps} />
    case "testimonials":
      return <TestimonialsBlockRenderer block={block} {...commonProps} />
    case "contact":
      return <ContactBlockRenderer block={block} {...commonProps} />
    case "products":
      return <ProductsBlockRenderer block={block} {...commonProps} />
    default:
      return <div className="p-8 text-center text-muted-foreground">Unknown block type: {(block as any).type}</div>
  }
}
