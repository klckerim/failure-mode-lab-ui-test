"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Run {
  id: string
  scenario: string
  status: "success" | "failed" | "degraded"
  startedAt: string
  duration: string
}

interface RecentRunsTableProps {
  runs?: Run[]
  isLoading?: boolean
  onViewRun?: (runId: string) => void
}

const statusConfig = {
  success: {
    label: "Success",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
  },
  degraded: {
    label: "Degraded",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20",
  },
}

export function RecentRunsTable({ runs, isLoading = false, onViewRun }: RecentRunsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Runs</CardTitle>
          <CardDescription>Latest test runs and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-28 ml-auto" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!runs || runs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Runs</CardTitle>
          <CardDescription>Latest test runs and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No runs yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Start your first chaos engineering test to see results here.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Runs</CardTitle>
        <CardDescription>Latest test runs and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Run ID</TableHead>
                <TableHead>Scenario</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[180px]">Started At</TableHead>
                <TableHead className="w-[100px]">Duration</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-mono text-sm">{run.id}</TableCell>
                  <TableCell className="font-medium">{run.scenario}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(statusConfig[run.status].className)}
                    >
                      {statusConfig[run.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{run.startedAt}</TableCell>
                  <TableCell className="text-muted-foreground">{run.duration}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewRun?.(run.id)}
                      aria-label={`View details for run ${run.id}`}
                    >
                      <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
