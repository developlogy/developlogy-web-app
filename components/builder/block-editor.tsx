"use client"

import { useState, useCallback } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { EditorHeader } from "./editor-header"
import { BlocksSidebar } from "./blocks-sidebar"
import { ThemeSidebar } from "./theme-sidebar"
import { BlockCanvas } from "./block-canvas"
import { storage } from "@/lib/storage"
import { useAppStore } from "@/lib/store"
import type { Site, Block } from "@/types"

interface BlockEditorProps {
  site: Site
}

export function BlockEditor({ site: initialSite }: BlockEditorProps) {
  const [site, setSite] = useState<Site>(initialSite)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showThemeSidebar, setShowThemeSidebar] = useState(false)
  const { updateCurrentSite } = useAppStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, over } = event

      if (active.id !== over.id) {
        const oldIndex = site.blocks.findIndex((block) => block.id === active.id)
        const newIndex = site.blocks.findIndex((block) => block.id === over.id)

        const newBlocks = arrayMove(site.blocks, oldIndex, newIndex)
        const updatedSite = { ...site, blocks: newBlocks, updatedAt: new Date() }
        setSite(updatedSite)
        updateCurrentSite(updatedSite)
      }
    },
    [site.blocks, site, updateCurrentSite],
  )

  const handleBlockUpdate = useCallback(
    (blockId: string, updates: Partial<Block>) => {
      const updatedBlocks = site.blocks.map((block) => (block.id === blockId ? { ...block, ...updates } : block))
      const updatedSite = { ...site, blocks: updatedBlocks, updatedAt: new Date() }
      setSite(updatedSite)
      updateCurrentSite(updatedSite)
    },
    [site, updateCurrentSite],
  )

  const handleAddBlock = useCallback(
    (blockType: Block["type"]) => {
      const newBlock: Block = {
        id: `block_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        type: blockType,
        ...getDefaultBlockContent(blockType),
      } as Block

      const updatedBlocks = [...site.blocks, newBlock]
      const updatedSite = { ...site, blocks: updatedBlocks, updatedAt: new Date() }
      setSite(updatedSite)
      updateCurrentSite(updatedSite)
      setSelectedBlockId(newBlock.id)
    },
    [site, updateCurrentSite],
  )

  const handleDeleteBlock = useCallback(
    (blockId: string) => {
      const updatedBlocks = site.blocks.filter((block) => block.id !== blockId)
      const updatedSite = { ...site, blocks: updatedBlocks, updatedAt: new Date() }
      setSite(updatedSite)
      updateCurrentSite(updatedSite)
      if (selectedBlockId === blockId) {
        setSelectedBlockId(null)
      }
    },
    [site, updateCurrentSite, selectedBlockId],
  )

  const handleSiteUpdate = useCallback(
    (updates: Partial<Site>) => {
      const updatedSite = { ...site, ...updates, updatedAt: new Date() }
      setSite(updatedSite)
      updateCurrentSite(updatedSite)
    },
    [site, updateCurrentSite],
  )

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      await storage.updateSite(site.id, site)
    } catch (error) {
      console.error("Failed to save site:", error)
    } finally {
      setIsSaving(false)
    }
  }, [site])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <EditorHeader
        site={site}
        onSave={handleSave}
        isSaving={isSaving}
        onToggleTheme={() => setShowThemeSidebar(!showThemeSidebar)}
        showThemeSidebar={showThemeSidebar}
      />

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Blocks */}
        <BlocksSidebar onAddBlock={handleAddBlock} />

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-muted/30">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={site.blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
              <BlockCanvas
                blocks={site.blocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onUpdateBlock={handleBlockUpdate}
                onDeleteBlock={handleDeleteBlock}
                theme={site.theme}
              />
            </SortableContext>
          </DndContext>
        </div>

        {/* Right Sidebar - Theme & SEO */}
        {showThemeSidebar && (
          <ThemeSidebar site={site} onUpdateSite={handleSiteUpdate} onClose={() => setShowThemeSidebar(false)} />
        )}
      </div>
    </div>
  )
}

function getDefaultBlockContent(blockType: Block["type"]): Omit<Block, "id" | "type"> {
  switch (blockType) {
    case "hero":
      return {
        heading: "Welcome to Our Business",
        subheading: "We provide exceptional services to help you succeed",
        ctaLabel: "Get Started",
        backgroundImage: undefined,
      }
    case "about":
      return {
        title: "About Us",
        body: "We are passionate about delivering quality services that exceed expectations. Our team is dedicated to your success.",
        image: undefined,
      }
    case "services":
      return {
        title: "Our Services",
        items: [
          {
            name: "Service 1",
            description: "Description of your first service",
            price: "₹999",
          },
          {
            name: "Service 2",
            description: "Description of your second service",
            price: "₹1,499",
          },
        ],
      }
    case "products":
      return {
        title: "Our Products",
        products: [
          {
            id: `product_${Date.now()}_1`,
            name: "Sample Product",
            price: 29.99,
            description: "This is a sample product to get you started. Edit or delete this product and add your own.",
            image: "/diverse-products-still-life.png",
            badges: ["New"],
            category: "Sample",
            inStock: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        displayMode: "grid" as const,
        showPrices: true,
      }
    case "gallery":
      return {
        title: "Gallery",
        images: [
          "/placeholder.svg?height=300&width=400&text=Image+1",
          "/placeholder.svg?height=300&width=400&text=Image+2",
          "/placeholder.svg?height=300&width=400&text=Image+3",
        ],
      }
    case "testimonials":
      return {
        title: "What Our Customers Say",
        items: [
          {
            name: "John Doe",
            quote: "Excellent service and professional team. Highly recommended!",
          },
          {
            name: "Jane Smith",
            quote: "Outstanding quality and attention to detail. Very satisfied!",
          },
        ],
      }
    case "contact":
      return {
        title: "Get In Touch",
        email: "info@example.com",
        phone: "+91 98765 43210",
        address: "123 Business Street, City, State 400001",
        mapEmbedUrl: undefined,
      }
    default:
      return {}
  }
}
