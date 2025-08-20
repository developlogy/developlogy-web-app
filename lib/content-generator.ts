// Generate demo content based on industry and business info

import type { Site, Industry, BusinessInfo, Block, Theme } from "@/types"
import { generateDefaultSEO } from "@/utils/seo"

export function generateDemoContent(
  industry: Industry,
  businessName: string,
  businessInfo: BusinessInfo,
): Omit<Site, "id" | "createdAt" | "updatedAt"> {
  const blocks = generateIndustryBlocks(industry, businessName, businessInfo)
  const theme = generateIndustryTheme(industry)
  const seo = generateDefaultSEO(businessName, industry)

  return {
    name: businessName,
    industry,
    businessInfo,
    theme,
    blocks,
    seo,
  }
}

function generateIndustryBlocks(industry: Industry, businessName: string, businessInfo: BusinessInfo): Block[] {
  const baseId = () => Math.random().toString(36).substring(2)

  const industryContent = getIndustryContent(industry, businessName)

  return [
    {
      id: baseId(),
      type: "hero",
      heading: industryContent.hero.heading,
      subheading: industryContent.hero.subheading,
      ctaLabel: industryContent.hero.ctaLabel,
      backgroundImage: industryContent.hero.backgroundImage,
    },
    {
      id: baseId(),
      type: "about",
      title: "About Us",
      body: industryContent.about.body,
      image: industryContent.about.image,
    },
    {
      id: baseId(),
      type: "services",
      title: industryContent.services.title,
      items: industryContent.services.items,
    },
    {
      id: baseId(),
      type: "testimonials",
      title: "What Our Customers Say",
      items: industryContent.testimonials.items,
    },
    {
      id: baseId(),
      type: "contact",
      title: "Get In Touch",
      email: businessInfo.email || "info@example.com",
      phone: businessInfo.phone || "+91 98765 43210",
      address: businessInfo.address || "123 Business Street, City, State 400001",
    },
  ] as Block[]
}

function generateIndustryTheme(industry: Industry): Theme {
  const themeMap: Record<Industry, { color: string; fontScale: number }> = {
    "Restaurants & Cafés": { color: "#D97706", fontScale: 1.1 },
    "Clinics & Hospitals": { color: "#059669", fontScale: 1.0 },
    "Real Estate Agencies": { color: "#1D4ED8", fontScale: 1.0 },
    "Small E-commerce Stores": { color: "#7C3AED", fontScale: 1.0 },
    "Salons & Spas": { color: "#EC4899", fontScale: 1.1 },
    "Freelancers & Agencies": { color: "#0F172A", fontScale: 1.0 },
    "Educational Institutes": { color: "#1E40AF", fontScale: 1.0 },
    "Boutiques & Clothing Shops": { color: "#BE185D", fontScale: 1.1 },
    "Gyms & Fitness Centers": { color: "#DC2626", fontScale: 1.1 },
    "Travel Agencies": { color: "#0891B2", fontScale: 1.0 },
    "Event Planners": { color: "#A855F7", fontScale: 1.1 },
    "Law Firms": { color: "#374151", fontScale: 1.0 },
    "Accounting & Tax Consultants": { color: "#065F46", fontScale: 1.0 },
    "Local Retail Shops": { color: "#EA580C", fontScale: 1.0 },
    "Repair & Maintenance Services": { color: "#0F766E", fontScale: 1.0 },
    "Home Decor & Furniture Shops": { color: "#92400E", fontScale: 1.0 },
    "Photography Studios": { color: "#1F2937", fontScale: 1.1 },
    "Digital Creators & Influencers": { color: "#C026D3", fontScale: 1.1 },
    "NGOs & Nonprofits": { color: "#16A34A", fontScale: 1.0 },
    "Pet Shops & Veterinary Clinics": { color: "#0369A1", fontScale: 1.0 },
  }

  return themeMap[industry] || { color: "#1D4ED8", fontScale: 1.0 }
}

function getIndustryContent(industry: Industry, businessName: string) {
  const contentMap: Record<Industry, any> = {
    "Restaurants & Cafés": {
      hero: {
        heading: `Welcome to ${businessName}`,
        subheading: "Experience authentic flavours and warm hospitality in every bite",
        ctaLabel: "View Menu",
        backgroundImage: "/warm-restaurant-interior.png",
      },
      about: {
        body: `${businessName} has been serving delicious, authentic cuisine with a commitment to quality ingredients and exceptional service. Our passionate chefs create memorable dining experiences that bring people together.`,
        image: "/chef-cooking.png",
      },
      services: {
        title: "Our Specialties",
        items: [
          {
            name: "Signature Dishes",
            description: "Chef's special creations made with premium ingredients",
            price: "₹299 onwards",
          },
          {
            name: "Fresh Beverages",
            description: "Handcrafted drinks and traditional favourites",
            price: "₹99 onwards",
          },
          {
            name: "Catering Services",
            description: "Perfect for events and special occasions",
            price: "₹199 per person",
          },
        ],
      },
      testimonials: {
        items: [
          {
            name: "Priya Sharma",
            quote: "The food quality is exceptional and the service is always friendly. Highly recommended!",
          },
          { name: "Rajesh Kumar", quote: "Best dining experience in the city. The ambiance and taste are perfect." },
        ],
      },
    },
    "Clinics & Hospitals": {
      hero: {
        heading: `${businessName} - Your Health Partner`,
        subheading: "Comprehensive healthcare services with compassionate care",
        ctaLabel: "Book Appointment",
        backgroundImage: "/modern-medical-clinic-reception.png",
      },
      about: {
        body: `${businessName} provides comprehensive healthcare services with a team of experienced medical professionals. We are committed to delivering quality care with the latest medical technology and a patient-first approach.`,
        image: "/doctor-patient-consultation.png",
      },
      services: {
        title: "Our Services",
        items: [
          {
            name: "General Consultation",
            description: "Comprehensive health check-ups and consultations",
            price: "₹500",
          },
          { name: "Diagnostic Services", description: "Advanced diagnostic tests and imaging", price: "₹200 onwards" },
          { name: "Specialist Care", description: "Expert care from certified specialists", price: "₹800 onwards" },
        ],
      },
      testimonials: {
        items: [
          {
            name: "Anita Patel",
            quote:
              "Excellent medical care with very professional staff. I trust them completely with my family's health.",
          },
          {
            name: "Suresh Gupta",
            quote: "Quick appointments, thorough examinations, and caring doctors. Highly satisfied with the service.",
          },
        ],
      },
    },
    // Add more industries as needed...
  }

  return contentMap[industry] || contentMap["Restaurants & Cafés"]
}
