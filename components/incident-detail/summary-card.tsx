"use client"

import { FileText, AlertTriangle, Activity } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { IncidentDetail, IncidentStatus } from "@/lib/types"

interface SummaryCardProps {
  incident: IncidentDetail
}

const statusMessages: Record<IncidentStatus, { label: string; description: string; className: string }> = {
  open: {
    label: "Active Incident",
    description: "This incident requires immediate attention. No owner assigned yet.",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  acknowledged: {
    label: "Under Investigation",
    description: "An engineer has acknowledged this incident and is investigating.",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  resolved: {
    label: "Resolved",
    description: "This incident has been resolved. Monitoring for recurrence.",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
}

export function SummaryCard({ incident }: SummaryCardProps) {
  const statusInfo = statusMessages[incident.status]

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">What Happened</h4>
          <p className="text-sm text-foreground leading-relaxed">{incident.summary}</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            Impact
          </h4>
          <div className="flex flex-wrap gap-2">
            {incident.impactedEndpoints.map((endpoint) => (
              <Badge key={endpoint} variant="secondary" className="font-mono text-xs">
                {endpoint}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {incident.impactedEndpoints.length} endpoint{incident.impactedEndpoints.length !== 1 ? "s" : ""} affected
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Activity className="h-3.5 w-3.5" aria-hidden="true" />
            Current Status
          </h4>
          <div className={cn("p-3 rounded-lg border", statusInfo.className)}>
            <p className="text-sm font-medium">{statusInfo.label}</p>
            <p className="text-xs mt-1 opacity-80">{statusInfo.description}</p>
            {incident.owner && (
              <p className="text-xs mt-2">
                Owner: <span className="font-medium">{incident.owner}</span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SummaryCardSkeleton() {
  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-24" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-20 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
