"use client"

import React, { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  X,
  MapPin,
  Phone,
  AlertTriangle,
  ShieldCheck,
  User,
  Wind,
  RotateCcw,
  Satellite,
  Clock,
  History,
} from "lucide-react"
import type { Worker, AlertRecord } from "./status-dashboard"

interface WorkerDetailProps {
  worker: Worker
  alerts: AlertRecord[]
  onClose: () => void
}

export function WorkerDetail({ worker, alerts, onClose }: WorkerDetailProps) {
  const isSafe = worker.status === "safe"
  const supabase = createClient()
  const [sensorHistory, setSensorHistory] = useState<
    Array<{
      id: string
      gas_reading: number
      gyro_x: number
      gyro_y: number
      gyro_z: number
      latitude: number | null
      longitude: number | null
      created_at: string
    }>
  >([])

  const fetchSensorHistory = useCallback(async () => {
    const { data } = await supabase
      .from("sensor_readings")
      .select("*")
      .eq("worker_id", worker.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (data) setSensorHistory(data)
  }, [supabase, worker.id])

  useEffect(() => {
    fetchSensorHistory()
  }, [fetchSensorHistory])

  const displayLat = worker.gps_active
    ? worker.latitude
    : (worker.initial_latitude ?? worker.latitude)
  const displayLng = worker.gps_active
    ? worker.longitude
    : (worker.initial_longitude ?? worker.longitude)

  return (
    <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: "600px" }}>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-lg">
              {worker.worker_name}
            </CardTitle>
            <Badge
              variant={isSafe ? "secondary" : "destructive"}
              className="w-fit text-xs"
            >
              {isSafe ? (
                <ShieldCheck className="mr-1 h-3 w-3" />
              ) : (
                <AlertTriangle className="mr-1 h-3 w-3" />
              )}
              {isSafe ? "Safe" : worker.danger_type || "Danger"}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <DetailRow
            icon={<User className="h-4 w-4 text-primary" />}
            label="Helmet ID"
            value={worker.helmet_number}
          />
          <DetailRow
            icon={<MapPin className="h-4 w-4 text-primary" />}
            label="GPS Location"
            value={`${displayLat.toFixed(4)}, ${displayLng.toFixed(4)}`}
          />
          <DetailRow
            icon={<Satellite className="h-4 w-4 text-primary" />}
            label="GPS Module"
            value={worker.gps_active ? "Active (Live)" : "Inactive (Using initial location)"}
          />
          {worker.age && (
            <DetailRow
              icon={<User className="h-4 w-4 text-primary" />}
              label="Age / Gender"
              value={`${worker.age}${worker.gender ? ` / ${worker.gender}` : ""}`}
            />
          )}
          {worker.health_condition && (
            <DetailRow
              icon={<AlertTriangle className="h-4 w-4 text-accent" />}
              label="Health Condition"
              value={worker.health_condition}
            />
          )}
          {worker.worker_contact && (
            <DetailRow
              icon={<Phone className="h-4 w-4 text-primary" />}
              label="Worker Contact"
              value={worker.worker_contact}
            />
          )}
          {worker.emergency_contact && (
            <DetailRow
              icon={<Phone className="h-4 w-4 text-destructive" />}
              label="Emergency Contact"
              value={worker.emergency_contact}
            />
          )}
        </CardContent>
      </Card>

      {/* Live Sensor Data */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Wind className="h-4 w-4 text-primary" />
            Live Sensor Readings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <SensorCard
              label="Gas (MQ-2)"
              value={`${worker.gas_reading?.toFixed(1) ?? "0"} ppm`}
              danger={worker.gas_reading > 400}
            />
            <SensorCard
              label="Gyro Magnitude"
              value={`${Math.sqrt((worker.gyro_x ?? 0) ** 2 + (worker.gyro_y ?? 0) ** 2 + (worker.gyro_z ?? 0) ** 2).toFixed(2)} g`}
              danger={
                Math.sqrt(
                  (worker.gyro_x ?? 0) ** 2 +
                    (worker.gyro_y ?? 0) ** 2 +
                    (worker.gyro_z ?? 0) ** 2,
                ) > 2.5
              }
            />
            <SensorCard
              label="Gyro X"
              value={`${worker.gyro_x?.toFixed(2) ?? "0"}`}
            />
            <SensorCard
              label="Gyro Y"
              value={`${worker.gyro_y?.toFixed(2) ?? "0"}`}
            />
            <SensorCard
              label="Gyro Z"
              value={`${worker.gyro_z?.toFixed(2) ?? "0"}`}
            />
            <SensorCard
              label="Last Update"
              value={
                worker.last_sensor_update
                  ? new Date(worker.last_sensor_update).toLocaleTimeString()
                  : "No data yet"
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Alert History for this worker */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <History className="h-4 w-4" />
              Alert History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-destructive/20 bg-destructive/5 p-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-destructive">
                      {alert.alert_type}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Gas: {alert.gas_reading?.toFixed(1) ?? "N/A"} ppm |
                    Gyro: {alert.gyro_x?.toFixed(1)}, {alert.gyro_y?.toFixed(1)}, {alert.gyro_z?.toFixed(1)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current danger notice */}
      {!isSafe && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-3">
          <p className="text-xs font-medium text-destructive">
            Active Alert: {worker.danger_type || "Unknown hazard"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Emergency services should be notified. Take immediate action.
          </p>
        </div>
      )}
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

function SensorCard({
  label,
  value,
  danger,
}: {
  label: string
  value: string
  danger?: boolean
}) {
  return (
    <div
      className={`rounded-lg border p-2 ${danger ? "border-destructive/30 bg-destructive/5" : "border-border bg-muted/30"}`}
    >
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={`text-sm font-bold ${danger ? "text-destructive" : "text-foreground"}`}
      >
        {value}
      </p>
    </div>
  )
}
