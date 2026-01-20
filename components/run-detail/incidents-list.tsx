"use client"

import React from "react"

import { format } from "date-fns"
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Incident, IncidentSeverity } from "@/lib/types"

interface IncidentsListProps {
  incidents: Incident[] | null
  isLoading?: boolean
}

const severityConfig: Record<
  IncidentSeverity,
  {
    icon: React.ElementType
    label: string
    className: string
    cardClassName: string
  }
> = {
  critical: {
    icon: AlertOctagon,
    label: "Critical",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
    cardClassName: "border-l-red-500",
  },
  high: {
    icon: AlertTriangle,
    label: "High",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    cardClassName: "border-l-orange-500",
  },
  medium: {
    icon: Info,
    label: "Medium",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    cardClassName: "border-l-amber-500",
  },
  low: {
    icon: Info,
    label: "Low",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    cardClassName: "border-l-blue-500",
  },
}

export function IncidentsList({ incidents, isLoading }: IncidentsListProps) {
  if (isLoading) {
    return <IncidentsListSkeleton />
  }

  if (!incidents || incidents.length === 0) {
    return (
      <section aria-labelledby="incidents-heading">
        <h2 id="incidents-heading" className="text-lg font-semibold text-foreground mb-4">
          Detected Incidents
        </h2>
        <Card className="bg-card">
          <CardContent className="py-8 text-center">
            <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-3" aria-hidden="true" />
            <p className="text-foreground font-medium mb-1">No incidents detected</p>
            <p className="text-sm text-muted-foreground">
              The system performed within expected parameters during this run
            </p>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section aria-labelledby="incidents-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 id="incidents-heading" className="text-lg font-semibold text-foreground">
          Detected Incidents
        </h2>
        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
          {incidents.length} {incidents.length === 1 ? "issue" : "issues"} found
        </Badge>
      </div>
      <div className="space-y-4" role="list" aria-label="Detected incidents">
        {incidents.map((incident) => {
          const config = severityConfig[incident.severity]
          const Icon = config.icon

          return (
            <Card
              key={incident.id}
              className={cn("bg-card border-l-4", config.cardClassName)}
              role="listitem"
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={cn("mt-0.5 shrink-0", severityConfig[incident.severity].className.split(" ")[1])}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{incident.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Detected at {format(incident.detectedAt, "HH:mm:ss")}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("shrink-0", config.className)}>
                      {config.label}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground pl-8">
                    {incident.description}
                  </p>

                  <div className="flex items-start gap-2 pl-8 pt-2 border-t border-border">
                    <ArrowRight className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-medium text-emerald-400 uppercase tracking-wide">
                        Recommended Action
                      </p>
                      <p className="text-sm text-foreground mt-1">
                        {incident.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

function IncidentsListSkeleton() {
  return (
    <section aria-labelledby="incidents-heading-skeleton">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="bg-card border-l-4 border-l-muted">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 shrink-0" />
                    <div>
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-3 w-28 mt-1" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-full ml-8" />
                <Skeleton className="h-4 w-3/4 ml-8" />
                <div className="pl-8 pt-2 border-t border-border">
                  <Skeleton className="h-3 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
