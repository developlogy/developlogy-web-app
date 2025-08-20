"use client"

import { EditableText } from "../editable-text"
import { MapPin, Phone, Mail } from "lucide-react"
import type { ContactBlock, Theme } from "@/types"

interface ContactBlockRendererProps {
  block: ContactBlock
  theme: Theme
  isEditing: boolean
  onUpdate: (updates: Partial<ContactBlock>) => void
}

export function ContactBlockRenderer({ block, theme, isEditing, onUpdate }: ContactBlockRendererProps) {
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
            placeholder="Contact Title"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6" style={{ color: theme.color }} />
            </div>
            <h3 className="font-semibold mb-2">Email</h3>
            <EditableText
              value={block.email}
              onChange={(email) => onUpdate({ email })}
              isEditing={isEditing}
              className="text-muted-foreground"
              placeholder="email@example.com"
            />
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6" style={{ color: theme.color }} />
            </div>
            <h3 className="font-semibold mb-2">Phone</h3>
            <EditableText
              value={block.phone}
              onChange={(phone) => onUpdate({ phone })}
              isEditing={isEditing}
              className="text-muted-foreground"
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6" style={{ color: theme.color }} />
            </div>
            <h3 className="font-semibold mb-2">Address</h3>
            <EditableText
              value={block.address}
              onChange={(address) => onUpdate({ address })}
              isEditing={isEditing}
              className="text-muted-foreground"
              placeholder="123 Business Street, City"
              multiline
            />
          </div>
        </div>
      </div>
    </section>
  )
}
