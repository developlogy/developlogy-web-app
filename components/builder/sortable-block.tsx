"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { BlockRenderer } from "./block-renderer"
import { Button } from "@/components/ui/button"
import { GripVertical, Trash2, Edit } from "lucide-react"
import type { Block, Theme } from "@/types"

interface SortableBlockProps {
  block: Block
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<Block>) => void
  onDelete: () => void
  theme: Theme
}

export function SortableBlock({ block, isSelected, onSelect, onUpdate, onDelete, theme }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={onSelect}
    >
      {/* Block Controls */}
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-lg border border-border p-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Block Content */}
      <BlockRenderer block={block} theme={theme} isEditing={isSelected} onUpdate={onUpdate} />
    </div>
  )
}
