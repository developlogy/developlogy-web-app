"use client"

import { EditableText } from "../editable-text"
import type { GalleryBlock, Theme } from "@/types"

interface GalleryBlockRendererProps {
  block: GalleryBlock
  theme: Theme
  isEditing: boolean
  onUpdate: (updates: Partial<GalleryBlock>) => void
}

export function GalleryBlockRenderer({ block, theme, isEditing, onUpdate }: GalleryBlockRendererProps) {
  return (
    <section className="py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <EditableText
            value={block.title}
            onChange={(title) => onUpdate({ title })}
            isEditing={isEditing}
            className="text-3xl font-bold"
            style={{
              color: theme.color,
              fontSize: `${theme.fontScale * 2}rem`,
            }}
            placeholder="Gallery Title"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.images.map((image, index) => (
            <div key={index} className="aspect-square overflow-hidden rounded-lg">
              <img
                src={image || "/placeholder.svg"}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
