"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, AlertCircle, Clock, Flame } from "lucide-react"

interface KPIData {
  runsToday: number
  failedRuns: number
  avgLatency: number
  errorBudgetBurn: number
}

interface KPICardsProps {
  data?: KPIData
  isLoading?: boolean
}

export function KPICards({ data, isLoading = false }: KPICardsProps) {
  const kpis = [
    {
      title: "Runs Today",
      value: data?.runsToday ?? 0,
      format: (v: number) => v.toLocaleString(),
      icon: Play,
      iconColor: "text-emerald-500",
      trend: "+12% from yesterday",
    },
    {
      title: "Failed Runs",
      value: data?.failedRuns ?? 0,
      format: (v: number) => v.toLocaleString(),
      icon: AlertCircle,
      iconColor: "text-red-500",
      trend: "3 in the last hour",
    },
    {
      title: "Avg Latency",
      value: data?.avgLatency ?? 0,
      format: (v: number) => `${v}ms`,
      icon: Clock,
      iconColor: "text-amber-500",
      trend: "-8% from baseline",
    },
    {
      title: "Error Budget Burn",
      value: data?.errorBudgetBurn ?? 0,
      format: (v: number) => `${v}%`,
      icon: Flame,
      iconColor: data && data.errorBudgetBurn > 50 ? "text-red-500" : "text-emerald-500",
      trend: "23 days remaining",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="region" aria-label="Key performance indicators">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {kpi.format(kpi.value)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{kpi.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
