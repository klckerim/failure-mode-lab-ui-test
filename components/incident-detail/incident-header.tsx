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
  ChevronLeft,
  Download,
  Server,
  Clock,
  LinkIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { IncidentDetail, IncidentSeverity, IncidentStatus } from "@/lib/types"

interface IncidentHeaderProps {
  incident: IncidentDetail
  onAcknowledge: () => void
  onResolve: () => void
  onExport: () => void
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

export function IncidentHeader({ incident, onAcknowledge, onResolve, onExport }: IncidentHeaderProps) {
  const severityCfg = severityConfig[incident.severity]
  const statusCfg = statusConfig[incident.status]
  const SeverityIcon = severityCfg.icon
  const StatusIcon = statusCfg.icon

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link
            href="/incidents"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Incidents
          </Link>
          <span>/</span>
          <span className="font-mono text-foreground">{incident.id}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className={cn("font-mono", severityCfg.className)}>
                <SeverityIcon className="mr-1 h-3 w-3" aria-hidden="true" />
                {severityCfg.label} - {severityCfg.fullLabel}
              </Badge>
              <Badge variant="outline" className={statusCfg.className}>
                <StatusIcon className="mr-1 h-3 w-3" aria-hidden="true" />
                {statusCfg.label}
              </Badge>
            </div>

            <h1 className="text-2xl font-bold text-foreground text-balance">{incident.title}</h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4" aria-hidden="true" />
                <span className="font-mono">{incident.service}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>Detected {formatDistanceToNow(incident.detectedAt, { addSuffix: true })}</span>
                <span className="text-xs">({format(incident.detectedAt, "MMM d, HH:mm:ss")})</span>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" aria-hidden="true" />
                <Link
                  href={`/runs/${incident.runId}`}
                  className="font-mono hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  {incident.runId}
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {incident.status === "open" && (
              <Button
                variant="outline"
                onClick={onAcknowledge}
                className="bg-transparent"
              >
                <UserCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                Acknowledge
              </Button>
            )}
            {incident.status !== "resolved" && (
              <Button
                variant="outline"
                onClick={onResolve}
                className="bg-transparent text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                <CheckCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                Resolve
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onExport}
              className="bg-transparent"
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function IncidentHeaderSkeleton() {
  return (
    <div className="border-b border-border bg-card/50">
      <div className="px-6 py-4">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>
            <Skeleton className="h-8 w-80" />
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
