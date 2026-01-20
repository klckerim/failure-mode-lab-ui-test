"use client"

import { format } from "date-fns"
import { Edit2, Copy, Archive, MoreHorizontal, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import type { ScenarioDetail, FailureType, ScenarioStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ScenariosTableProps {
  scenarios: ScenarioDetail[]
  isLoading?: boolean
  onEdit: (scenario: ScenarioDetail) => void
  onDuplicate: (scenario: ScenarioDetail) => void
  onArchive: (scenario: ScenarioDetail) => void
}

const typeColors: Record<FailureType, string> = {
  latency: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  shutdown: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  resource: "bg-purple-500/10 text-purple-400 border-purple-500/20",
}

const statusColors: Record<ScenarioStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  archived: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-8 w-8 ml-auto" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" aria-hidden="true" />
        <h3 className="text-lg font-medium text-foreground mb-1">No scenarios found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          No scenarios match your current filters. Try adjusting your filters or create a new scenario.
        </p>
      </CardContent>
    </Card>
  )
}

export function ScenariosTable({
  scenarios,
  isLoading,
  onEdit,
  onDuplicate,
  onArchive,
}: ScenariosTableProps) {
  if (isLoading) {
    return <TableSkeleton />
  }

  if (scenarios.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-medium">Name</TableHead>
            <TableHead className="font-medium">Type</TableHead>
            <TableHead className="font-medium">Target Service</TableHead>
            <TableHead className="font-medium">Version</TableHead>
            <TableHead className="font-medium">Last Updated</TableHead>
            <TableHead className="font-medium">Owner</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="text-right font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scenarios.map((scenario) => (
            <TableRow
              key={scenario.id}
              className={cn(
                "cursor-pointer transition-colors",
                scenario.status === "archived" && "opacity-60"
              )}
              onClick={() => onEdit(scenario)}
            >
              <TableCell className="font-medium">
                <div>
                  <p className="text-foreground">{scenario.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {scenario.description}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={typeColors[scenario.type]}>
                  {scenario.type.charAt(0).toUpperCase() + scenario.type.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  {scenario.targetService}
                </code>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {scenario.version}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {format(scenario.lastUpdated, "MMM d, yyyy")}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {scenario.owner.split("@")[0]}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[scenario.status]}>
                  {scenario.status.charAt(0).toUpperCase() + scenario.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`Actions for ${scenario.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(scenario)
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-2" aria-hidden="true" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onDuplicate(scenario)
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onArchive(scenario)
                      }}
                      className={scenario.status === "archived" ? "text-emerald-500" : "text-amber-500"}
                    >
                      <Archive className="h-4 w-4 mr-2" aria-hidden="true" />
                      {scenario.status === "archived" ? "Restore" : "Archive"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
