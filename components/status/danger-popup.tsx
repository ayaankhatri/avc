"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, X } from "lucide-react"
import type { AlertRecord } from "./status-dashboard"

interface DangerPopupProps {
  alert: AlertRecord
  onClose: () => void
  onLocate: () => void
}

export function DangerPopup({ alert, onClose, onLocate }: DangerPopupProps) {
  // Auto-dismiss after 15 seconds
  useEffect(() => {
    const timeout = setTimeout(onClose, 15000)
    return () => clearTimeout(timeout)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md animate-in zoom-in-95 fade-in duration-200">
        <div className="overflow-hidden rounded-xl border-2 border-destructive bg-card shadow-2xl">
          {/* Red alert header */}
          <div className="flex items-center justify-between bg-destructive px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
              <span className="text-sm font-bold text-destructive-foreground">
                DANGER ALERT
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-destructive-foreground/80 hover:text-destructive-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Alert content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-foreground">
              {alert.worker_name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Helmet: {alert.helmet_number}
            </p>

            <div className="mt-4 rounded-lg bg-destructive/10 p-3">
              <p className="text-sm font-semibold text-destructive">
                {alert.alert_type}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                {alert.gas_reading !== null && (
                  <span>Gas: {alert.gas_reading.toFixed(1)} ppm</span>
                )}
                {alert.gyro_x !== null && (
                  <span>
                    Gyro:{" "}
                    {Math.sqrt(
                      (alert.gyro_x ?? 0) ** 2 +
                        (alert.gyro_y ?? 0) ** 2 +
                        (alert.gyro_z ?? 0) ** 2,
                    ).toFixed(2)}{" "}
                    g
                  </span>
                )}
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Detected at{" "}
              {new Date(alert.created_at).toLocaleTimeString()} on{" "}
              {new Date(alert.created_at).toLocaleDateString()}
            </p>

            <div className="mt-4 flex gap-3">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={onLocate}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Locate on Map
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={onClose}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
