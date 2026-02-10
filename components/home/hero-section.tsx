import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background px-4 py-20 lg:py-32">
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-primary" />
          <span>Industrial Safety Reimagined</span>
        </div>
        <h1 className="font-display text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Protect Your Workforce{" "}
          <span className="text-primary">in Real Time</span>
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          ResQ smart helmets combine GPS tracking, gas detection, and
          fall-sensing gyroscopes to keep every worker safe on the job
          site. Monitor, alert, and respond in seconds.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/add-helmet">
            <Button size="lg" className="gap-2">
              Add Helmet Data
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/store">
            <Button size="lg" variant="outline" className="gap-2 bg-transparent">
              Browse Store
            </Button>
          </Link>
        </div>
        <div className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-6">
          {[
            { value: "3", label: "Sensors Per Helmet" },
            { value: "24/7", label: "Real-Time Monitoring" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 rounded-xl border bg-card p-4"
            >
              <span className="font-display text-2xl font-bold text-primary md:text-3xl">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground md:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}