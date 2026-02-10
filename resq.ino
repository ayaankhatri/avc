#include <Wire.h>
#include "I2Cdev.h"
#include "MPU6050.h"
#include <TinyGPS++.h>

// ================= MPU6500 =================
MPU6050 mpu;
int16_t ax, ay, az;
int16_t gx, gy, gz;

// ================= MQ-2 =================
#define MQ2_PIN 34
int gasValue = 0;

// ================= GPS =================
TinyGPSPlus gps;
HardwareSerial GPSserial(2);   // UART2

// ================= THRESHOLDS =================
#define ACC_THRESHOLD 18.0     // m/s^2
#define GAS_THRESHOLD 1200
#define ALERT_DURATION 3000    // ms

// ================= ALERT CONTROL =================
bool alertActive = false;
unsigned long alertStartTime = 0;

// ================= TIMING =================
unsigned long lastPrintTime = 0;
#define PRINT_INTERVAL 500     // ms

void setup() {
  Serial.begin(115200);
  delay(2000);

  Serial.println("RESQ SYSTEM (NO OLED)");

  // I2C
  Wire.begin(21, 22);

  // MPU6500 init (NO testConnection)
  mpu.initialize();
  mpu.setSleepEnabled(false);

  
  GPSserial.begin(9600, SERIAL_8N1, 16, 17);

  Serial.println("System Ready");
  Serial.println("--------------------------------");
}

void loop() {
  
  while (GPSserial.available()) {
    gps.encode(GPSserial.read());
  }

  
  if (alertActive) {
    if (millis() - alertStartTime < ALERT_DURATION) {
      return;   
    } else {
      alertActive = false;
      Serial.println("ALERT CLEARED");
      Serial.println("--------------------------------");
    }
  }

  
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  float ax_ms = (ax / 16384.0) * 9.81;
  float ay_ms = (ay / 16384.0) * 9.81;
  float az_ms = (az / 16384.0) * 9.81;

  
  float accMag = sqrt(
    ax_ms * ax_ms +
    ay_ms * ay_ms +
    az_ms * az_ms
  );

  
  gasValue = 0;
  for (int i = 0; i < 10; i++) {
    gasValue += analogRead(MQ2_PIN);
    delayMicroseconds(200);
  }
  gasValue /= 10;

  
  bool accAlert = accMag > ACC_THRESHOLD;
  bool gasAlert = gasValue > GAS_THRESHOLD;

  if (accAlert || gasAlert) {
    alertActive = true;
    alertStartTime = millis();

    Serial.println("🚨🚨🚨 ALERT 🚨🚨🚨");

    if (accAlert) {
      Serial.print("MOTION ALERT | AccMag = ");
      Serial.print(accMag, 2);
      Serial.println(" m/s^2");
    }

    if (gasAlert) {
      Serial.print("GAS ALERT | Value = ");
      Serial.println(gasValue);
    }

    if (gps.location.isValid()) {
      Serial.print("LAT: ");
      Serial.println(gps.location.lat(), 6);
      Serial.print("LON: ");
      Serial.println(gps.location.lng(), 6);
    } else {
      Serial.println("GPS: NO FIX");
    }

    Serial.println("ALERT ACTIVE FOR 3 SECONDS");
    Serial.println("--------------------------------");
    return;
  }

  
  if (millis() - lastPrintTime >= PRINT_INTERVAL) {
    lastPrintTime = millis();

    Serial.print("AccMag: ");
    Serial.print(accMag, 2);
    Serial.print(" m/s^2 | Gas: ");
    Serial.print(gasValue);

    if (gps.location.isValid()) {
      Serial.print(" | Lat: ");
      Serial.print(gps.location.lat(), 6);
      Serial.print(" Lon: ");
      Serial.print(gps.location.lng(), 6);
    } else {
      Serial.print(" | GPS: NO FIX");
    }

    Serial.println();
  }
}


