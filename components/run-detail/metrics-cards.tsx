"use client"

import React from "react"

import { Clock, AlertCircle, Activity, Cpu, HardDrive } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { RunDetail } from "@/lib/types"

interface MetricsCardsProps {
  run: RunDetail | null
  isLoading?: boolean
}

interface MetricConfig {
  label: string
  icon: React.ElementType
  getValue: (run: RunDetail) => string
  getStatus: (run: RunDetail) => "normal" | "warning" | "critical"
  description: string
}

const metricsConfig: MetricConfig[] = [
  {
    label: "P95 Latency",
    icon: Clock,
    getValue: (run) => `${run.metrics.latencyP95.toFixed(0)}ms`,
    getStatus: (run) =>
      run.metrics.latencyP95 > 400 ? "critical" : run.metrics.latencyP95 > 200 ? "warning" : "normal",
    description: "95th percentile response time",
  },
  {
    label: "Error Rate",
    icon: AlertCircle,
    getValue: (run) => `${run.metrics.errorRate.toFixed(2)}%`,
    getStatus: (run) =>
      run.metrics.errorRate > 5 ? "critical" : run.metrics.errorRate > 1 ? "warning" : "normal",
    description: "Percentage of failed requests",
  },
  {
    label: "Throughput",
    icon: Activity,
    getValue: (run) => `${run.metrics.throughput.toLocaleString()} req/s`,
    getStatus: (run) =>
      run.metrics.throughput < 500 ? "critical" : run.metrics.throughput < 1000 ? "warning" : "normal",
    description: "Requests processed per second",
  },
  {
    label: "CPU Usage",
    icon: Cpu,
    getValue: (run) => `${run.metrics.cpuUsage.toFixed(1)}%`,
    getStatus: (run) =>
      run.metrics.cpuUsage > 85 ? "critical" : run.metrics.cpuUsage > 70 ? "warning" : "normal",
    description: "Average CPU utilization",
  },
  {
    label: "Memory Usage",
    icon: HardDrive,
    getValue: (run) => `${run.metrics.memoryUsage.toFixed(1)}%`,
    getStatus: (run) =>
      run.metrics.memoryUsage > 85 ? "critical" : run.metrics.memoryUsage > 70 ? "warning" : "normal",
    description: "Average memory utilization",
  },
]

const statusStyles = {
  normal: {
    card: "border-border",
    icon: "text-muted-foreground",
    value: "text-foreground",
  },
  warning: {
    card: "border-amber-500/20 bg-amber-500/5",
    icon: "text-amber-400",
    value: "text-amber-400",
  },
  critical: {
    card: "border-red-500/20 bg-red-500/5",
    icon: "text-red-400",
    value: "text-red-400",
  },
}

export function MetricsCards({ run, isLoading }: MetricsCardsProps) {
  if (isLoading) {
    return <MetricsCardsSkeleton />
  }

  if (!run) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No metrics data available</p>
      </div>
    )
  }

  return (
    <section aria-labelledby="metrics-heading">
      <h2 id="metrics-heading" className="text-lg font-semibold text-foreground mb-4">
        Metrics
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {metricsConfig.map((metric) => {
          const status = metric.getStatus(run)
          const styles = statusStyles[status]
          const Icon = metric.icon

          return (
            <Card key={metric.label} className={cn("bg-card", styles.card)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <Icon
                  className={cn("h-4 w-4", styles.icon)}
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl font-bold", styles.value)}>
                  {metric.getValue(run)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

function MetricsCardsSkeleton() {
  return (
    <section aria-labelledby="metrics-heading-skeleton">
      <Skeleton className="h-7 w-24 mb-4" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
