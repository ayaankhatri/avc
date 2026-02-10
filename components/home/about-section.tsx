
import { HardHat, Wifi, AlertTriangle } from "lucide-react"

export function AboutSection() {
  return (
    <section className="px-4 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            About ResQ
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            ResQ is a smart-helmet safety monitoring system built for Indian
            industries. Our mission is to reduce workplace fatalities by
            providing real-time hazard detection and instant emergency
            alerts to contractors and first responders.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: HardHat,
              title: "Smart Helmets",
              description:
                "Equipped with GPS, gas sensors, and gyroscopes that continuously monitor worker safety on the job site.",
            },
            {
              icon: Wifi,
              title: "Real-Time Tracking",
              description:
                "Live GPS tracking on an interactive map lets contractors monitor every registered helmet at a glance.",
            },
            {
              icon: AlertTriangle,
              title: "Instant Alerts",
              description:
                "Automatic hazard detection triggers instant notifications to contractors and the nearest emergency services.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col gap-4 rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
