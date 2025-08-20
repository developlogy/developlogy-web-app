"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Eye } from "lucide-react"
import { templates, getTemplatesByIndustry } from "@/lib/templates"
import type { OnboardingData } from "@/types"

interface TemplateSelectionStepProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
}

export function TemplateSelectionStep({ data, onUpdate }: TemplateSelectionStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(data.templateId)

  // Get templates for the selected industry, fallback to all templates
  const industryTemplates = getTemplatesByIndustry(data.industry)
  const availableTemplates = industryTemplates.length > 0 ? industryTemplates : templates.slice(0, 6)

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    onUpdate({ templateId })
  }

  const getPreviewImage = (templateId: string) => {
    // Generate preview images based on template
    const previewMap: Record<string, string> = {
      "restaurant-classic": "/placeholder.svg?height=300&width=400&text=Restaurant+Template",
      "clinic-modern": "/placeholder.svg?height=300&width=400&text=Healthcare+Template",
    }
    return previewMap[templateId] || "/placeholder.svg?height=300&width=400&text=Template+Preview"
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">Choose Your Starting Template</h3>
        <p className="text-muted-foreground">
          Select a template designed for {data.industry.toLowerCase()}. You can customize everything later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardContent className="p-0">
              {/* Template Preview */}
              <div className="relative">
                <img
                  src={getPreviewImage(template.id) || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors rounded-t-lg flex items-center justify-center opacity-0 hover:opacity-100">
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{template.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {template.industry}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Professional template with {template.blocks.length} sections included
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Selected Template</h4>
          <div className="flex items-center gap-3">
            <img
              src={getPreviewImage(selectedTemplate) || "/placeholder.svg"}
              alt="Selected template"
              className="w-16 h-12 object-cover rounded border"
            />
            <div>
              <div className="font-medium text-foreground">
                {templates.find((t) => t.id === selectedTemplate)?.name}
              </div>
              <div className="text-sm text-muted-foreground">Ready to customize for {data.businessName}</div>
            </div>
          </div>
        </div>
      )}

      {/* No Template Selected */}
      {!selectedTemplate && (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">
            Select a template above, or we'll choose the best one for your industry
          </p>
        </div>
      )}
    </div>
  )
}
