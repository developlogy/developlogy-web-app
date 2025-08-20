import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Priya Sharma",
    business: "Sharma's Restaurant",
    industry: "Restaurant",
    quote:
      "I launched my restaurant website in just 20 minutes! The templates are beautiful and my customers love the online menu feature.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60&text=PS",
  },
  {
    name: "Dr. Rajesh Kumar",
    business: "Kumar Clinic",
    industry: "Healthcare",
    quote:
      "Developlogy made it so easy to create a professional medical website. The appointment booking feature is exactly what I needed.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60&text=RK",
  },
  {
    name: "Anita Patel",
    business: "Patel Real Estate",
    industry: "Real Estate",
    quote:
      "The property showcase templates are perfect for my real estate business. I've already received 3 new client inquiries!",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60&text=AP",
  },
  {
    name: "Suresh Gupta",
    business: "Gupta Fitness Center",
    industry: "Fitness",
    quote: "Amazing platform! My gym's website looks incredibly professional and the mobile version is flawless.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60&text=SG",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Trusted by
            <span className="text-primary block">Thousands of Businesses</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            See how business owners across India are growing their online presence with Developlogy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                <blockquote className="text-foreground text-lg leading-relaxed mb-6">"{testimonial.quote}"</blockquote>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full bg-muted"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.business}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
