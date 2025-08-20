"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Zap, User, Briefcase, ImageIcon, MessageSquare, Phone, Plus, ShoppingBag } from "lucide-react"
import type { Block } from "@/types"

interface BlocksSidebarProps {
  onAddBlock: (blockType: Block["type"]) => void
}

const blockTypes = [
  {
    type: "hero" as const,
    name: "Hero Section",
    description: "Eye-catching header with call-to-action",
    icon: Zap,
  },
  {
    type: "about" as const,
    name: "About Us",
    description: "Tell your story and build trust",
    icon: User,
  },
  {
    type: "services" as const,
    name: "Services",
    description: "Showcase your products or services",
    icon: Briefcase,
  },
  {
    type: "products" as const,
    name: "Products",
    description: "Display your products with prices and details",
    icon: ShoppingBag,
  },
  {
    type: "gallery" as const,
    name: "Gallery",
    description: "Display images and portfolio",
    icon: ImageIcon,
  },
  {
    type: "testimonials" as const,
    name: "Testimonials",
    description: "Customer reviews and feedback",
    icon: MessageSquare,
  },
  {
    type: "contact" as const,
    name: "Contact",
    description: "Contact information and form",
    icon: Phone,
  },
]

export function BlocksSidebar({ onAddBlock }: BlocksSidebarProps) {
  return (
    <div className="w-80 border-r border-border bg-background">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Add Blocks</h2>
        <p className="text-sm text-muted-foreground">Drag and drop to reorder</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {blockTypes.map((blockType) => (
            <Card
              key={blockType.type}
              className="cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => onAddBlock(blockType.type)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <blockType.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground mb-1">{blockType.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{blockType.description}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
