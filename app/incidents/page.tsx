"use client"

import { useState, useMemo, useEffect } from "react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { IncidentsHeader } from "@/components/incidents/incidents-header"
import { IncidentsFilters } from "@/components/incidents/incidents-filters"
import { IncidentsList } from "@/components/incidents/incidents-list"
import { IncidentDrawer } from "@/components/incidents/incident-drawer"
import { mockIncidents } from "@/lib/mock-data"
import type { IncidentDetail, IncidentSeverity, IncidentStatus, DateRange } from "@/lib/types"

export default function IncidentsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [incidents, setIncidents] = useState<IncidentDetail[]>([])
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Filters
  const [severity, setSeverity] = useState<IncidentSeverity | "all">("all")
  const [status, setStatus] = useState<IncidentStatus | "all">("all")
  const [service, setService] = useState<string | "all">("all")
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [searchQuery, setSearchQuery] = useState("")

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIncidents(mockIncidents)
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const hasActiveFilters = severity !== "all" || status !== "all" || service !== "all" || dateRange.from !== undefined || searchQuery !== ""

  const clearFilters = () => {
    setSeverity("all")
    setStatus("all")
    setService("all")
    setDateRange({ from: undefined, to: undefined })
    setSearchQuery("")
  }

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      // Severity filter
      if (severity !== "all" && incident.severity !== severity) return false

      // Status filter
      if (status !== "all" && incident.status !== status) return false

      // Service filter
      if (service !== "all" && incident.service !== service) return false

      // Date range filter
      if (dateRange.from) {
        const incidentDate = new Date(incident.detectedAt)
        if (incidentDate < dateRange.from) return false
        if (dateRange.to && incidentDate > dateRange.to) return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          incident.title.toLowerCase().includes(query) ||
          incident.summary.toLowerCase().includes(query) ||
          incident.id.toLowerCase().includes(query) ||
          incident.service.toLowerCase().includes(query) ||
          incident.runId.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [incidents, severity, status, service, dateRange, searchQuery])

  const handleSelectIncident = (incident: IncidentDetail) => {
    setSelectedIncident(incident)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
  }

  const handleAcknowledge = (incident: IncidentDetail) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incident.id
          ? { ...inc, status: "acknowledged" as IncidentStatus, owner: "you@example.com" }
          : inc
      )
    )
    if (selectedIncident?.id === incident.id) {
      setSelectedIncident((prev) =>
        prev ? { ...prev, status: "acknowledged" as IncidentStatus, owner: "you@example.com" } : null
      )
    }
  }

  const handleResolve = (incident: IncidentDetail) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incident.id
          ? { ...inc, status: "resolved" as IncidentStatus, owner: inc.owner || "you@example.com" }
          : inc
      )
    )
    if (selectedIncident?.id === incident.id) {
      setSelectedIncident((prev) =>
        prev ? { ...prev, status: "resolved" as IncidentStatus, owner: prev.owner || "you@example.com" } : null
      )
    }
  }

  // Stats
  const openCount = incidents.filter((i) => i.status === "open").length
  const criticalCount = incidents.filter((i) => i.severity === "critical" && i.status !== "resolved").length

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:hidden">
          <MobileSidebar />
          <h1 className="font-semibold text-foreground">Incidents</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <IncidentsHeader
              totalCount={filteredIncidents.length}
              openCount={openCount}
              criticalCount={criticalCount}
            />

            <IncidentsFilters
              severity={severity}
              onSeverityChange={setSeverity}
              status={status}
              onStatusChange={setStatus}
              service={service}
              onServiceChange={setService}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            <IncidentsList
              incidents={filteredIncidents}
              selectedIncident={selectedIncident}
              onSelectIncident={handleSelectIncident}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>

      <IncidentDrawer
        incident={selectedIncident}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onAcknowledge={handleAcknowledge}
        onResolve={handleResolve}
      />
    </div>
  )
}
