import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Thresholds for danger detection
const GAS_THRESHOLD = 400 // MQ-2 reading threshold (ppm)
const GYRO_THRESHOLD = 2.5 // MPU-6050 tilt threshold (g-force)

// Use service-role key so the ESP32 can write without auth
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      helmet_number,
      gas_reading = 0,
      gyro_x = 0,
      gyro_y = 0,
      gyro_z = 0,
      latitude,
      longitude,
    } = body

    if (!helmet_number) {
      return NextResponse.json(
        { error: "helmet_number is required" },
        { status: 400 },
      )
    }

    const supabase = getAdminClient()

    // Find the worker by helmet_number
    const { data: worker, error: findError } = await supabase
      .from("workers")
      .select("id, worker_name, user_id, initial_latitude, initial_longitude")
      .eq("helmet_number", helmet_number)
      .single()

    if (findError || !worker) {
      return NextResponse.json(
        { error: `Helmet ${helmet_number} not found` },
        { status: 404 },
      )
    }

    // Determine if GPS data is present from the module
    const hasGPS =
      latitude !== undefined &&
      latitude !== null &&
      longitude !== undefined &&
      longitude !== null

    // Check for danger conditions
    const gasAlert = gas_reading > GAS_THRESHOLD
    const gyroMagnitude = Math.sqrt(gyro_x ** 2 + gyro_y ** 2 + gyro_z ** 2)
    const gyroAlert = gyroMagnitude > GYRO_THRESHOLD
    const isDanger = gasAlert || gyroAlert

    let dangerType: string | null = null
    if (gasAlert && gyroAlert) {
      dangerType = "Gas leak + Fall detected"
    } else if (gasAlert) {
      dangerType = "Gas leak detected"
    } else if (gyroAlert) {
      dangerType = "Fall detected"
    }

    // Effective location: use GPS module data if available, otherwise keep initial
    const effectiveLat = hasGPS ? latitude : undefined
    const effectiveLng = hasGPS ? longitude : undefined

    // Update the worker record with latest sensor data
    const updatePayload: Record<string, unknown> = {
      gas_reading,
      gyro_x,
      gyro_y,
      gyro_z,
      status: isDanger ? "danger" : "safe",
      danger_type: dangerType,
      last_sensor_update: new Date().toISOString(),
    }

    if (hasGPS) {
      updatePayload.latitude = effectiveLat
      updatePayload.longitude = effectiveLng
      updatePayload.gps_active = true
    }

    await supabase.from("workers").update(updatePayload).eq("id", worker.id)

    // Insert into sensor_readings history
    await supabase.from("sensor_readings").insert({
      worker_id: worker.id,
      helmet_number,
      gas_reading,
      gyro_x,
      gyro_y,
      gyro_z,
      latitude: hasGPS ? effectiveLat : worker.initial_latitude,
      longitude: hasGPS ? effectiveLng : worker.initial_longitude,
    })

    // If danger detected, log to alert_history
    if (isDanger) {
      await supabase.from("alert_history").insert({
        worker_id: worker.id,
        helmet_number,
        worker_name: worker.worker_name,
        alert_type: dangerType!,
        gas_reading,
        gyro_x,
        gyro_y,
        gyro_z,
        latitude: hasGPS ? effectiveLat : worker.initial_latitude,
        longitude: hasGPS ? effectiveLng : worker.initial_longitude,
      })
    }

    return NextResponse.json({
      success: true,
      helmet_number,
      status: isDanger ? "danger" : "safe",
      danger_type: dangerType,
      gps_active: hasGPS,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    )
  }
}

// GET - for checking endpoint status or reading a helmet's latest data
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const helmet = searchParams.get("helmet_number")

  if (!helmet) {
    return NextResponse.json({
      status: "ResQ ESP32 Sensor API is running",
      usage: "POST sensor data with helmet_number, gas_reading, gyro_x, gyro_y, gyro_z, latitude, longitude",
    })
  }

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .eq("helmet_number", helmet)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Helmet not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
