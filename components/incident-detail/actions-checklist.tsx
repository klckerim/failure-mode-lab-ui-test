"use client"

import { useState } from "react"
import { Lightbulb, Check, Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import type { IncidentDetail } from "@/lib/types"

interface ActionsChecklistProps {
  incident: IncidentDetail
}

export function ActionsChecklist({ incident }: ActionsChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedItems(newChecked)
  }

  const completedCount = checkedItems.size
  const totalCount = incident.recommendedActions.length
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Recommended Actions
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{totalCount} completed
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${completedCount} of ${totalCount} actions completed`}
          />
        </div>
      </CardHeader>
      <CardContent>
        {incident.recommendedActions.length === 0 ? (
          <div className="text-center py-8">
            <Check className="h-8 w-8 mx-auto text-emerald-400 mb-2" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No actions required</p>
          </div>
        ) : (
          <ul className="space-y-2" role="list">
            {incident.recommendedActions.map((action, index) => {
              const isChecked = checkedItems.has(index)
              return (
                <li
                  key={index}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                    isChecked
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-secondary/30 border-border/50 hover:bg-secondary/50"
                  )}
                  onClick={() => toggleItem(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      toggleItem(index)
                    }
                  }}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                >
                  <div className="shrink-0 mt-0.5">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleItem(index)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Mark "${action}" as ${isChecked ? "incomplete" : "complete"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <span className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                        isChecked
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {isChecked ? (
                          <Check className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className={cn(
                        "text-sm leading-relaxed",
                        isChecked ? "text-muted-foreground line-through" : "text-foreground"
                      )}>
                        {action}
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function ActionsChecklistSkeleton() {
  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-1.5 w-full mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
              <Skeleton className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
