import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <CardTitle className="font-display text-2xl">
            Authentication Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Something went wrong during authentication. Please try again.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-3">
          <Link href="/auth/login">
            <Button>Back to Sign In</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}