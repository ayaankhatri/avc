"use client"

import { useEffect, useRef, useCallback } from "react"
import type { Worker } from "./status-dashboard"

interface IndiaMapProps {
  workers: Worker[]
  selected: Worker | null
  onSelect: (worker: Worker) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let leafletModule: any = null

async function getLeaflet() {
  if (leafletModule) return leafletModule
  const mod = await import("leaflet")
  await import("leaflet/dist/leaflet.css")
  leafletModule = mod
  return mod
}

export function IndiaMap({ workers, selected, onSelect }: IndiaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null)

  const updateMarkers = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (leaflet: any, map: any) => {
      if (!map || !leaflet) return
      // Remove existing markers
      map.eachLayer?.((layer: { options?: { className?: string }; remove?: () => void }) => {
        if (layer.options?.className === "custom-marker") {
          layer.remove?.()
        }
      })

      workers.forEach((worker) => {
        const lat = worker.gps_active
          ? worker.latitude
          : (worker.initial_latitude ?? worker.latitude)
        const lng = worker.gps_active
          ? worker.longitude
          : (worker.initial_longitude ?? worker.longitude)
        const isSafe = worker.status === "safe"
        const isSelected = selected?.id === worker.id
        const size = isSelected ? 16 : 12
        const pulseClass = !isSafe ? "danger-pulse" : ""

        const icon = leaflet.divIcon({
          className: "custom-marker",
          html: `<div class="${pulseClass}" style="
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: ${isSafe ? "#2563eb" : "#ef4444"};
            border: 2px solid ${isSelected ? "#fff" : isSafe ? "#1d4ed8" : "#dc2626"};
            box-shadow: 0 0 ${isSelected ? "8" : "4"}px ${isSafe ? "rgba(37,99,235,0.5)" : "rgba(239,68,68,0.6)"};
            transition: all 0.2s;
          "></div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        })

        leaflet
          .marker([lat, lng], { icon })
          .addTo(map)
          .on("click", () => onSelect(worker))
          .bindTooltip(`${worker.helmet_number} - ${worker.worker_name}`, {
            direction: "top",
            offset: [0, -8],
          })
      })
    },
    [workers, selected, onSelect],
  )

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let cancelled = false

    const loadMap = async () => {
      const leaflet = await getLeaflet()
      if (cancelled || !mapRef.current) return

      const map = leaflet.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        })
        .addTo(map)

      mapInstanceRef.current = map
      updateMarkers(leaflet, map)
    }

    loadMap()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [updateMarkers])

  useEffect(() => {
    if (!mapInstanceRef.current || !leafletModule) return
    updateMarkers(leafletModule, mapInstanceRef.current)
  }, [workers, selected, updateMarkers])

  return (
    <>
      <style jsx global>{`
        @keyframes dangerPulse {
          0%,
          100% {
            box-shadow: 0 0 4px rgba(239, 68, 68, 0.6);
          }
          50% {
            box-shadow: 0 0 16px rgba(239, 68, 68, 0.9);
          }
        }
        .danger-pulse {
          animation: dangerPulse 1.5s ease-in-out infinite;
        }
      `}</style>
      <div
        ref={mapRef}
        className="h-[500px] w-full lg:h-[600px]"
        style={{ zIndex: 0 }}
      />
    </>
  )
}
