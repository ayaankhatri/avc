"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { IndiaMap } from "@/components/status/india-map"
import { WorkerPanel } from "@/components/status/worker-panel"
import { WorkerDetail } from "@/components/status/worker-detail"
import { DangerPopup } from "@/components/status/danger-popup"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export interface Worker {
  id: string
  helmet_number: string
  worker_name: string
  age: number | null
  gender: string | null
  health_condition: string | null
  worker_contact: string | null
  emergency_contact: string | null
  latitude: number
  longitude: number
  initial_latitude: number | null
  initial_longitude: number | null
  gps_active: boolean
  gas_reading: number
  gyro_x: number
  gyro_y: number
  gyro_z: number
  status: "safe" | "danger"
  danger_type: string | null
  last_sensor_update: string | null
  created_at: string
}

export interface AlertRecord {
  id: string
  worker_id: string
  helmet_number: string
  worker_name: string
  alert_type: string
  gas_reading: number | null
  gyro_x: number | null
  gyro_y: number | null
  gyro_z: number | null
  latitude: number | null
  longitude: number | null
  resolved: boolean
  created_at: string
}

export function StatusDashboard() {
  const supabase = createClient()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [selected, setSelected] = useState<Worker | null>(null)
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState<AlertRecord[]>([])
  const [dangerPopup, setDangerPopup] = useState<AlertRecord | null>(null)
  const prevDangerIdsRef = useRef<Set<string>>(new Set())

  const fetchWorkers = useCallback(async () => {
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setWorkers(data)
    }
    setLoading(false)
  }, [supabase])

  const fetchAlerts = useCallback(async () => {
    const { data, error } = await supabase
      .from("alert_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (!error && data) {
      setAlerts(data)
    }
  }, [supabase])

  useEffect(() => {
    fetchWorkers()
    fetchAlerts()
  }, [fetchWorkers, fetchAlerts])

  // Subscribe to real-time worker changes
  useEffect(() => {
    const workersChannel = supabase
      .channel("workers-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workers" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as Worker
            setWorkers((prev) =>
              prev.map((w) => (w.id === updated.id ? updated : w)),
            )

            // Update selected worker if it's the one that changed
            setSelected((prev) =>
              prev && prev.id === updated.id ? updated : prev,
            )

            // Check if a worker just entered danger state
            if (updated.status === "danger") {
              const wasPreviouslyDanger = prevDangerIdsRef.current.has(
                updated.id,
              )
              if (!wasPreviouslyDanger) {
                // New danger event - show notification, ping, popup
                toast.error(
                  `ALERT: ${updated.worker_name} (${updated.helmet_number}) - ${updated.danger_type || "Danger detected"}`,
                  { duration: 10000 },
                )

                // Request browser notification
                if (
                  typeof window !== "undefined" &&
                  "Notification" in window
                ) {
                  if (Notification.permission === "granted") {
                    new Notification("ResQ Safety Alert", {
                      body: `${updated.worker_name} (${updated.helmet_number}): ${updated.danger_type || "Danger detected"}`,
                      icon: "/resq-logo.jpg",
                    })
                  }
                }
              }
              prevDangerIdsRef.current.add(updated.id)
            } else {
              prevDangerIdsRef.current.delete(updated.id)
            }
          } else if (payload.eventType === "INSERT") {
            const inserted = payload.new as Worker
            setWorkers((prev) => [inserted, ...prev])
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as { id: string }
            setWorkers((prev) => prev.filter((w) => w.id !== deleted.id))
          }
        },
      )
      .subscribe()

    const alertsChannel = supabase
      .channel("alerts-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alert_history" },
        (payload) => {
          const newAlert = payload.new as AlertRecord
          setAlerts((prev) => [newAlert, ...prev].slice(0, 50))
          // Show danger popup
          setDangerPopup(newAlert)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(workersChannel)
      supabase.removeChannel(alertsChannel)
    }
  }, [supabase])

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission()
      }
    }
  }, [])

  // Track initial danger states
  useEffect(() => {
    const dangerIds = new Set(
      workers.filter((w) => w.status === "danger").map((w) => w.id),
    )
    prevDangerIdsRef.current = dangerIds
  }, []) // Only on mount

  const dangerWorkers = workers.filter((w) => w.status === "danger")

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Helmet Status
        </h1>
        <p className="mt-1 text-muted-foreground">
          Monitor all registered helmets in real time. Blue dots are safe, red
          dots indicate danger.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border bg-card">
            <IndiaMap
              workers={workers}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {selected ? (
            <WorkerDetail
              worker={selected}
              alerts={alerts.filter((a) => a.worker_id === selected.id)}
              onClose={() => setSelected(null)}
            />
          ) : (
            <WorkerPanel
              dangerWorkers={dangerWorkers}
              totalWorkers={workers.length}
              alerts={alerts}
              onSelect={setSelected}
            />
          )}
        </div>
      </div>

      {/* Danger popup overlay */}
      {dangerPopup && (
        <DangerPopup
          alert={dangerPopup}
          onClose={() => setDangerPopup(null)}
          onLocate={() => {
            const worker = workers.find((w) => w.id === dangerPopup.worker_id)
            if (worker) setSelected(worker)
            setDangerPopup(null)
          }}
        />
      )}
    </div>
  )
}
