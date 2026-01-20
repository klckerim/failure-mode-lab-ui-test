"use client"

import { useState, useEffect, useMemo } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ScenariosHeader } from "@/components/scenarios/scenarios-header"
import { ScenariosFilters } from "@/components/scenarios/scenarios-filters"
import { ScenariosTable } from "@/components/scenarios/scenarios-table"
import { ScenarioSheet } from "@/components/scenarios/scenario-sheet"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { mockScenarios } from "@/lib/mock-data"
import type { ScenarioDetail, ScenarioFormData, FailureType, ScenarioStatus } from "@/lib/types"

const ITEMS_PER_PAGE = 10

export default function ScenariosPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [scenarios, setScenarios] = useState<ScenarioDetail[]>([])
  
  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingScenario, setEditingScenario] = useState<ScenarioDetail | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<FailureType | "all">("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState<ScenarioStatus | "all">("all")
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setScenarios(mockScenarios)
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Filtered scenarios
  const filteredScenarios = useMemo(() => {
    return scenarios.filter((scenario) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          scenario.name.toLowerCase().includes(query) ||
          scenario.description.toLowerCase().includes(query) ||
          scenario.targetService.toLowerCase().includes(query) ||
          scenario.owner.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Type filter
      if (typeFilter !== "all" && scenario.type !== typeFilter) {
        return false
      }

      // Service filter
      if (serviceFilter !== "all" && scenario.targetService !== serviceFilter) {
        return false
      }

      // Status filter
      if (statusFilter !== "all" && scenario.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [scenarios, searchQuery, typeFilter, serviceFilter, statusFilter])

  // Paginated scenarios
  const totalPages = Math.ceil(filteredScenarios.length / ITEMS_PER_PAGE)
  const paginatedScenarios = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredScenarios.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredScenarios, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, typeFilter, serviceFilter, statusFilter])

  const handleNewScenario = () => {
    setEditingScenario(null)
    setSheetOpen(true)
  }

  const handleEditScenario = (scenario: ScenarioDetail) => {
    setEditingScenario(scenario)
    setSheetOpen(true)
  }

  const handleDuplicateScenario = (scenario: ScenarioDetail) => {
    const duplicated: ScenarioDetail = {
      ...scenario,
      id: `scenario-${Date.now()}`,
      name: `${scenario.name} (Copy)`,
      lastUpdated: new Date(),
    }
    setScenarios((prev) => [duplicated, ...prev])
  }

  const handleArchiveScenario = (scenario: ScenarioDetail) => {
    setScenarios((prev) =>
      prev.map((s) =>
        s.id === scenario.id
          ? { ...s, status: s.status === "archived" ? "active" : "archived" }
          : s
      )
    )
  }

  const handleSubmit = async (data: ScenarioFormData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (editingScenario) {
      // Update existing scenario
      setScenarios((prev) =>
        prev.map((s) =>
          s.id === editingScenario.id
            ? {
                ...s,
                ...data,
                safetyConfig: {
                  maxErrorRate: data.maxErrorRate,
                  autoStopEnabled: data.autoStopEnabled,
                },
                lastUpdated: new Date(),
              }
            : s
        )
      )
    } else {
      // Create new scenario
      const newScenario: ScenarioDetail = {
        id: `scenario-${Date.now()}`,
        name: data.name,
        description: data.description,
        type: data.type,
        targetService: data.targetService,
        version: "v1.0.0",
        lastUpdated: new Date(),
        owner: "current-user@example.com",
        status: "active",
        environment: data.environment,
        intensity: data.intensity,
        duration: data.duration,
        scheduleType: data.scheduleType,
        cronExpression: data.cronExpression,
        safetyConfig: {
          maxErrorRate: data.maxErrorRate,
          autoStopEnabled: data.autoStopEnabled,
        },
        steps: data.steps,
      }
      setScenarios((prev) => [newScenario, ...prev])
    }

    setIsSubmitting(false)
    setSheetOpen(false)
    setEditingScenario(null)
  }

  const clearFilters = () => {
    setTypeFilter("all")
    setServiceFilter("all")
    setStatusFilter("all")
    setSearchQuery("")
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("ellipsis")
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis")
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:pl-64">
        <ScenariosHeader
          onNewScenario={handleNewScenario}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="p-4 lg:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Scenarios</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage chaos engineering scenarios for your services
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredScenarios.length} scenario{filteredScenarios.length !== 1 ? "s" : ""}
            </div>
          </div>

          <ScenariosFilters
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            serviceFilter={serviceFilter}
            onServiceFilterChange={setServiceFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={clearFilters}
          />

          <ScenariosTable
            scenarios={paginatedScenarios}
            isLoading={isLoading}
            onEdit={handleEditScenario}
            onDuplicate={handleDuplicateScenario}
            onArchive={handleArchiveScenario}
          />

          {!isLoading && totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) =>
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
                          setCurrentPage(page)
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </div>

      <ScenarioSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        scenario={editingScenario}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
