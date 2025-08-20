import { Card, CardContent } from "@/components/ui/card"
import { Palette, Smartphone, Search, Zap, Globe, Shield, MousePointer, BarChart3 } from "lucide-react"

const features = [
  {
    icon: MousePointer,
    title: "Drag & Drop Builder",
    description: "Intuitive visual editor that lets you build professional websites without any coding knowledge.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "All templates are automatically optimized for mobile devices and tablets for perfect viewing.",
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description: "Built-in SEO tools help your website rank higher in search results and attract more customers.",
  },
  {
    icon: Palette,
    title: "Industry Templates",
    description: "Choose from 20+ industry-specific templates designed for restaurants, clinics, agencies, and more.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Launch your website in minutes with our streamlined 3-step onboarding process.",
  },
  {
    icon: Globe,
    title: "Professional Domains",
    description: "Connect your custom domain or use our free subdomain to establish your online presence.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security and 99.9% uptime guarantee keep your website safe and accessible.",
  },
  {
    icon: BarChart3,
    title: "Analytics Ready",
    description: "Track your website performance with built-in analytics and visitor insights.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <span className="text-primary block">Build & Grow Online</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Powerful features designed to help small businesses create professional websites that convert visitors into
            customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
