"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import { useEffect } from "react"
import type { OnboardingData } from "@/types"

const schema = z.object({
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
})

type FormData = z.infer<typeof schema>

interface BusinessDetailsStepProps {
  data: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
}

export function BusinessDetailsStep({ data, onUpdate }: BusinessDetailsStepProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: data.businessInfo.address || "",
      phone: data.businessInfo.phone || "",
      email: data.businessInfo.email || "",
      facebook: data.businessInfo.socials?.facebook || "",
      instagram: data.businessInfo.socials?.instagram || "",
      twitter: data.businessInfo.socials?.twitter || "",
      linkedin: data.businessInfo.socials?.linkedin || "",
    },
  })

  const address = watch("address")
  const phone = watch("phone")
  const email = watch("email")
  const facebook = watch("facebook")
  const instagram = watch("instagram")
  const twitter = watch("twitter")
  const linkedin = watch("linkedin")

  useEffect(() => {
    onUpdate({
      businessInfo: {
        address: address || undefined,
        phone: phone || undefined,
        email: email || undefined,
        socials: {
          facebook: facebook || undefined,
          instagram: instagram || undefined,
          twitter: twitter || undefined,
          linkedin: linkedin || undefined,
        },
      },
    })
  }, [address, phone, email, facebook, instagram, twitter, linkedin, onUpdate])

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          Add your business contact information to help customers find and reach you. All fields are optional.
        </p>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="phone" placeholder="+91 98765 43210" className="pl-10" {...register("phone")} />
            </div>
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="info@yourbusiness.com"
                className="pl-10"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Business Address</Label>
          <Textarea
            id="address"
            placeholder="123 Business Street, City, State, PIN Code"
            rows={3}
            {...register("address")}
          />
          {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
        </div>
      </div>

      {/* Social Media */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Social Media Links</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <div className="relative">
              <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="facebook"
                placeholder="https://facebook.com/yourbusiness"
                className="pl-10"
                {...register("facebook")}
              />
            </div>
            {errors.facebook && <p className="text-sm text-destructive">{errors.facebook.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="instagram"
                placeholder="https://instagram.com/yourbusiness"
                className="pl-10"
                {...register("instagram")}
              />
            </div>
            {errors.instagram && <p className="text-sm text-destructive">{errors.instagram.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="twitter"
                placeholder="https://twitter.com/yourbusiness"
                className="pl-10"
                {...register("twitter")}
              />
            </div>
            {errors.twitter && <p className="text-sm text-destructive">{errors.twitter.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/company/yourbusiness"
                className="pl-10"
                {...register("linkedin")}
              />
            </div>
            {errors.linkedin && <p className="text-sm text-destructive">{errors.linkedin.message}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
