"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { HardHat, Loader2, MapPin } from "lucide-react"
import { toast } from "sonner"

export default function AddHelmetPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    helmet_number: "",
    worker_name: "",
    age: "",
    gender: "",
    health_condition: "",
    worker_contact: "",
    emergency_contact: "",
    initial_latitude: "",
    initial_longitude: "",
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error("You must be logged in to add a helmet.")
      router.push("/auth/login")
      return
    }

    const initLat = form.initial_latitude
      ? Number.parseFloat(form.initial_latitude)
      : 20.5937
    const initLng = form.initial_longitude
      ? Number.parseFloat(form.initial_longitude)
      : 78.9629

    const { error } = await supabase.from("workers").insert({
      user_id: user.id,
      helmet_number: form.helmet_number,
      worker_name: form.worker_name,
      age: form.age ? Number.parseInt(form.age) : null,
      gender: form.gender || null,
      health_condition: form.health_condition || null,
      worker_contact: form.worker_contact || null,
      emergency_contact: form.emergency_contact || null,
      initial_latitude: initLat,
      initial_longitude: initLng,
      latitude: initLat,
      longitude: initLng,
      gps_active: false,
    })

    if (error) {
      toast.error("Failed to add helmet: " + error.message)
      setLoading(false)
      return
    }

    toast.success("Helmet registered successfully!")
    router.push("/status")
  }

  return (
    <div className="flex justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <HardHat className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">
            Register Helmet
          </CardTitle>
          <CardDescription>
            Add a new worker and helmet to your monitoring system
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="helmet_number">Helmet Number *</Label>
              <Input
                id="helmet_number"
                placeholder="e.g. RQ-001"
                value={form.helmet_number}
                onChange={(e) =>
                  handleChange("helmet_number", e.target.value)
                }
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="worker_name">Worker Name *</Label>
              <Input
                id="worker_name"
                placeholder="Full name of the worker"
                value={form.worker_name}
                onChange={(e) =>
                  handleChange("worker_name", e.target.value)
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g. 30"
                  value={form.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={form.gender}
                  onValueChange={(val) => handleChange("gender", val)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="health_condition">
                Health Condition (if any)
              </Label>
              <Input
                id="health_condition"
                placeholder="e.g. Asthma, Diabetes, None"
                value={form.health_condition}
                onChange={(e) =>
                  handleChange("health_condition", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="worker_contact">Worker Contact</Label>
              <Input
                id="worker_contact"
                placeholder="+91 XXXXX XXXXX"
                value={form.worker_contact}
                onChange={(e) =>
                  handleChange("worker_contact", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="emergency_contact">Emergency Contact</Label>
              <Input
                id="emergency_contact"
                placeholder="+91 XXXXX XXXXX"
                value={form.emergency_contact}
                onChange={(e) =>
                  handleChange("emergency_contact", e.target.value)
                }
              />
            </div>

            {/* Initial Location Section */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <Label className="text-sm font-semibold">
                  Initial Location (for calibration)
                </Label>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Set the initial GPS coordinates for this helmet. This will be
                used as the worker&apos;s location until the GPS module on the
                helmet is activated. Once the GPS module is turned on, live
                readings will replace this data automatically.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="initial_latitude">Latitude</Label>
                  <Input
                    id="initial_latitude"
                    type="number"
                    step="any"
                    placeholder="e.g. 19.0760"
                    value={form.initial_latitude}
                    onChange={(e) =>
                      handleChange("initial_latitude", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="initial_longitude">Longitude</Label>
                  <Input
                    id="initial_longitude"
                    type="number"
                    step="any"
                    placeholder="e.g. 72.8777"
                    value={form.initial_longitude}
                    onChange={(e) =>
                      handleChange("initial_longitude", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Register Helmet
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
