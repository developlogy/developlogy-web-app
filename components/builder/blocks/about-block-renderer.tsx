"use client"

import { EditableText } from "../editable-text"
import type { AboutBlock, Theme } from "@/types"

interface AboutBlockRendererProps {
  block: AboutBlock
  theme: Theme
  isEditing: boolean
  onUpdate: (updates: Partial<AboutBlock>) => void
}

export function AboutBlockRenderer({ block, theme, isEditing, onUpdate }: AboutBlockRendererProps) {
  return (
    <section className="py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <EditableText
              value={block.title}
              onChange={(title) => onUpdate({ title })}
              isEditing={isEditing}
              className="text-3xl font-bold mb-6"
              style={{
                color: theme.color,
                fontSize: `${theme.fontScale * 2}rem`,
              }}
              placeholder="Section Title"
            />

            <EditableText
              value={block.body}
              onChange={(body) => onUpdate({ body })}
              isEditing={isEditing}
              className="text-lg leading-relaxed text-muted-foreground"
              style={{ fontSize: `${theme.fontScale}rem` }}
              placeholder="Tell your story here..."
              multiline
            />
          </div>

          <div className="flex justify-center">
            {block.image ? (
              <img
                src={block.image || "/placeholder.svg"}
                alt="About us"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            ) : (
              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Click to add image</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
