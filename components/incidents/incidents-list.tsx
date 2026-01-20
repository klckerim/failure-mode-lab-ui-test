"use client"

import React from "react"

import { format, formatDistanceToNow } from "date-fns"
import { 
  AlertOctagon, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  User, 
  CheckCircle,
  Eye,
  UserCheck,
  Inbox
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { IncidentDetail, IncidentSeverity, IncidentStatus } from "@/lib/types"

interface IncidentsListProps {
  incidents: IncidentDetail[]
  selectedIncident: IncidentDetail | null
  onSelectIncident: (incident: IncidentDetail) => void
  onAcknowledge: (incident: IncidentDetail) => void
  onResolve: (incident: IncidentDetail) => void
  isLoading?: boolean
}

const severityConfig: Record<IncidentSeverity, { label: string; icon: React.ElementType; className: string; rowClassName: string }> = {
  critical: {
    label: "S1",
    icon: AlertOctagon,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
    rowClassName: "border-l-red-500",
  },
  high: {
    label: "S2",
    icon: AlertTriangle,
    className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    rowClassName: "border-l-orange-500",
  },
  medium: {
    label: "S3",
    icon: AlertCircle,
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    rowClassName: "border-l-amber-500",
  },
  low: {
    label: "S4",
    icon: Info,
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    rowClassName: "border-l-blue-500",
  },
}

const statusConfig: Record<IncidentStatus, { label: string; icon: React.ElementType; className: string }> = {
  open: {
    label: "Open",
    icon: AlertCircle,
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  acknowledged: {
    label: "Ack",
    icon: UserCheck,
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle,
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
}

export function IncidentsList({
  incidents,
  selectedIncident,
  onSelectIncident,
  onAcknowledge,
  onResolve,
  isLoading = false,
}: IncidentsListProps) {
  if (isLoading) {
    return <IncidentsListSkeleton />
  }

  if (incidents.length === 0) {
    return <IncidentsEmptyState />
  }

  return (
    <div className="space-y-2" role="list" aria-label="Incidents list">
      {incidents.map((incident) => {
        const severityCfg = severityConfig[incident.severity]
        const statusCfg = statusConfig[incident.status]
        const SeverityIcon = severityCfg.icon
        const StatusIcon = statusCfg.icon
        const isSelected = selectedIncident?.id === incident.id

        return (
          <div
            key={incident.id}
            role="listitem"
            className={cn(
              "group relative rounded-lg border border-l-4 bg-card p-4 transition-colors cursor-pointer",
              severityCfg.rowClassName,
              isSelected ? "ring-2 ring-primary bg-secondary/50" : "hover:bg-secondary/30"
            )}
            onClick={() => onSelectIncident(incident)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onSelectIncident(incident)
              }
            }}
            tabIndex={0}
            aria-selected={isSelected}
            aria-label={`${severityCfg.label} incident: ${incident.title}`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={cn("shrink-0 font-mono text-xs", severityCfg.className)}>
                    <SeverityIcon className="mr-1 h-3 w-3" aria-hidden="true" />
                    {severityCfg.label}
                  </Badge>
                  <Badge variant="outline" className={cn("shrink-0", statusCfg.className)}>
                    <StatusIcon className="mr-1 h-3 w-3" aria-hidden="true" />
                    {statusCfg.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{incident.id}</span>
                </div>

                <h3 className="font-medium text-foreground leading-tight">{incident.title}</h3>
                
                <p className="text-sm text-muted-foreground line-clamp-1">{incident.summary}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span className="font-mono">{incident.service}</span>
                  <span className="hidden sm:inline">|</span>
                  <span title={format(incident.detectedAt, "PPpp")}>
                    {formatDistanceToNow(incident.detectedAt, { addSuffix: true })}
                  </span>
                  <span className="hidden sm:inline">|</span>
                  <span className="font-mono text-xs">Run: {incident.runId}</span>
                  {incident.owner && (
                    <>
                      <span className="hidden sm:inline">|</span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" aria-hidden="true" />
                        {incident.owner.split("@")[0]}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {incident.status === "open" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAcknowledge(incident)
                    }}
                    className="bg-transparent"
                    aria-label={`Acknowledge incident ${incident.id}`}
                  >
                    <UserCheck className="h-4 w-4 sm:mr-1" aria-hidden="true" />
                    <span className="hidden sm:inline">Ack</span>
                  </Button>
                )}
                {incident.status !== "resolved" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onResolve(incident)
                    }}
                    className="bg-transparent text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                    aria-label={`Resolve incident ${incident.id}`}
                  >
                    <CheckCircle className="h-4 w-4 sm:mr-1" aria-hidden="true" />
                    <span className="hidden sm:inline">Resolve</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectIncident(incident)
                  }}
                  aria-label={`View details for incident ${incident.id}`}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function IncidentsListSkeleton() {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading incidents">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-l-4 border-l-muted bg-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function IncidentsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-emerald-500/10 p-4 mb-4">
        <Inbox className="h-8 w-8 text-emerald-500" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">No incidents found</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        No incidents match your current filters. Try adjusting your search criteria or check back later.
      </p>
    </div>
  )
}
