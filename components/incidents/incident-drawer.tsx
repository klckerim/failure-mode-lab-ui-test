"use client"

import React from "react"

import Link from "next/link"
import { format, formatDistanceToNow } from "date-fns"
import { 
  AlertOctagon, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  UserCheck,
  ExternalLink,
  Activity,
  Target,
  Lightbulb,
  Clock,
  TrendingUp,
  Zap,
  Bell
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { IncidentDetail, IncidentSeverity, IncidentStatus, IncidentSignal } from "@/lib/types"

interface IncidentDrawerProps {
  incident: IncidentDetail | null
  open: boolean
  onClose: () => void
  onAcknowledge: (incident: IncidentDetail) => void
  onResolve: (incident: IncidentDetail) => void
}

const severityConfig: Record<IncidentSeverity, { label: string; fullLabel: string; icon: React.ElementType; className: string }> = {
  critical: {
    label: "S1",
    fullLabel: "Critical",
    icon: AlertOctagon,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  high: {
    label: "S2",
    fullLabel: "High",
    icon: AlertTriangle,
    className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  medium: {
    label: "S3",
    fullLabel: "Medium",
    icon: AlertCircle,
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  low: {
    label: "S4",
    fullLabel: "Low",
    icon: Info,
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
}

const statusConfig: Record<IncidentStatus, { label: string; icon: React.ElementType; className: string }> = {
  open: {
    label: "Open",
    icon: AlertCircle,
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  acknowledged: {
    label: "Acknowledged",
    icon: UserCheck,
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle,
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
}

const signalTypeConfig: Record<IncidentSignal["type"], { icon: React.ElementType; className: string }> = {
  metric_anomaly: { icon: TrendingUp, className: "text-amber-400" },
  threshold_breach: { icon: Zap, className: "text-red-400" },
  correlation: { icon: Activity, className: "text-blue-400" },
  alert_fired: { icon: Bell, className: "text-orange-400" },
}

export function IncidentDrawer({ incident, open, onClose, onAcknowledge, onResolve }: IncidentDrawerProps) {
  if (!incident) return null

  const severityCfg = severityConfig[incident.severity]
  const statusCfg = statusConfig[incident.status]
  const SeverityIcon = severityCfg.icon
  const StatusIcon = statusCfg.icon

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={cn("font-mono", severityCfg.className)}>
                  <SeverityIcon className="mr-1 h-3 w-3" aria-hidden="true" />
                  {severityCfg.label} - {severityCfg.fullLabel}
                </Badge>
                <Badge variant="outline" className={statusCfg.className}>
                  <StatusIcon className="mr-1 h-3 w-3" aria-hidden="true" />
                  {statusCfg.label}
                </Badge>
              </div>
              <SheetTitle className="text-lg leading-tight">{incident.title}</SheetTitle>
              <SheetDescription className="text-sm">
                {incident.summary}
              </SheetDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            {incident.status === "open" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAcknowledge(incident)}
                className="bg-transparent"
              >
                <UserCheck className="mr-1 h-4 w-4" aria-hidden="true" />
                Acknowledge
              </Button>
            )}
            {incident.status !== "resolved" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResolve(incident)}
                className="bg-transparent text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                <CheckCircle className="mr-1 h-4 w-4" aria-hidden="true" />
                Resolve
              </Button>
            )}
            <Button variant="outline" size="sm" asChild className="bg-transparent">
              <Link href={`/runs/${incident.runId}`}>
                <ExternalLink className="mr-1 h-4 w-4" aria-hidden="true" />
                View Run
              </Link>
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6 space-y-6">
            {/* Key Metrics */}
            <section aria-labelledby="metrics-heading">
              <h3 id="metrics-heading" className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Key Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="text-xs">P95 Latency</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{incident.metrics.latencyP95}ms</p>
                </div>
                <div className={cn(
                  "p-3 rounded-lg border",
                  incident.metrics.errorRate > 5 ? "bg-red-500/5 border-red-500/20" : "bg-secondary/50 border-border"
                )}>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="text-xs">Error Rate</span>
                  </div>
                  <p className={cn(
                    "text-lg font-semibold",
                    incident.metrics.errorRate > 5 ? "text-red-400" : "text-foreground"
                  )}>
                    {incident.metrics.errorRate.toFixed(2)}%
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Signal Timeline */}
            <section aria-labelledby="timeline-heading">
              <h3 id="timeline-heading" className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Signal Timeline
              </h3>
              <div className="relative space-y-0">
                {incident.signals.map((signal, index) => {
                  const SignalIcon = signalTypeConfig[signal.type].icon
                  const isLast = index === incident.signals.length - 1
                  return (
                    <div key={signal.id} className="relative flex gap-4 pb-4">
                      {!isLast && (
                        <div
                          className="absolute left-[11px] top-6 h-full w-px bg-border"
                          aria-hidden="true"
                        />
                      )}
                      <div className={cn("mt-0.5 shrink-0", signalTypeConfig[signal.type].className)}>
                        <SignalIcon className="h-[22px] w-[22px]" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{signal.title}</p>
                        {signal.value && (
                          <p className="text-xs text-muted-foreground mt-0.5 font-mono">{signal.value}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(signal.timestamp, "HH:mm:ss")} ({formatDistanceToNow(signal.timestamp, { addSuffix: true })})
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <Separator />

            {/* Suspected Root Cause */}
            <section aria-labelledby="rootcause-heading">
              <h3 id="rootcause-heading" className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Suspected Root Cause
              </h3>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-sm text-foreground leading-relaxed">{incident.suspectedRootCause}</p>
              </div>
            </section>

            <Separator />

            {/* Impacted Endpoints */}
            <section aria-labelledby="endpoints-heading">
              <h3 id="endpoints-heading" className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Impacted Endpoints
              </h3>
              <div className="flex flex-wrap gap-2">
                {incident.impactedEndpoints.map((endpoint) => (
                  <Badge 
                    key={endpoint} 
                    variant="secondary" 
                    className="font-mono text-xs"
                  >
                    {endpoint}
                  </Badge>
                ))}
              </div>
            </section>

            <Separator />

            {/* Recommended Actions */}
            <section aria-labelledby="actions-heading">
              <h3 id="actions-heading" className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Recommended Actions
              </h3>
              <ul className="space-y-2">
                {incident.recommendedActions.map((action, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground">{action}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Incident Details */}
            <Separator />
            <section aria-labelledby="details-heading">
              <h3 id="details-heading" className="text-sm font-semibold text-foreground mb-3">
                Details
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Incident ID</dt>
                  <dd className="text-foreground font-mono text-xs">{incident.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Service</dt>
                  <dd className="text-foreground font-mono text-xs">{incident.service}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Detected</dt>
                  <dd className="text-foreground">{format(incident.detectedAt, "MMM d, yyyy HH:mm:ss")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Run ID</dt>
                  <dd className="text-foreground font-mono text-xs">{incident.runId}</dd>
                </div>
                {incident.owner && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Owner</dt>
                    <dd className="text-foreground">{incident.owner}</dd>
                  </div>
                )}
              </dl>
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
