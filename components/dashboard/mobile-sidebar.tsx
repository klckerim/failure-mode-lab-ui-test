"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Play,
  FileText,
  AlertTriangle,
  Settings,
  Activity,
} from "lucide-react"

const navItems = [
  { name: "Runs", href: "/runs", icon: Play },
  { name: "Scenarios", href: "/scenarios", icon: FileText },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function MobileSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="flex items-center gap-2 h-16 px-6 border-b border-sidebar-border">
        <Activity className="h-6 w-6 text-emerald-500" aria-hidden="true" />
        <span className="text-lg font-semibold text-sidebar-foreground tracking-tight">
          FailureModeLab
        </span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === "/" && item.href === "/runs")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50">
          <p className="text-xs text-sidebar-foreground/60">Environment</p>
          <p className="text-sm font-medium text-sidebar-foreground">Production</p>
        </div>
      </div>
    </div>
  )
}
