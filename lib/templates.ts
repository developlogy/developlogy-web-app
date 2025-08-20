// Pre-built templates for different industries

import type { Template, Industry } from "@/types"

export const templates: Template[] = [
  {
    id: "restaurant-classic",
    name: "Classic Restaurant",
    industry: "Restaurants & Cafés",
    theme: { color: "#D97706", fontScale: 1.1 },
    blocks: [
      {
        id: "hero-1",
        type: "hero",
        heading: "Authentic Flavours Await",
        subheading: "Experience the finest dining with fresh ingredients and traditional recipes",
        ctaLabel: "Reserve Table",
        backgroundImage: "/elegant-restaurant-dining-room.png",
      },
      {
        id: "about-1",
        type: "about",
        title: "Our Story",
        body: "For over two decades, we have been crafting exceptional dining experiences with passion, quality, and tradition at the heart of everything we do.",
        image: "/chef-preparing-food.png",
      },
      {
        id: "services-1",
        type: "services",
        title: "Our Menu Highlights",
        items: [
          {
            name: "Signature Appetizers",
            description: "Handcrafted starters to begin your culinary journey",
            price: "₹199-399",
          },
          {
            name: "Main Course Specialties",
            description: "Traditional and contemporary dishes made to perfection",
            price: "₹399-799",
          },
          {
            name: "Dessert Collection",
            description: "Sweet endings to complete your dining experience",
            price: "₹149-299",
          },
        ],
      },
    ],
  },
  {
    id: "clinic-modern",
    name: "Modern Healthcare",
    industry: "Clinics & Hospitals",
    theme: { color: "#059669", fontScale: 1.0 },
    blocks: [
      {
        id: "hero-2",
        type: "hero",
        heading: "Your Health, Our Priority",
        subheading: "Comprehensive healthcare services with advanced technology and compassionate care",
        ctaLabel: "Book Consultation",
        backgroundImage: "/modern-medical-facility.png",
      },
      {
        id: "about-2",
        type: "about",
        title: "Excellence in Healthcare",
        body: "Our team of qualified medical professionals is dedicated to providing personalized care using the latest medical technology and evidence-based practices.",
        image: "/placeholder-i9inm.png",
      },
      {
        id: "services-2",
        type: "services",
        title: "Medical Services",
        items: [
          {
            name: "General Medicine",
            description: "Comprehensive primary healthcare and preventive medicine",
            price: "₹500",
          },
          {
            name: "Specialist Consultations",
            description: "Expert care from certified medical specialists",
            price: "₹800-1200",
          },
          { name: "Diagnostic Services", description: "Advanced testing and imaging facilities", price: "₹200-2000" },
        ],
      },
    ],
  },
  // Add more templates as needed
]

export function getTemplatesByIndustry(industry: Industry): Template[] {
  return templates.filter((template) => template.industry === industry)
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((template) => template.id === id)
}
