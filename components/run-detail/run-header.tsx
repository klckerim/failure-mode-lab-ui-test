"use client"

import { format } from "date-fns"
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Clock,
  Server,
  Square,
  Download,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { RunDetail } from "@/lib/types"

interface RunHeaderProps {
  run: RunDetail | null
  isLoading?: boolean
  onStopRun?: () => void
  onExportJson?: () => void
}

const statusConfig = {
  success: {
    label: "Success",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: AlertCircle,
  },
  degraded: {
    label: "Degraded",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: AlertTriangle,
  },
}

const environmentConfig = {
  production: "bg-red-500/10 text-red-400 border-red-500/20",
  staging: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  development: "bg-blue-500/10 text-blue-400 border-blue-500/20",
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`
}

export function RunHeader({ run, isLoading, onStopRun, onExportJson }: RunHeaderProps) {
  if (isLoading) {
    return <RunHeaderSkeleton />
  }

  if (!run) {
    return null
  }

  const StatusIcon = statusConfig[run.status].icon

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold font-mono text-foreground">
              {run.id}
            </h1>
            <Badge
              variant="outline"
              className={cn("shrink-0", statusConfig[run.status].className)}
            >
              <StatusIcon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              {statusConfig[run.status].label}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 capitalize",
                environmentConfig[run.environment as keyof typeof environmentConfig]
              )}
            >
              <Server className="mr-1.5 h-3 w-3" aria-hidden="true" />
              {run.environment}
            </Badge>
          </div>

          <div>
            <p className="text-base font-medium text-foreground">{run.scenario}</p>
            <p className="text-sm text-muted-foreground font-mono">{run.scenarioId}</p>
          </div>

          <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <dt className="text-muted-foreground">Started</dt>
              <dd className="text-foreground">
                {format(run.startedAt, "MMM d, yyyy 'at' HH:mm:ss")}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <dt className="sr-only">Duration</dt>
              <dd className="text-foreground">{formatDuration(run.duration)}</dd>
            </div>
          </dl>
        </div>

        <div className="flex gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={onStopRun}
            className="bg-transparent text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
            aria-label="Stop this run"
          >
            <Square className="mr-2 h-4 w-4" aria-hidden="true" />
            Stop Run
          </Button>
          <Button
            variant="outline"
            onClick={onExportJson}
            className="bg-transparent"
            aria-label="Export run data as JSON"
          >
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Export JSON
          </Button>
        </div>
      </div>
    </div>
  )
}

function RunHeaderSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-6">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}
