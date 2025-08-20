"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  isEditing: boolean
  className?: string
  style?: React.CSSProperties
  placeholder?: string
  multiline?: boolean
}

export function EditableText({
  value,
  onChange,
  isEditing,
  className,
  style,
  placeholder,
  multiline = false,
}: EditableTextProps) {
  const [isEditingText, setIsEditingText] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditingText) {
      if (multiline) {
        textareaRef.current?.focus()
        textareaRef.current?.select()
      } else {
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
  }, [isEditingText, multiline])

  const handleSave = () => {
    onChange(editValue)
    setIsEditingText(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditingText(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  if (isEditing && isEditingText) {
    if (multiline) {
      return (
        <Textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={cn("min-h-[100px]", className)}
          style={style}
          placeholder={placeholder}
        />
      )
    }

    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={className}
        style={style}
        placeholder={placeholder}
      />
    )
  }

  return (
    <div
      className={cn(
        "cursor-text",
        isEditing && "hover:bg-muted/50 rounded px-2 py-1 transition-colors",
        !value && "text-muted-foreground italic",
        className,
      )}
      style={style}
      onClick={() => isEditing && setIsEditingText(true)}
    >
      {value || placeholder || "Click to edit"}
    </div>
  )
}
