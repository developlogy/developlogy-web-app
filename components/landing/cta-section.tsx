import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

const benefits = [
  "No credit card required",
  "Launch in under 30 minutes",
  "Professional templates included",
  "Mobile-optimized automatically",
]

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Ready to Launch Your
            <span className="text-primary block">Dream Website?</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join thousands of business owners who chose Developlogy to build their online presence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-foreground">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-12 py-6 h-auto">
              <Link href="/onboarding">
                Start Building Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto bg-transparent">
              View Live Examples
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">Free forever plan available • Upgrade anytime</p>
        </div>
      </div>
    </section>
  )
}
