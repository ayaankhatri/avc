"use client"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Footer() {
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = theme === "system" ? resolvedTheme : theme
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Image
              src={
                currentTheme === "dark"
                  ? "/dark-logo.png"
                  : "/light-logo.png"
              }
              alt="ResQ logo"
              width={36}
              height={36}
              className="rounded-lg"
            />
  }

  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
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
              />
              <span className="font-display text-lg font-bold text-primary">
                ResQ
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Smart helmet safety monitoring for the modern workforce.
              Protecting lives through real-time sensor technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/status", label: "Status" },
                { href: "/store", label: "Store" },
                { href: "/about-creators", label: "About Creators" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:avc.devsoc@gmail.com" className="hover:text-foreground transition-colors">
                  avc.devsoc@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>+91 986XX XXXXX</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Vellore, Tamil Nadu, India</span>
              </li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Emergency
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li>
                Police, Fire, Ambulance Integrated: <span className="font-medium text-foreground">112</span>
              </li>
              <li>
                Police: <span className="font-medium text-foreground">100</span>
              </li>
              <li>
                Ambulance: <span className="font-medium text-foreground">102</span>
              </li>
              <li>
                Fire: <span className="font-medium text-foreground">101</span>
              </li>
              <li>
                Disaster Mgmt: <span className="font-medium text-foreground">1077</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AVC &ndash; ResQ: devsoc. All rights reserved.
        </div>
      </div>
    </footer>
  )
}