"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditableText } from "../editable-text"
import { Plus, Trash2 } from "lucide-react"
import type { ServicesBlock, Theme } from "@/types"

interface ServicesBlockRendererProps {
  block: ServicesBlock
  theme: Theme
  isEditing: boolean
  onUpdate: (updates: Partial<ServicesBlock>) => void
}

export function ServicesBlockRenderer({ block, theme, isEditing, onUpdate }: ServicesBlockRendererProps) {
  const addService = () => {
    const newService = {
      name: "New Service",
      description: "Service description",
      price: "₹999",
    }
    onUpdate({ items: [...block.items, newService] })
  }

  const updateService = (index: number, updates: Partial<(typeof block.items)[0]>) => {
    const updatedItems = block.items.map((item, i) => (i === index ? { ...item, ...updates } : item))
    onUpdate({ items: updatedItems })
  }

  const deleteService = (index: number) => {
    const updatedItems = block.items.filter((_, i) => i !== index)
    onUpdate({ items: updatedItems })
  }

  return (
    <section className="py-16 px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <EditableText
            value={block.title}
            onChange={(title) => onUpdate({ title })}
            isEditing={isEditing}
            className="text-3xl font-bold mb-4"
            style={{
              color: theme.color,
              fontSize: `${theme.fontScale * 2}rem`,
            }}
            placeholder="Services Title"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.items.map((service, index) => (
            <Card key={index} className="relative group">
              {isEditing && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => deleteService(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}

              <CardHeader>
                <CardTitle>
                  <EditableText
                    value={service.name}
                    onChange={(name) => updateService(index, { name })}
                    isEditing={isEditing}
                    className="text-xl font-semibold"
                    placeholder="Service Name"
                  />
                </CardTitle>
                <CardDescription>
                  <EditableText
                    value={service.description}
                    onChange={(description) => updateService(index, { description })}
                    isEditing={isEditing}
                    className="text-muted-foreground"
                    placeholder="Service description"
                    multiline
                  />
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold" style={{ color: theme.color }}>
                  <EditableText
                    value={service.price || ""}
                    onChange={(price) => updateService(index, { price })}
                    isEditing={isEditing}
                    placeholder="Price"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {isEditing && (
            <Card
              className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={addService}
            >
              <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                <div className="text-center">
                  <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <span className="text-muted-foreground">Add Service</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
