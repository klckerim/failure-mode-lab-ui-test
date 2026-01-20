"use client"

import React from "react"

import { format } from "date-fns"
import { Clock, Activity, AlertCircle, CheckCircle, AlertTriangle, Info, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Run } from "@/lib/types"

interface RunDetailDrawerProps {
  run: Run | null
  open: boolean
  onClose: () => void
}

const statusConfig = {
  success: {
    label: "Success",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: AlertCircle,
  },
  degraded: {
    label: "Degraded",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    icon: AlertTriangle,
  },
}

const timelineTypeConfig = {
  info: { icon: Info, className: "text-blue-400" },
  warning: { icon: AlertTriangle, className: "text-amber-400" },
  error: { icon: AlertCircle, className: "text-red-400" },
  success: { icon: CheckCircle, className: "text-emerald-400" },
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`
}

export function RunDetailDrawer({ run, open, onClose }: RunDetailDrawerProps) {
  if (!run) return null

  const StatusIcon = statusConfig[run.status].icon

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <SheetTitle className="font-mono text-base">{run.id}</SheetTitle>
              <SheetDescription className="text-sm">
                {run.scenario}
              </SheetDescription>
            </div>
            <Badge variant="outline" className={cn("shrink-0", statusConfig[run.status].className)}>
              <StatusIcon className="mr-1 h-3 w-3" aria-hidden="true" />
              {statusConfig[run.status].label}
            </Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Key Metrics */}
            <section aria-labelledby="metrics-heading">
              <h3 id="metrics-heading" className="text-sm font-semibold text-foreground mb-4">
                Key Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  label="Latency P50"
                  value={`${run.metrics.latencyP50.toFixed(0)}ms`}
                  icon={Clock}
                />
                <MetricCard
                  label="Latency P99"
                  value={`${run.metrics.latencyP99.toFixed(0)}ms`}
                  icon={Clock}
                />
                <MetricCard
                  label="Error Rate"
                  value={`${run.metrics.errorRate.toFixed(2)}%`}
                  icon={AlertCircle}
                  highlight={run.metrics.errorRate > 1}
                />
                <MetricCard
                  label="Requests"
                  value={run.metrics.requestCount.toLocaleString()}
                  icon={Activity}
                />
              </div>
            </section>

            <Separator />

            {/* Run Info */}
            <section aria-labelledby="info-heading">
              <h3 id="info-heading" className="text-sm font-semibold text-foreground mb-4">
                Run Information
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Started</dt>
                  <dd className="text-foreground">{format(run.startedAt, "MMM d, yyyy HH:mm:ss")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="text-foreground">{formatDuration(run.duration)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Scenario ID</dt>
                  <dd className="text-foreground font-mono text-xs">{run.scenarioId}</dd>
                </div>
              </dl>
            </section>

            {/* Top Errors */}
            {run.errors.length > 0 && (
              <>
                <Separator />
                <section aria-labelledby="errors-heading">
                  <h3 id="errors-heading" className="text-sm font-semibold text-foreground mb-4">
                    Top Errors
                  </h3>
                  <div className="space-y-3">
                    {run.errors.map((error, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between gap-4 p-3 rounded-lg bg-red-500/5 border border-red-500/10"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-xs text-red-400">{error.code}</p>
                          <p className="text-sm text-muted-foreground mt-0.5 truncate">{error.message}</p>
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {error.count}x
                        </Badge>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            <Separator />

            {/* Timeline */}
            <section aria-labelledby="timeline-heading">
              <h3 id="timeline-heading" className="text-sm font-semibold text-foreground mb-4">
                Timeline
              </h3>
              <div className="relative space-y-0">
                {run.timeline.map((event, index) => {
                  const TypeIcon = timelineTypeConfig[event.type].icon
                  const isLast = index === run.timeline.length - 1
                  return (
                    <div key={index} className="relative flex gap-4 pb-4">
                      {!isLast && (
                        <div
                          className="absolute left-[11px] top-6 h-full w-px bg-border"
                          aria-hidden="true"
                        />
                      )}
                      <div className={cn("mt-1 shrink-0", timelineTypeConfig[event.type].className)}>
                        <TypeIcon className="h-[22px] w-[22px]" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{event.event}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(event.timestamp, "HH:mm:ss")}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="border-t border-border p-4">
          <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MetricCard({
  label,
  value,
  icon: Icon,
  highlight = false,
}: {
  label: string
  value: string
  icon: React.ElementType
  highlight?: boolean
}) {
  return (
    <div className={cn(
      "p-3 rounded-lg border",
      highlight ? "bg-red-500/5 border-red-500/20" : "bg-secondary/50 border-border"
    )}>
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-xs">{label}</span>
      </div>
      <p className={cn(
        "text-lg font-semibold",
        highlight ? "text-red-400" : "text-foreground"
      )}>
        {value}
      </p>
    </div>
  )
}
