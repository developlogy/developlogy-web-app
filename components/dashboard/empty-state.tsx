import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Zap, Smartphone, Palette } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Zap,
    title: "Quick Setup",
    description: "Launch in minutes with our 3-step wizard",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "All templates are mobile-optimized",
  },
  {
    icon: Palette,
    title: "Easy Customization",
    description: "Drag & drop editor with live preview",
  },
]

export function EmptyState() {
  return (
    <div className="text-center py-16">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Globe className="w-16 h-16 text-primary" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
          <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
        </div>
        <div className="absolute top-8 right-1/4">
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.5s" }}></div>
        </div>
        <div className="absolute top-8 left-1/4">
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "1s" }}></div>
        </div>
      </div>

      {/* Content */}
      <h2 className="text-3xl font-bold text-foreground mb-4">Create Your First Website</h2>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        Get started with professional templates designed for your industry. No coding required – just customize and
        launch.
      </p>

      {/* CTA */}
      <div className="mb-12">
        <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
          <Link href="/onboarding">
            <Globe className="w-5 h-5 mr-2" />
            Create Your Website
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground mt-3">Free to start • No credit card required</p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <Card key={index} className="border-0 bg-muted/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
