"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { GitBranch, User, Calendar, ArrowLeftRight, History } from "lucide-react"
import type { ScenarioVersion } from "@/lib/types"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface VersionsTabProps {
  versions: ScenarioVersion[]
  isLoading?: boolean
  onCompare?: (versionA: string, versionB: string) => void
  selectedVersions?: string[]
  onToggleVersion?: (versionId: string) => void
}

export function VersionsTab({ 
  versions, 
  isLoading,
  onCompare,
  selectedVersions = [],
  onToggleVersion
}: VersionsTabProps) {
  if (isLoading) {
    return <VersionsTabSkeleton />
  }

  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <History className="h-12 w-12 text-muted-foreground/30 mb-4" aria-hidden="true" />
        <h3 className="text-lg font-medium text-foreground mb-1">No version history</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          This scenario has not been published yet. Publish your first version to start tracking changes.
        </p>
      </div>
    )
  }

  const canCompare = selectedVersions.length === 2

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Version History
        </h3>
        <div className="flex items-center gap-2">
          {selectedVersions.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {selectedVersions.length}/2 selected
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={!canCompare}
            onClick={() => onCompare?.(selectedVersions[0], selectedVersions[1])}
            className="bg-transparent"
          >
            <ArrowLeftRight className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Compare
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {versions.map((version) => {
          const isSelected = selectedVersions.includes(version.id)
          
          return (
            <Card 
              key={version.id} 
              className={cn(
                "bg-card/50 transition-colors cursor-pointer",
                isSelected && "ring-2 ring-primary/50 bg-primary/5"
              )}
              onClick={() => onToggleVersion?.(version.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onToggleVersion?.(version.id)
                }
              }}
              aria-pressed={isSelected}
              aria-label={`Version ${version.version}${version.isCurrent ? " (current)" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div 
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0",
                      version.isCurrent 
                        ? "bg-emerald-500/15 text-emerald-500" 
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <GitBranch className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono font-medium text-foreground">
                        {version.version}
                      </span>
                      {version.isCurrent && (
                        <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/20 text-xs">
                          Current
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {version.changelog}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" aria-hidden="true" />
                        {version.publishedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        {format(version.publishedAt, "MMM d, yyyy 'at' HH:mm")}
                      </span>
                    </div>
                  </div>

                  <div 
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                      isSelected 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground/30"
                    )}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-background" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function VersionsTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    {i === 1 && <Skeleton className="h-5 w-16" />}
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
