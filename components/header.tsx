"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Home,
  Activity,
  ShoppingBag,
  Users,
  Menu,
  LogOut,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { useTheme } from "next-themes"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/status", label: "Status", icon: Activity },
  { href: "/store", label: "Store", icon: ShoppingBag },
  { href: "/about-creators", label: "About Creators", icon: Users },
]

export function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  const { theme, resolvedTheme } = useTheme()
  const currentTheme = theme === "system" ? resolvedTheme : theme
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          {mounted && (
            <Image
              src={
                currentTheme === "dark"
                  ? "/dark-logo.png"
                  : "/light-logo.png"
              }
              alt="ResQ logo"
              width={36}
              height={36}
              className="rounded-lg"
              priority
            />
          )}
          <span className="font-display text-xl font-bold tracking-tight text-primary">
            ResQ
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary ${pathname === link.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user.email?.split("@")[0]}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-1.5 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              <div className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary ${pathname === link.href
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  )
                })}

                <div className="my-3 border-t" />

                {user ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleSignOut()
                      setOpen(false)
                    }}
                  >
                    <LogOut className="mr-1.5 h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/auth/login" onClick={() => setOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up" onClick={() => setOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}