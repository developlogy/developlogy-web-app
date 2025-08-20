"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EditableText } from "../editable-text"
import { Plus, Trash2, Star } from "lucide-react"
import type { TestimonialsBlock, Theme } from "@/types"

interface TestimonialsBlockRendererProps {
  block: TestimonialsBlock
  theme: Theme
  isEditing: boolean
  onUpdate: (updates: Partial<TestimonialsBlock>) => void
}

export function TestimonialsBlockRenderer({ block, theme, isEditing, onUpdate }: TestimonialsBlockRendererProps) {
  const addTestimonial = () => {
    const newTestimonial = {
      name: "Customer Name",
      quote: "Great service and professional team!",
    }
    onUpdate({ items: [...block.items, newTestimonial] })
  }

  const updateTestimonial = (index: number, updates: Partial<(typeof block.items)[0]>) => {
    const updatedItems = block.items.map((item, i) => (i === index ? { ...item, ...updates } : item))
    onUpdate({ items: updatedItems })
  }

  const deleteTestimonial = (index: number) => {
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
            className="text-3xl font-bold"
            style={{
              color: theme.color,
              fontSize: `${theme.fontScale * 2}rem`,
            }}
            placeholder="Testimonials Title"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {block.items.map((testimonial, index) => (
            <Card key={index} className="relative group">
              {isEditing && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => deleteTestimonial(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}

              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                <blockquote className="text-lg mb-4">
                  <EditableText
                    value={`"${testimonial.quote}"`}
                    onChange={(quote) => updateTestimonial(index, { quote: quote.replace(/"/g, "") })}
                    isEditing={isEditing}
                    placeholder="Customer testimonial"
                    multiline
                  />
                </blockquote>

                <div className="font-semibold" style={{ color: theme.color }}>
                  <EditableText
                    value={testimonial.name}
                    onChange={(name) => updateTestimonial(index, { name })}
                    isEditing={isEditing}
                    placeholder="Customer Name"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {isEditing && (
            <Card
              className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={addTestimonial}
            >
              <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                <div className="text-center">
                  <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <span className="text-muted-foreground">Add Testimonial</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
