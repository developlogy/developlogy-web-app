"use client"

import { SortableBlock } from "./sortable-block"
import type { Block, Theme } from "@/types"

interface BlockCanvasProps {
  blocks: Block[]
  selectedBlockId: string | null
  onSelectBlock: (blockId: string | null) => void
  onUpdateBlock: (blockId: string, updates: Partial<Block>) => void
  onDeleteBlock: (blockId: string) => void
  theme: Theme
}

export function BlockCanvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  theme,
}: BlockCanvasProps) {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-background rounded-lg shadow-lg overflow-hidden">
        {blocks.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-dashed border-muted-foreground rounded"></div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No blocks yet</h3>
            <p className="text-muted-foreground">Add blocks from the sidebar to start building your website</p>
          </div>
        ) : (
          blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              onSelect={() => onSelectBlock(block.id)}
              onUpdate={(updates) => onUpdateBlock(block.id, updates)}
              onDelete={() => onDeleteBlock(block.id)}
              theme={theme}
            />
          ))
        )}
      </div>
    </div>
  )
}
