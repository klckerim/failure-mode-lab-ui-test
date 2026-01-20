"use client"

import { Activity, BarChart3, FileText, TrendingUp, TrendingDown, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { IncidentDetail } from "@/lib/types"

interface SignalsCardsProps {
  incident: IncidentDetail
}

function MiniTrendLine({ trend, className }: { trend: "up" | "down" | "stable"; className?: string }) {
  // Simple SVG trend visualization
  const paths = {
    up: "M0 24 L8 18 L16 20 L24 12 L32 14 L40 6 L48 8",
    down: "M0 8 L8 12 L16 10 L24 18 L32 16 L40 22 L48 20",
    stable: "M0 16 L8 15 L16 17 L24 16 L32 17 L40 15 L48 16",
  }

  const colors = {
    up: "stroke-red-400",
    down: "stroke-emerald-400",
    stable: "stroke-amber-400",
  }

  return (
    <svg
      viewBox="0 0 48 32"
      className={cn("w-12 h-8", className)}
      aria-hidden="true"
    >
      <path
        d={paths[trend]}
        fill="none"
        className={cn("stroke-2", colors[trend])}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrendIcon({ trend, className }: { trend: "up" | "down" | "stable"; className?: string }) {
  if (trend === "up") return <TrendingUp className={cn("h-4 w-4 text-red-400", className)} />
  if (trend === "down") return <TrendingDown className={cn("h-4 w-4 text-emerald-400", className)} />
  return <Minus className={cn("h-4 w-4 text-amber-400", className)} />
}

export function SignalsCards({ incident }: SignalsCardsProps) {
  // Derive trends from incident data
  const latencyTrend = incident.metrics.latencyP95 > 500 ? "up" : incident.metrics.latencyP95 > 300 ? "stable" : "down"
  const errorTrend = incident.metrics.errorRate > 5 ? "up" : incident.metrics.errorRate > 2 ? "stable" : "down"
  const logTrend = incident.severity === "critical" || incident.severity === "high" ? "up" : "stable"

  const signals = [
    {
      id: "metrics",
      title: "Metrics",
      icon: BarChart3,
      value: `${incident.metrics.latencyP95}ms`,
      label: "P95 Latency",
      subValue: `${incident.metrics.errorRate.toFixed(1)}% errors`,
      trend: latencyTrend as "up" | "down" | "stable",
      description: latencyTrend === "up" ? "Above threshold" : latencyTrend === "stable" ? "Elevated" : "Recovering",
    },
    {
      id: "logs",
      title: "Logs",
      icon: FileText,
      value: `${Math.floor(50 + incident.metrics.errorRate * 10)}`,
      label: "Error logs/min",
      subValue: `${incident.signals.length} anomalies`,
      trend: logTrend as "up" | "down" | "stable",
      description: logTrend === "up" ? "Spike detected" : "Normal volume",
    },
    {
      id: "traces",
      title: "Traces",
      icon: Activity,
      value: `${Math.floor(85 - incident.metrics.errorRate * 3)}%`,
      label: "Success rate",
      subValue: `${incident.impactedEndpoints.length} spans affected`,
      trend: errorTrend as "up" | "down" | "stable",
      description: errorTrend === "up" ? "Degraded" : errorTrend === "stable" ? "Monitoring" : "Healthy",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {signals.map((signal) => {
        const Icon = signal.icon
        return (
          <Card key={signal.id} className="bg-card/50 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {signal.title}
                </div>
                <TrendIcon trend={signal.trend} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{signal.value}</p>
                  <p className="text-xs text-muted-foreground">{signal.label}</p>
                </div>
                <MiniTrendLine trend={signal.trend} />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">{signal.subValue}</span>
                <span className={cn(
                  "text-xs font-medium",
                  signal.trend === "up" ? "text-red-400" : signal.trend === "down" ? "text-emerald-400" : "text-amber-400"
                )}>
                  {signal.description}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export function SignalsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-8 w-12" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
