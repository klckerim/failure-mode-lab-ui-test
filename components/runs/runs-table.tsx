"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Eye, Inbox, ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import type { Run } from "@/lib/types"

interface RunsTableProps {
  runs: Run[]
  isLoading?: boolean
  selectedRunId?: string | null
  onSelectRun: (run: Run) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
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

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-36 ml-auto" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">No runs found</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        Try adjusting your filters or start a new chaos engineering run.
      </p>
    </div>
  )
}

function PaginationNumbers({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const pages: (number | "ellipsis")[] = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "ellipsis", totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages)
    }
  }

  return (
    <>
      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        ) : (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(page)
              }}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        )
      )}
    </>
  )
}

export function RunsTable({
  runs,
  isLoading = false,
  selectedRunId,
  onSelectRun,
  currentPage,
  totalPages,
  onPageChange,
}: RunsTableProps) {
  if (isLoading) {
    return <TableSkeleton />
  }

  if (runs.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
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
              <TableRow
                key={run.id}
                onClick={() => onSelectRun(run)}
                className={cn(
                  "cursor-pointer transition-colors",
                  selectedRunId === run.id && "bg-accent"
                )}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onSelectRun(run)
                  }
                }}
                aria-selected={selectedRunId === run.id}
              >
                <TableCell className="font-mono text-sm">{run.id}</TableCell>
                <TableCell className="font-medium">{run.scenario}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(statusConfig[run.status].className)}>
                    {statusConfig[run.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(run.startedAt, "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDuration(run.duration)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectRun(run)
                      }}
                      aria-label={`Quick view for ${run.id}`}
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Quick view</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link href={`/runs/${run.id}`} aria-label={`Open full details for ${run.id}`}>
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Open details</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) onPageChange(currentPage - 1)
                }}
                aria-disabled={currentPage === 1}
                className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
            <PaginationNumbers
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) onPageChange(currentPage + 1)
                }}
                aria-disabled={currentPage === totalPages}
                className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
