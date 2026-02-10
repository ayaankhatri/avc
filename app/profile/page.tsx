"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  UserCircle,
  LogOut,
  Trash2,
  Pencil,
  HardHat,
  Mail,
  User,
  Calendar,
  Loader2,
  Shield,
} from "lucide-react"
import { toast } from "sonner"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface WorkerRow {
  id: string
  helmet_number: string
  worker_name: string
  status: string
  created_at: string
}

interface ProfileData {
  name: string | null
  username: string | null
  email: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [workers, setWorkers] = useState<WorkerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  // Edit form state
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", username: "", email: "" })
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      router.push("/auth/login")
      return
    }

    setUser(authUser)

    // Fetch profile from profiles table
    const { data: profileData } = await supabase
      .from("profiles")
      .select("name, username, email")
      .eq("id", authUser.id)
      .single()

    const prof: ProfileData = {
      name:
        profileData?.name ||
        authUser.user_metadata?.name ||
        null,
      username:
        profileData?.username ||
        authUser.user_metadata?.username ||
        null,
      email: profileData?.email || authUser.email || null,
    }
    setProfile(prof)
    setEditForm({
      name: prof.name || "",
      username: prof.username || "",
      email: prof.email || "",
    })

    // Fetch workers
    const { data: workerData } = await supabase
      .from("workers")
      .select("id, helmet_number, worker_name, status, created_at")
      .eq("user_id", authUser.id)
      .order("created_at", { ascending: false })

    if (workerData) setWorkers(workerData)

    setLoading(false)
  }, [supabase, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    setDeleting(true)

    try {
      // Delete workers (cascade will remove sensor_readings and alert_history)
      await supabase.from("workers").delete().eq("user_id", user.id)

      // Delete orders
      await supabase.from("orders").delete().eq("user_id", user.id)

      // Delete profile
      await supabase.from("profiles").delete().eq("id", user.id)

      // Sign out (the auth.users row with ON DELETE CASCADE handles the rest)
      await supabase.auth.signOut()

      toast.success("Account and all associated data deleted.")
      window.location.href = "/"
    } catch {
      toast.error("Failed to delete account. Please try again.")
      setDeleting(false)
    }
  }

  const handleEditSave = async () => {
    if (!user) return
    setSaving(true)

    try {
      // Update profile table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: editForm.name || null,
          username: editForm.username || null,
          email: editForm.email || null,
        })
        .eq("id", user.id)

      if (profileError) throw profileError

      // Update auth user metadata
      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          name: editForm.name,
          username: editForm.username,
        },
      })

      if (metaError) throw metaError

      // If email changed, update auth email too
      if (editForm.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: editForm.email,
        })
        if (emailError) throw emailError
        toast.success("Profile updated. Check your new email for confirmation.")
      } else {
        toast.success("Profile updated successfully.")
      }

      setProfile({
        name: editForm.name,
        username: editForm.username,
        email: editForm.email,
      })
      setEditOpen(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile."
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !profile) return null

  const initials = (profile.name || profile.username || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <CardTitle className="font-display text-2xl">
                {profile.name || "No Name Set"}
              </CardTitle>
              {profile.username && (
                <CardDescription className="text-base">
                  @{profile.username}
                </CardDescription>
              )}
            </div>

            {/* Edit Profile */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-1.5 h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your personal details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="edit-username">Username</Label>
                    <Input
                      id="edit-username"
                      value={editForm.username}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, username: e.target.value }))
                      }
                      placeholder="youruser"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setEditOpen(false)}
                    className="bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleEditSave} disabled={saving}>
                    {saving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Username</p>
                <p className="text-sm font-medium">
                  {profile.username || "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {user.id.slice(0, 8)}...
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="text-sm font-medium">
                  {new Date(user.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workers List */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <HardHat className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Registered Workers</CardTitle>
          </div>
          <CardDescription>
            {workers.length === 0
              ? "No workers registered yet."
              : `${workers.length} worker${workers.length > 1 ? "s" : ""} registered`}
          </CardDescription>
        </CardHeader>

        {workers.length > 0 && (
          <CardContent>
            <div className="flex flex-col gap-3">
              {workers.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <HardHat className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{w.worker_name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        Helmet: {w.helmet_number}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={w.status === "safe" ? "secondary" : "destructive"}
                    className={
                      w.status === "safe"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : ""
                    }
                  >
                    {w.status === "safe" ? "Safe" : "Danger"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full justify-start bg-transparent"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>

          <Separator />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full justify-start"
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete your account?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account, all your worker data, sensor readings, alert history,
                  and order records from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, delete everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
