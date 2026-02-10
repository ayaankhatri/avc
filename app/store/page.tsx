"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Plus,
  Minus,
  MapPin,
  Wind,
  RotateCcw,
  ShieldCheck,
} from "lucide-react"

export default function StorePage() {
  const { quantity, increment, decrement, unitPrice, total } = useCart()

  const features = [
    { icon: MapPin, label: "GPS Tracking (NEO-6M)" },
    { icon: Wind, label: "Gas Detection (MQ-2)" },
    { icon: RotateCcw, label: "Fall Detection (MPU-6050)" },
    { icon: ShieldCheck, label: "Real-Time Alerts" },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Store
        </h1>
        <p className="mt-1 text-muted-foreground">
          Get your ResQ smart helmet and start protecting your workforce.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="relative aspect-square">
            <Image
              src="/storefront.jpeg"
              alt="ResQ Smart Safety Helmet"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <Badge className="mb-3">New Arrival</Badge>
            <h2 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
              ResQ Smart Safety Helmet
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Advanced industrial safety helmet equipped with GPS tracking, gas
              detection, and gyroscope-based fall detection. Monitors worker
              safety in real time and sends instant alerts to contractors and
              emergency services.
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-foreground">
              {"₹"}{unitPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-muted-foreground">per unit</span>
          </div>

          {/* Features */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Included Sensors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {features.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <f.icon className="h-4 w-4 text-primary" />
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cart Controls */}
          <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={decrement}
                    disabled={quantity === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-foreground">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={increment}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {quantity > 0 && (
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-display text-xl font-bold text-foreground">
                    {"₹"}{total.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  className="flex-1 gap-2"
                  onClick={increment}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                {quantity > 0 && (
                  <Link href="/checkout" className="flex-1">
                    <Button variant="secondary" className="w-full">
                      Checkout ({quantity})
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Policies */}
          <Card>
            <CardContent className="pt-6">
              <CardDescription className="text-xs leading-relaxed">
                7-day return or exchange policy from the date of delivery. The
                product must be returned in its original condition and
                packaging. Free shipping across India for orders above
                {"₹"}10,000.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}