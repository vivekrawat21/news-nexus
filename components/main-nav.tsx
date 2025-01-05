"use client"

import { cn } from "@/lib/utils"
import { BarChart, MapPin, DollarSign } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

export function MainNav() {
  const pathname = usePathname()
  const { userId } = useAuth() // Get the current user's ID to check if they are logged in
 


  const routes = [
    {
      href: "/",
      label: "Home",
      icon: MapPin,
      active: pathname === "/",
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: BarChart,
      active: pathname === "/analytics",
      // Only show if user is logged in
      show: !!userId,
    },
    {
      href: "/payout",
      label: "Payout",
      icon: DollarSign,
      active: pathname === "/payout",
      // Only show if user is logged in
      show: !!userId,
    },
  ]

  return (
    <nav className="flex items-center space-x-2 lg:space-x-6">
      {routes.map(
        (route) =>
          route.show !== false && (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                route.active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <route.icon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline-block">{route.label}</span>
            </Link>
          )
      )}
    
    </nav>
  )
}
