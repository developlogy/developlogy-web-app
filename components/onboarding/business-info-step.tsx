"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import { useEffect, useCallback } from "react"
import type { OnboardingData, Industry } from "@/types"

const industries: Industry[] = [
  "Restaurants & Cafés",
  "Clinics & Hospitals",
  "Real Estate Agencies",
  "Small E-commerce Stores",
  "Salons & Spas",
  "Freelancers & Agencies",
  "Educational Institutes",
  "Boutiques & Clothing Shops",
  "Gyms & Fitness Centers",
  "Travel Agencies",
  "Event Planners",
  "Law Firms",
  "Accounting & Tax Consultants",
  "Local Retail Shops",
  "Repair & Maintenance Services",
  "Home Decor & Furniture Shops",
  "Photography Studios",
  "Digital Creators & Influencers",
  "NGOs & Nonprofits",
  "Pet Shops & Veterinary Clinics",
]

const schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Please select an industry"),
})

type FormData = z.infer<typeof schema>

interface BusinessInfoStepProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
}

export function BusinessInfoStep({ data, onUpdate }: BusinessInfoStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: data.businessName,
      industry: data.industry,
    },
  })

  const businessName = watch("businessName")
  const industry = watch("industry")

  const updateData = useCallback(() => {
    onUpdate({
      businessName: businessName || "",
      industry: (industry as Industry) || "Restaurants & Cafés",
    })
  }, [businessName, industry, onUpdate])

  useEffect(() => {
    updateData()
  }, [updateData])

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you'd upload to a service like Vercel Blob
      // For now, we'll create a placeholder URL
      const logoUrl = `/placeholder.svg?height=60&width=60&text=${encodeURIComponent(data.businessName.substring(0, 2))}`
      onUpdate({ logoUrl })
    }
  }

  const removeLogo = () => {
    onUpdate({ logoUrl: undefined })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Name */}
        <div className="space-y-2">
          <Label htmlFor="businessName">
            Business Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="businessName"
            placeholder="Enter your business name"
            {...register("businessName")}
            className={errors.businessName ? "border-destructive" : ""}
          />
          {errors.businessName && <p className="text-sm text-destructive">{errors.businessName.message}</p>}
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label htmlFor="industry">
            Industry <span className="text-destructive">*</span>
          </Label>
          <Select value={data.industry} onValueChange={(value) => setValue("industry", value)}>
            <SelectTrigger className={errors.industry ? "border-destructive" : ""}>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && <p className="text-sm text-destructive">{errors.industry.message}</p>}
        </div>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label>Logo (Optional)</Label>
        <div className="flex items-center gap-4">
          {data.logoUrl ? (
            <div className="relative">
              <img
                src={data.logoUrl || "/placeholder.svg"}
                alt="Business logo"
                className="w-16 h-16 rounded-lg border border-border object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                onClick={removeLogo}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="w-16 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1">
            <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            <Button type="button" variant="outline" onClick={() => document.getElementById("logo-upload")?.click()}>
              {data.logoUrl ? "Change Logo" : "Upload Logo"}
            </Button>
            <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 2MB. Recommended size: 200x200px</p>
          </div>
        </div>
      </div>

      {/* Preview */}
      {data.businessName && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-2">Preview</h3>
          <div className="flex items-center gap-3">
            {data.logoUrl && (
              <img src={data.logoUrl || "/placeholder.svg"} alt="Logo" className="w-8 h-8 rounded object-cover" />
            )}
            <div>
              <div className="font-medium text-foreground">{data.businessName}</div>
              <div className="text-sm text-muted-foreground">{data.industry}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
