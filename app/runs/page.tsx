"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

import { DateRangePicker } from "@/components/runs/date-range-picker"
import { ScenarioMultiSelect } from "@/components/runs/scenario-multi-select"
import { RunsTable } from "@/components/runs/runs-table"
import { RunDetailDrawer } from "@/components/runs/run-detail-drawer"
import { mockRuns, scenarios } from "@/lib/mock-data"
import type { Run, RunStatus } from "@/lib/types"

const ITEMS_PER_PAGE = 10

export default function RunsPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [statusFilter, setStatusFilter] = React.useState<RunStatus | "all">("all")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
  const [selectedScenarios, setSelectedScenarios] = React.useState<string[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedRun, setSelectedRun] = React.useState<Run | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter runs
  const filteredRuns = React.useMemo(() => {
    return mockRuns.filter((run) => {
      // Status filter
      if (statusFilter !== "all" && run.status !== statusFilter) {
        return false
      }

      // Date range filter
      if (dateRange?.from) {
        const runDate = new Date(run.startedAt)
        if (runDate < dateRange.from) return false
        if (dateRange.to && runDate > dateRange.to) return false
      }

      // Scenario filter
      if (selectedScenarios.length > 0 && !selectedScenarios.includes(run.scenarioId)) {
        return false
      }

      return true
    })
  }, [statusFilter, dateRange, selectedScenarios])

  // Pagination
  const totalPages = Math.ceil(filteredRuns.length / ITEMS_PER_PAGE)
  const paginatedRuns = filteredRuns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, dateRange, selectedScenarios])

  const handleSelectRun = (run: Run) => {
    setSelectedRun(run)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  const clearFilters = () => {
    setStatusFilter("all")
    setDateRange(undefined)
    setSelectedScenarios([])
  }

  const hasActiveFilters = statusFilter !== "all" || dateRange !== undefined || selectedScenarios.length > 0

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Runs</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and analyze all chaos engineering test runs
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as RunStatus | "all")}
              >
                <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="degraded">Degraded</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Picker */}
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />

              {/* Scenario Multi-Select */}
              <ScenarioMultiSelect
                scenarios={scenarios}
                selectedIds={selectedScenarios}
                onSelectedChange={setSelectedScenarios}
              />

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9 px-3"
                  aria-label="Clear all filters"
                >
                  <X className="h-4 w-4 mr-1" aria-hidden="true" />
                  Clear
                </Button>
              )}
            </div>

            {/* Results count */}
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                "Loading runs..."
              ) : (
                <>
                  Showing {paginatedRuns.length} of {filteredRuns.length} runs
                  {hasActiveFilters && " (filtered)"}
                </>
              )}
            </p>
          </div>

          {/* Runs Table */}
          <RunsTable
            runs={paginatedRuns}
            isLoading={isLoading}
            selectedRunId={selectedRun?.id}
            onSelectRun={handleSelectRun}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {/* Run Detail Drawer */}
          <RunDetailDrawer
            run={selectedRun}
            open={isDrawerOpen}
            onClose={handleCloseDrawer}
          />
        </main>
      </div>
    </div>
  )
}
