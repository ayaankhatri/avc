import { MapPin, Wind, RotateCcw } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const sensors = [
  {
    icon: MapPin,
    name: "GPS (NEO-6M)",
    subtitle: "Location Tracking",
    description:
      "The NEO-6M measures the geographical location of a person in terms of latitude and longitude. In fall-detection systems, it is used to identify the exact location of the user after a fall, so that help can be sent quickly. It does not detect motion or falls; it only provides position information.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Wind,
    name: "Gas Sensor (MQ-2)",
    subtitle: "R-0479 Combustible Gas Detection",
    description:
      "The MQ-2 gas sensor measures the presence and concentration of combustible gases and smoke. It is mainly sensitive to LPG, propane, methane, hydrogen, alcohol vapours, and smoke. It does not identify a specific gas; instead, it indicates the overall level of flammable gases present in the air.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: RotateCcw,
    name: "Gyroscope (MPU-6050)",
    subtitle: "Motion & Fall Detection",
    description:
      "The MPU-6050 sensor measures motion, acceleration, and orientation of the body. It is mainly used to detect sudden changes in acceleration and abnormal body orientation, which are key indicators of a fall event. It does not directly detect a fall; instead, it provides motion data that helps identify fall-like movements based on sudden impact and tilt changes.",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
]

export function SensorsSection() {
  return (
    <section className="bg-secondary/30 px-4 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Sensors Used
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Each ResQ helmet is equipped with three precision sensors that
            work together to monitor worker safety from every angle.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {sensors.map((sensor) => (
            <Card
              key={sensor.name}
              className="border bg-card transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div
                  className={`mb-2 flex h-12 w-12 items-center justify-center rounded-lg ${sensor.bg}`}
                >
                  <sensor.icon className={`h-6 w-6 ${sensor.color}`} />
                </div>
                <CardTitle className="font-display text-lg">
                  {sensor.name}
                </CardTitle>
                <CardDescription>{sensor.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {sensor.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
