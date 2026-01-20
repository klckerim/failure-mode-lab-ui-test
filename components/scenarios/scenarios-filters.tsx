"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
import type { FailureType, ScenarioStatus } from "@/lib/types"
import { failureTypes, targetServices } from "@/lib/mock-data"

interface ScenariosFiltersProps {
  typeFilter: FailureType | "all"
  onTypeFilterChange: (value: FailureType | "all") => void
  serviceFilter: string
  onServiceFilterChange: (value: string) => void
  statusFilter: ScenarioStatus | "all"
  onStatusFilterChange: (value: ScenarioStatus | "all") => void
  onClearFilters: () => void
}

export function ScenariosFilters({
  typeFilter,
  onTypeFilterChange,
  serviceFilter,
  onServiceFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
}: ScenariosFiltersProps) {
  const hasActiveFilters =
    typeFilter !== "all" || serviceFilter !== "all" || statusFilter !== "all"

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <label htmlFor="type-filter" className="text-sm text-muted-foreground sr-only">
          Type
        </label>
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger id="type-filter" className="w-[140px]" aria-label="Filter by type">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {failureTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="service-filter" className="text-sm text-muted-foreground sr-only">
          Service
        </label>
        <Select value={serviceFilter} onValueChange={onServiceFilterChange}>
          <SelectTrigger id="service-filter" className="w-[180px]" aria-label="Filter by service">
            <SelectValue placeholder="Target Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {targetServices.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="status-filter" className="text-sm text-muted-foreground sr-only">
          Status
        </label>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger id="status-filter" className="w-[130px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4 mr-1" aria-hidden="true" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
