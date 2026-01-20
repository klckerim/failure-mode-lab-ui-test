"use client"

import React from "react"

import Link from "next/link"
import { format, formatDistanceToNow } from "date-fns"
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ExternalLink,
  Inbox
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { Run, RunStatus } from "@/lib/types"

interface RelatedRunsProps {
  runs: Run[]
  currentRunId: string
}

const statusConfig: Record<RunStatus, { label: string; icon: React.ElementType; className: string }> = {
  success: {
    label: "Success",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  degraded: {
    label: "Degraded",
    icon: AlertTriangle,
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${seconds}s`
}

export function RelatedRuns({ runs, currentRunId }: RelatedRunsProps) {
  if (runs.length === 0) {
    return (
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Related Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Inbox className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No related runs found</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Runs from the same service will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Related Runs
          </CardTitle>
          <span className="text-sm text-muted-foreground">{runs.length} runs</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground">Run ID</TableHead>
                <TableHead className="text-muted-foreground">Scenario</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Started</TableHead>
                <TableHead className="text-muted-foreground">Duration</TableHead>
                <TableHead className="text-muted-foreground text-right">P99</TableHead>
                <TableHead className="text-muted-foreground text-right">Errors</TableHead>
                <TableHead className="text-muted-foreground sr-only">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => {
                const statusCfg = statusConfig[run.status]
                const StatusIcon = statusCfg.icon
                const isCurrent = run.id === currentRunId

                return (
                  <TableRow
                    key={run.id}
                    className={cn(
                      "border-border",
                      isCurrent && "bg-primary/5"
                    )}
                  >
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        {run.id}
                        {isCurrent && (
                          <Badge variant="outline" className="text-xs">
                            Trigger
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={run.scenario}>
                      {run.scenario}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusCfg.className}>
                        <StatusIcon className="mr-1 h-3 w-3" aria-hidden="true" />
                        {statusCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <span title={format(run.startedAt, "MMM d, yyyy HH:mm:ss")}>
                        {formatDistanceToNow(run.startedAt, { addSuffix: true })}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDuration(run.duration)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {Math.round(run.metrics.latencyP99)}ms
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-mono text-sm",
                      run.metrics.errorRate > 5 ? "text-red-400" : "text-muted-foreground"
                    )}>
                      {run.metrics.errorRate.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="bg-transparent"
                      >
                        <Link href={`/runs/${run.id}`} aria-label={`View details for ${run.id}`}>
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export function RelatedRunsSkeleton() {
  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-12" /></TableHead>
                <TableHead><Skeleton className="h-4 w-12" /></TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="border-border">
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
