from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client
from uuid import UUID

# ---------------- SUPABASE CONFIG ----------------
SUPABASE_URL = "https://nkkbirqwsmxhevlokkiu.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ra2JpcnF3c214aGV2bG9ra2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzUyOTcsImV4cCI6MjA4NjE1MTI5N30.EnIGYbnaouIouo2vWhh5vDyPqlitgJF-501h5WT7514"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

# ---------------- DATA MODEL ----------------
class SensorReading(BaseModel):
    worker_id: UUID                 # must exist in workers table
    helmet_number: str

    gas_reading: float | None = 0
    gyro_x: float | None = 0
    gyro_y: float | None = 0
    gyro_z: float | None = 0

    latitude: float | None = None
    longitude: float | None = None


# ---------------- API ENDPOINT ----------------
@app.post("/esp/data")
async def insert_sensor_reading(data: SensorReading):
    try:
        payload = {
            "worker_id": str(data.worker_id),
            "helmet_number": data.helmet_number,
            "gas_reading": data.gas_reading,
            "gyro_x": data.gyro_x,
            "gyro_y": data.gyro_y,
            "gyro_z": data.gyro_z,
            "latitude": data.latitude,
            "longitude": data.longitude
        }

        response = (
            supabase
            .table("sensor_readings")
            .insert(payload)
            .execute()
        )

        if response.error:
            raise Exception(response.error)

        return {
            "status": "success",
            "inserted": response.data
        }

    except Exception as e:
        print("🔥 INSERT ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))