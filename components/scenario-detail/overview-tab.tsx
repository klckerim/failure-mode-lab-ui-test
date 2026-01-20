"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Target, 
  Zap, 
  Gauge, 
  Timer, 
  ShieldCheck, 
  AlertTriangle,
  Calendar,
  User
} from "lucide-react"
import type { ScenarioDetail } from "@/lib/types"
import { failureTypes } from "@/lib/mock-data"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface OverviewTabProps {
  scenario: ScenarioDetail | null
  isLoading?: boolean
}

export function OverviewTab({ scenario, isLoading }: OverviewTabProps) {
  if (isLoading) {
    return <OverviewTabSkeleton />
  }

  if (!scenario) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Target className="h-12 w-12 text-muted-foreground/30 mb-4" aria-hidden="true" />
        <p className="text-muted-foreground">Scenario not found</p>
      </div>
    )
  }

  const failureTypeLabel = failureTypes.find(t => t.value === scenario.type)?.label || scenario.type

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {scenario.description || "No description provided for this scenario."}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" aria-hidden="true" />
              {scenario.owner}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Updated {format(scenario.lastUpdated, "MMM d, yyyy")}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" aria-hidden="true" />
            Target Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Service</span>
            <Badge variant="outline" className="font-mono text-xs">
              {scenario.targetService}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Environment</span>
            <Badge 
              variant="outline" 
              className={cn(
                "capitalize",
                scenario.environment === "production" && "border-red-500/30 text-red-400",
                scenario.environment === "staging" && "border-amber-500/30 text-amber-400",
                scenario.environment === "development" && "border-blue-500/30 text-blue-400"
              )}
            >
              {scenario.environment}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Schedule</span>
            <span className="text-sm text-foreground capitalize">
              {scenario.scheduleType === "cron" 
                ? `Cron: ${scenario.cronExpression}` 
                : "Manual trigger"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" aria-hidden="true" />
            Fault Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Failure Type</span>
            <Badge 
              className={cn(
                "capitalize",
                scenario.type === "latency" && "bg-blue-500/15 text-blue-400 border-blue-500/20",
                scenario.type === "error" && "bg-red-500/15 text-red-400 border-red-500/20",
                scenario.type === "shutdown" && "bg-orange-500/15 text-orange-400 border-orange-500/20",
                scenario.type === "resource" && "bg-purple-500/15 text-purple-400 border-purple-500/20"
              )}
            >
              {failureTypeLabel}
            </Badge>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                Intensity
              </span>
              <span className="text-foreground font-medium">{scenario.intensity}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  scenario.intensity > 70 ? "bg-red-500" : scenario.intensity > 40 ? "bg-amber-500" : "bg-emerald-500"
                )}
                style={{ width: `${scenario.intensity}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5" aria-hidden="true" />
              Duration
            </span>
            <span className="text-sm text-foreground font-medium">{scenario.duration}s</span>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            Safety Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">Max Error Rate</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {scenario.safetyConfig.maxErrorRate}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">Auto-stop</span>
              </div>
              <Badge 
                variant="outline" 
                className={cn(
                  scenario.safetyConfig.autoStopEnabled 
                    ? "border-emerald-500/30 text-emerald-400" 
                    : "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {scenario.safetyConfig.autoStopEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OverviewTabSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-4 mt-4 pt-4 border-t">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
      {[1, 2].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      ))}
      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
