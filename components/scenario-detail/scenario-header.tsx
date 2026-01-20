"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, Pencil, Upload, ArrowLeft, Archive } from "lucide-react"
import Link from "next/link"
import type { ScenarioDetail } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ScenarioHeaderProps {
  scenario: ScenarioDetail | null
  isLoading?: boolean
  onRunNow?: () => void
  onEdit?: () => void
  onPublish?: () => void
}

export function ScenarioHeader({
  scenario,
  isLoading,
  onRunNow,
  onEdit,
  onPublish,
}: ScenarioHeaderProps) {
  if (isLoading) {
    return <ScenarioHeaderSkeleton />
  }

  if (!scenario) {
    return null
  }

  const isArchived = scenario.status === "archived"

  return (
    <div className="space-y-4">
      <Link
        href="/scenarios"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Scenarios
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {scenario.name}
            </h1>
            <Badge
              variant={isArchived ? "secondary" : "default"}
              className={cn(
                isArchived
                  ? "bg-muted text-muted-foreground"
                  : "bg-emerald-500/15 text-emerald-500 border-emerald-500/20"
              )}
            >
              {isArchived ? (
                <>
                  <Archive className="h-3 w-3 mr-1" aria-hidden="true" />
                  Archived
                </>
              ) : (
                "Active"
              )}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded">
              {scenario.version}
            </span>
            <span className="hidden sm:inline text-muted-foreground/50">|</span>
            <span>Target: {scenario.targetService}</span>
            <span className="hidden sm:inline text-muted-foreground/50">|</span>
            <span className="capitalize">{scenario.environment}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            disabled={isArchived}
            className="bg-transparent"
          >
            <Pencil className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onPublish}
            disabled={isArchived}
            className="bg-transparent"
          >
            <Upload className="h-4 w-4 mr-1.5" aria-hidden="true" />
            <span className="hidden sm:inline">Publish New Version</span>
            <span className="sm:hidden">Publish</span>
          </Button>
          <Button
            size="sm"
            onClick={onRunNow}
            disabled={isArchived}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Play className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Run Now
          </Button>
        </div>
      </div>
    </div>
  )
}

function ScenarioHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-32" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  )
}
