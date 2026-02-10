"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, HardHat, ShieldCheck, History } from "lucide-react"
import type { Worker, AlertRecord } from "./status-dashboard"

interface WorkerPanelProps {
  dangerWorkers: Worker[]
  totalWorkers: number
  alerts: AlertRecord[]
  onSelect: (worker: Worker) => void
}

export function WorkerPanel({
  dangerWorkers,
  totalWorkers,
  alerts,
  onSelect,
}: WorkerPanelProps) {
  const safeCount = totalWorkers - dangerWorkers.length

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <HardHat className="h-5 w-5 text-primary" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center rounded-lg bg-primary/10 p-3">
              <span className="text-2xl font-bold text-primary">
                {safeCount}
              </span>
              <span className="text-xs text-muted-foreground">Safe</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-destructive/10 p-3">
              <span className="text-2xl font-bold text-destructive">
                {dangerWorkers.length}
              </span>
              <span className="text-xs text-muted-foreground">At Risk</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Active Alerts
          </CardTitle>
          <CardDescription>Workers currently in danger</CardDescription>
        </CardHeader>
        <CardContent>
          {dangerWorkers.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <ShieldCheck className="h-8 w-8 text-chart-3" />
              <p className="text-sm text-muted-foreground">
                All workers are safe
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {dangerWorkers.map((worker) => (
                <button
                  key={worker.id}
                  type="button"
                  onClick={() => onSelect(worker)}
                  className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-left transition-colors hover:bg-destructive/10"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {worker.worker_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {worker.helmet_number}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {worker.danger_type || "Hazard"}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Alert History */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <History className="h-5 w-5 text-muted-foreground" />
              Recent Alerts
            </CardTitle>
            <CardDescription>
              Past danger events are recorded here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {alerts.slice(0, 8).map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-destructive/15 bg-destructive/5 p-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-destructive">
                      {alert.worker_name} - {alert.alert_type}
                    </p>
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {alert.helmet_number} |{" "}
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
