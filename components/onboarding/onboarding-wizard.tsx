"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BusinessInfoStep } from "./business-info-step"
import { BusinessDetailsStep } from "./business-details-step"
import { TemplateSelectionStep } from "./template-selection-step"
import { generateDemoContent } from "@/lib/content-generator"
import { storage } from "@/lib/storage"
import { useAppStore } from "@/lib/store"
import type { Industry, BusinessInfo } from "@/types"

export interface OnboardingData {
  businessName: string
  industry: Industry
  logoUrl?: string
  businessInfo: BusinessInfo
  templateId?: string
}

const steps = [
  {
    title: "Business Information",
    description: "Tell us about your business",
  },
  {
    title: "Contact Details",
    description: "Add your business contact information",
  },
  {
    title: "Choose Template",
    description: "Select a template that fits your industry",
  },
]

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    businessName: "",
    industry: "Restaurants & Cafés",
    businessInfo: {},
  })

  const router = useRouter()
  const { user } = useAppStore()

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDataUpdate = useCallback((stepData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...stepData }))
  }, [])

  const handleComplete = async () => {
    if (!user) {
      router.push("/auth")
      return
    }

    setIsLoading(true)
    try {
      // Generate demo content based on the collected data
      const siteData = generateDemoContent(data.industry, data.businessName, data.businessInfo)

      // Create the site in storage
      const newSite = await storage.createSite(siteData)

      // Redirect to the builder
      router.push(`/builder/${newSite.id}`)
    } catch (error) {
      console.error("Failed to create site:", error)
      // Handle error - could show a toast or error message
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.businessName.trim().length > 0 && data.industry
      case 1:
        return true // Business details are optional
      case 2:
        return true // Template selection is optional, will use default
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Your Website</h1>
            <p className="text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-2">{Math.round(progress)}% Complete</div>
            <Progress value={progress} className="w-32" />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <div className="hidden sm:block">
                <div className={`font-medium ${index <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {currentStep === 0 && <BusinessInfoStep data={data} onUpdate={handleDataUpdate} />}
          {currentStep === 1 && <BusinessDetailsStep data={data} onUpdate={handleDataUpdate} />}
          {currentStep === 2 && <TemplateSelectionStep data={data} onUpdate={handleDataUpdate} />}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2 bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-4">
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={!canProceed()} className="flex items-center gap-2">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={!canProceed() || isLoading} className="flex items-center gap-2">
              {isLoading ? "Generating Website..." : "Generate Website"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
