"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2, CreditCard, Package, MapPin, Check } from "lucide-react"
import { toast } from "sonner"

type Step = "address" | "payment" | "confirmation"

export default function CheckoutPage() {
  const router = useRouter()
  const supabase = createClient()
  const { quantity, total, unitPrice, clear } = useCart()
  const [step, setStep] = useState<Step>("address")
  const [loading, setLoading] = useState(false)

  const [address, setAddress] = useState({
    delivery_address: "",
    city: "",
    state: "",
    pincode: "",
  })

  if (quantity === 0 && step !== "confirmation") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <Package className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Your cart is empty</p>
        <Button onClick={() => router.push("/store")}>Go to Store</Button>
      </div>
    )
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
  }

  const handlePayment = async () => {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Please sign in to complete your purchase.")
      router.push("/auth/login")
      return
    }

    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      quantity,
      total_price: total,
      delivery_address: address.delivery_address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      payment_status: "completed",
      order_status: "processing",
    })

    if (error) {
      toast.error("Order failed: " + error.message)
      setLoading(false)
      return
    }

    clear()
    setStep("confirmation")
    setLoading(false)
  }

  if (step === "confirmation") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-chart-3/10">
              <Check className="h-7 w-7 text-chart-3" />
            </div>
            <CardTitle className="font-display text-2xl">
              Order Confirmed!
            </CardTitle>
            <CardDescription>
              Your order has been placed successfully. You will receive an email
              with tracking details shortly.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-3">
            <Button onClick={() => router.push("/")}>Back to Home</Button>
            <Button variant="outline" onClick={() => router.push("/status")}>
              View Status
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">
        Checkout
      </h1>

      {/* Order Summary */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-primary" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <p className="font-medium text-foreground">ResQ Smart Helmet</p>
              <p className="text-sm text-muted-foreground">
                {"₹"}{unitPrice.toLocaleString("en-IN")} x {quantity}
              </p>
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              {"₹"}{total.toLocaleString("en-IN")}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="mb-6 flex items-center gap-4">
        <StepIndicator
          label="Address"
          active={step === "address"}
          done={step === "payment"}
        />
        <div className="h-px flex-1 bg-border" />
        <StepIndicator
          label="Payment"
          active={step === "payment"}
          done={false}
        />
      </div>

      {step === "address" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleAddressSubmit}>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Street address, building, floor"
                  value={address.delivery_address}
                  onChange={(e) =>
                    setAddress((a) => ({
                      ...a,
                      delivery_address: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="e.g. Pune"
                    value={address.city}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, city: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="e.g. Maharashtra"
                    value={address.state}
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, state: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  placeholder="e.g. 411001"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress((a) => ({ ...a, pincode: e.target.value }))
                  }
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Continue to Payment
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === "payment" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment
            </CardTitle>
            <CardDescription>
              Delivering to {address.delivery_address}, {address.city},{" "}
              {address.state} - {address.pincode}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="card">Card Number</Label>
              <Input id="card" placeholder="XXXX XXXX XXXX XXXX" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="expiry">Expiry</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="XXX" type="password" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Pay {"₹"}{total.toLocaleString("en-IN")}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setStep("address")}
            >
              Back to Address
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

function StepIndicator({
  label,
  active,
  done,
}: {
  label: string
  active: boolean
  done: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
          done
            ? "bg-chart-3 text-chart-3-foreground"
            : active
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {done ? <Check className="h-3.5 w-3.5" /> : active ? "2" : "1"}
      </div>
      <span
        className={`text-sm font-medium ${
          active || done ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  )
}
