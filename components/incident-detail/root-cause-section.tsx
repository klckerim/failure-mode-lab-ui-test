"use client"

import { Target, Brain, AlertCircle, CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import type { IncidentDetail } from "@/lib/types"

interface RootCauseSectionProps {
  incident: IncidentDetail
  confidence: number
}

function getConfidenceLevel(confidence: number): { label: string; color: string; bgColor: string } {
  if (confidence >= 85) return { label: "High", color: "text-emerald-400", bgColor: "bg-emerald-500" }
  if (confidence >= 70) return { label: "Medium", color: "text-amber-400", bgColor: "bg-amber-500" }
  return { label: "Low", color: "text-orange-400", bgColor: "bg-orange-500" }
}

export function RootCauseSection({ incident, confidence }: RootCauseSectionProps) {
  const confidenceLevel = getConfidenceLevel(confidence)

  // Mock contributing factors based on incident
  const contributingFactors = [
    {
      factor: "Recent deployment",
      correlation: 78,
      verified: true,
    },
    {
      factor: "Traffic spike",
      correlation: 65,
      verified: true,
    },
    {
      factor: "Database load",
      correlation: 52,
      verified: false,
    },
  ]

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Suspected Root Cause
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
          <div className="shrink-0 mt-0.5">
            <Brain className="h-5 w-5 text-violet-400" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <p className="text-sm text-foreground leading-relaxed">
              {incident.suspectedRootCause}
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Confidence:</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={confidence} 
                    className={cn("w-20 h-2", confidenceLevel.bgColor)} 
                    aria-label={`Confidence: ${confidence}%`}
                  />
                  <span className={cn("text-sm font-medium", confidenceLevel.color)}>
                    {confidence}%
                  </span>
                </div>
              </div>
              <Badge variant="outline" className={cn("text-xs", confidenceLevel.color)}>
                {confidenceLevel.label} Confidence
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Contributing Factors</h4>
          <div className="space-y-2">
            {contributingFactors.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  {item.verified ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  )}
                  <span className="text-sm text-foreground">{item.factor}</span>
                  {item.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={item.correlation} 
                    className="w-16 h-1.5" 
                    aria-label={`Correlation: ${item.correlation}%`}
                  />
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {item.correlation}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Brain className="h-3 w-3" aria-hidden="true" />
          Analysis powered by ML correlation engine
        </p>
      </CardContent>
    </Card>
  )
}

export function RootCauseSectionSkeleton() {
  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-36" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
