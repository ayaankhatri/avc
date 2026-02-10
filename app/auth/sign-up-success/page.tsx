import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MailCheck } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Signed Up Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center">
            Please check your email for a confirmation link, then you can start
            using ResQ.
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center gap-3">
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
