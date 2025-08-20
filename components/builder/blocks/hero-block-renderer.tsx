"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditableText } from "../editable-text"
import type { HeroBlock, Theme } from "@/types"

interface HeroBlockRendererProps {
  block: HeroBlock
  theme: Theme
  isEditing: boolean
  onUpdate: (updates: Partial<HeroBlock>) => void
}

export function HeroBlockRenderer({ block, theme, isEditing, onUpdate }: HeroBlockRendererProps) {
  const [isEditingCTA, setIsEditingCTA] = useState(false)

  const safeTheme = {
    color: theme?.color || "#f59e0b",
    fontScale: theme?.fontScale || 1,
  }

  return (
    <section
      className="relative py-24 px-8 text-center"
      style={{
        backgroundColor: block.backgroundImage ? "transparent" : `${safeTheme.color}10`,
        backgroundImage: block.backgroundImage ? `url(${block.backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {block.backgroundImage && <div className="absolute inset-0 bg-black/40" />}

      <div className="relative z-10 max-w-4xl mx-auto">
        <EditableText
          value={block.heading}
          onChange={(heading) => onUpdate({ heading })}
          isEditing={isEditing}
          className="text-4xl md:text-6xl font-bold mb-6"
          style={{
            color: block.backgroundImage ? "white" : safeTheme.color,
            fontSize: `${safeTheme.fontScale * 3.5}rem`,
          }}
          placeholder="Enter your headline"
        />

        <EditableText
          value={block.subheading}
          onChange={(subheading) => onUpdate({ subheading })}
          isEditing={isEditing}
          className="text-xl md:text-2xl mb-8 text-muted-foreground"
          style={{
            color: block.backgroundImage ? "rgba(255,255,255,0.9)" : undefined,
            fontSize: `${safeTheme.fontScale * 1.25}rem`,
          }}
          placeholder="Enter your subheading"
        />

        <div className="flex justify-center">
          {isEditing && isEditingCTA ? (
            <Input
              value={block.ctaLabel}
              onChange={(e) => onUpdate({ ctaLabel: e.target.value })}
              onBlur={() => setIsEditingCTA(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditingCTA(false)}
              className="w-48 text-center"
              autoFocus
            />
          ) : (
            <Button
              size="lg"
              style={{ backgroundColor: safeTheme.color }}
              onClick={() => isEditing && setIsEditingCTA(true)}
              className="text-lg px-8 py-6 h-auto"
            >
              {block.ctaLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
