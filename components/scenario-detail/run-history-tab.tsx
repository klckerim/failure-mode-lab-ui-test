"use client"

import React from "react"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ExternalLink,
  History,
  Clock,
  Activity
} from "lucide-react"
import type { Run, RunStatus } from "@/lib/types"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface RunHistoryTabProps {
  runs: Run[]
  isLoading?: boolean
}

const statusConfig: Record<RunStatus, { icon: React.ElementType; className: string; label: string }> = {
  success: {
    icon: CheckCircle2,
    className: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
    label: "Success",
  },
  failed: {
    icon: XCircle,
    className: "bg-red-500/15 text-red-500 border-red-500/20",
    label: "Failed",
  },
  degraded: {
    icon: AlertTriangle,
    className: "bg-amber-500/15 text-amber-500 border-amber-500/20",
    label: "Degraded",
  },
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

function StatusBadge({ status }: { status: RunStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={cn("gap-1", config.className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </Badge>
  )
}

function MetricPill({ label, value, warning }: { label: string; value: string; warning?: boolean }) {
  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
        warning ? "bg-amber-500/10 text-amber-400" : "bg-secondary text-muted-foreground"
      )}
    >
      {label}: <span className="font-medium">{value}</span>
    </span>
  )
}

export function RunHistoryTab({ runs, isLoading }: RunHistoryTabProps) {
  if (isLoading) {
    return <RunHistoryTabSkeleton />
  }

  if (runs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <History className="h-12 w-12 text-muted-foreground/30 mb-4" aria-hidden="true" />
        <h3 className="text-lg font-medium text-foreground mb-1">No runs yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          This scenario has not been executed yet. Click &ldquo;Run Now&rdquo; to start your first chaos experiment.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Recent Executions
        </h3>
        <Badge variant="secondary" className="text-xs">
          {runs.length} run{runs.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <Card className="bg-card/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="text-muted-foreground">Run ID</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Started At</TableHead>
                <TableHead className="text-muted-foreground">Duration</TableHead>
                <TableHead className="text-muted-foreground">Key Metrics</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => (
                <TableRow 
                  key={run.id} 
                  className="hover:bg-muted/50 border-border/50"
                >
                  <TableCell>
                    <span className="font-mono text-sm text-foreground">
                      {run.id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={run.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {format(run.startedAt, "MMM d, HH:mm")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground">
                      {formatDuration(run.duration)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <MetricPill 
                        label="P99" 
                        value={`${Math.round(run.metrics.latencyP99)}ms`}
                        warning={run.metrics.latencyP99 > 400}
                      />
                      <MetricPill 
                        label="Err" 
                        value={`${run.metrics.errorRate.toFixed(1)}%`}
                        warning={run.metrics.errorRate > 1}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="h-8"
                    >
                      <Link href={`/runs/${run.id}`}>
                        <ExternalLink className="h-4 w-4 mr-1" aria-hidden="true" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" size="sm" asChild className="bg-transparent">
          <Link href="/runs">
            <Activity className="h-4 w-4 mr-1.5" aria-hidden="true" />
            View All Runs
          </Link>
        </Button>
      </div>
    </div>
  )
}

function RunHistoryTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-12" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-12" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-14" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
