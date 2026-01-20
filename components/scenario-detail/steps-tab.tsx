"use client"

import React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Zap, 
  Clock, 
  TrendingUp, 
  RotateCcw, 
  CheckCircle,
  ListOrdered
} from "lucide-react"
import type { ScenarioDetail, ScenarioStep, StepType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StepsTabProps {
  scenario: ScenarioDetail | null
  isLoading?: boolean
}

const stepIcons: Record<StepType, React.ElementType> = {
  inject_fault: Zap,
  wait: Clock,
  increase_intensity: TrendingUp,
  recover: RotateCcw,
  validate: CheckCircle,
}

const stepColors: Record<StepType, { bg: string; text: string; border: string }> = {
  inject_fault: { 
    bg: "bg-orange-500/10", 
    text: "text-orange-500", 
    border: "border-orange-500/20" 
  },
  wait: { 
    bg: "bg-blue-500/10", 
    text: "text-blue-500", 
    border: "border-blue-500/20" 
  },
  increase_intensity: { 
    bg: "bg-amber-500/10", 
    text: "text-amber-500", 
    border: "border-amber-500/20" 
  },
  recover: { 
    bg: "bg-emerald-500/10", 
    text: "text-emerald-500", 
    border: "border-emerald-500/20" 
  },
  validate: { 
    bg: "bg-cyan-500/10", 
    text: "text-cyan-500", 
    border: "border-cyan-500/20" 
  },
}

const stepLabels: Record<StepType, string> = {
  inject_fault: "Inject Fault",
  wait: "Wait",
  increase_intensity: "Ramp Up",
  recover: "Recover",
  validate: "Validate",
}

function StepCard({ step, index }: { step: ScenarioStep; index: number }) {
  const Icon = stepIcons[step.type]
  const colors = stepColors[step.type]

  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div 
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full border-2",
            colors.bg,
            colors.border
          )}
        >
          <Icon className={cn("h-5 w-5", colors.text)} aria-hidden="true" />
        </div>
        {index < 5 && (
          <div className="w-0.5 h-full bg-border/50 my-2" />
        )}
      </div>

      <Card className="flex-1 bg-card/50 mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Step {index + 1}
                </span>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", colors.text, colors.border)}
                >
                  {stepLabels[step.type]}
                </Badge>
              </div>
              <h4 className="font-medium text-foreground">{step.label}</h4>
            </div>
          </div>

          {Object.keys(step.config).length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {Object.entries(step.config).map(([key, value]) => (
                  <Badge 
                    key={key} 
                    variant="secondary" 
                    className="text-xs font-mono"
                  >
                    {key}: {String(value)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function StepsTab({ scenario, isLoading }: StepsTabProps) {
  if (isLoading) {
    return <StepsTabSkeleton />
  }

  if (!scenario) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ListOrdered className="h-12 w-12 text-muted-foreground/30 mb-4" aria-hidden="true" />
        <p className="text-muted-foreground">Scenario not found</p>
      </div>
    )
  }

  if (scenario.steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ListOrdered className="h-12 w-12 text-muted-foreground/30 mb-4" aria-hidden="true" />
        <h3 className="text-lg font-medium text-foreground mb-1">No steps configured</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          This scenario does not have any steps defined. Edit the scenario to add steps.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Execution Flow
        </h3>
        <Badge variant="secondary" className="text-xs">
          {scenario.steps.length} step{scenario.steps.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="pl-2">
        {scenario.steps.map((step, index) => (
          <StepCard key={step.id} step={step} index={index} />
        ))}
      </div>
    </div>
  )
}

function StepsTabSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="pl-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 mb-4">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <Card className="flex-1">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
