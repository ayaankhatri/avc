import Image from "next/image"
import { Github, Linkedin, Mail } from "lucide-react"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

const creators = [
  {
    name: "Vaidant Tyagi",
    image: "/placeholder.jpg",
  },
  {
    name: "Ayaan Khatri",
    image: "/placeholder.jpg",
  },
  {
    name: "Prachita Sawhney",
    image: "/placeholder.jpg",
  },
  {
    name: "Viraj Patil",
    image: "/placeholder.jpg",
  },
  {
    name: "Aadit Athawase",
    image: "/placeholder.jpg",
  },
]

export default function AboutCreatorsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
      <div className="mb-12 text-center">
        <h1 className="font-display text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
          Meet the Creators
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          We are Team AVC, a group of engineering students passionate about
          using technology to save lives. ResQ is our vision for a safer
          industrial workplace.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {creators.map((creator) => (
          <Card
            key={creator.name}
            className="group overflow-hidden border bg-card text-center transition-shadow hover:shadow-lg"
          >
            <CardContent className="flex flex-col items-center gap-4 p-6 pt-8">
              {/* Circular avatar */}
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-primary/20">
                <Image
                  src={creator.image || "/placeholder.svg"}
                  alt={`Portrait of ${creator.name}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {creator.name}
                </h3>
              </div>

              {/* Social links (placeholder) */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={`${creator.name} GitHub`}
                >
                  <Github className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={`${creator.name} LinkedIn`}
                >
                  <Linkedin className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={`${creator.name} Email`}
                >
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team info */}
      <div className="mx-auto mt-16 max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold text-foreground">
          About Our Project
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          ResQ was born from a desire to make industrial workplaces safer
          using affordable, accessible IoT technology. Our project
          combine GPS tracking, gas detection, and motion sensing to provide
          real-time safety monitoring and instant emergency response. We
          believe every worker deserves to go home safe.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Contact us at{" "}
          <a
            href="mailto:avc.devsoc@gmail.com"
            className="font-medium text-primary hover:underline"
          >
            avc.devsoc@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}