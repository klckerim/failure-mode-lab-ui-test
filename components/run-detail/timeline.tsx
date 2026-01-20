"use client"

import React from "react"

import { format } from "date-fns"
import {
  Zap,
  RefreshCw,
  ShieldOff,
  LifeBuoy,
  CheckCircle,
  Info,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { DetailedTimelineEvent, TimelineEventType } from "@/lib/types"

interface TimelineProps {
  events: DetailedTimelineEvent[] | null
  isLoading?: boolean
}

const eventTypeConfig: Record<
  TimelineEventType,
  {
    icon: React.ElementType
    label: string
    className: string
    badgeClassName: string
  }
> = {
  fault_injected: {
    icon: Zap,
    label: "Fault Injected",
    className: "text-orange-400",
    badgeClassName: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  retry_triggered: {
    icon: RefreshCw,
    label: "Retry Triggered",
    className: "text-blue-400",
    badgeClassName: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  circuit_breaker_open: {
    icon: ShieldOff,
    label: "Circuit Breaker Open",
    className: "text-red-400",
    badgeClassName: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  fallback_served: {
    icon: LifeBuoy,
    label: "Fallback Served",
    className: "text-amber-400",
    badgeClassName: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  recovery: {
    icon: CheckCircle,
    label: "Recovery",
    className: "text-emerald-400",
    badgeClassName: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  info: {
    icon: Info,
    label: "Info",
    className: "text-muted-foreground",
    badgeClassName: "bg-secondary text-muted-foreground border-border",
  },
}

export function Timeline({ events, isLoading }: TimelineProps) {
  if (isLoading) {
    return <TimelineSkeleton />
  }

  if (!events || events.length === 0) {
    return (
      <section aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="text-lg font-semibold text-foreground mb-4">
          Timeline
        </h2>
        <Card className="bg-card">
          <CardContent className="py-8 text-center">
            <Info className="h-8 w-8 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
            <p className="text-muted-foreground">No timeline events recorded</p>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="text-lg font-semibold text-foreground mb-4">
        Timeline
      </h2>
      <Card className="bg-card">
        <CardContent className="pt-6">
          <div className="relative space-y-0" role="list" aria-label="Run timeline events">
            {events.map((event, index) => {
              const config = eventTypeConfig[event.type]
              const Icon = config.icon
              const isLast = index === events.length - 1

              return (
                <div
                  key={event.id}
                  className="relative flex gap-4 pb-6"
                  role="listitem"
                >
                  {!isLast && (
                    <div
                      className="absolute left-[15px] top-8 h-full w-px bg-border"
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className={cn(
                      "mt-0.5 shrink-0 rounded-full p-1.5 border",
                      config.className,
                      "bg-background border-current/20"
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">
                        {event.title}
                      </span>
                      <Badge variant="outline" className={cn("text-xs", config.badgeClassName)}>
                        {config.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {format(event.timestamp, "HH:mm:ss")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {Object.entries(event.metadata).map(([key, value]) => (
                          <span
                            key={key}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-secondary text-muted-foreground"
                          >
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function TimelineSkeleton() {
  return (
    <section aria-labelledby="timeline-heading-skeleton">
      <Skeleton className="h-7 w-24 mb-4" />
      <Card className="bg-card">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
