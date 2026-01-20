"use client"

import { format } from "date-fns"
import { CalendarIcon, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { targetServices } from "@/lib/mock-data"
import type { IncidentSeverity, IncidentStatus, DateRange } from "@/lib/types"

interface IncidentsFiltersProps {
  severity: IncidentSeverity | "all"
  onSeverityChange: (value: IncidentSeverity | "all") => void
  status: IncidentStatus | "all"
  onStatusChange: (value: IncidentStatus | "all") => void
  service: string | "all"
  onServiceChange: (value: string | "all") => void
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

const severityOptions: { value: IncidentSeverity | "all"; label: string }[] = [
  { value: "all", label: "All Severities" },
  { value: "critical", label: "S1 - Critical" },
  { value: "high", label: "S2 - High" },
  { value: "medium", label: "S3 - Medium" },
  { value: "low", label: "S4 - Low" },
]

const statusOptions: { value: IncidentStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "open", label: "Open" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "resolved", label: "Resolved" },
]

export function IncidentsFilters({
  severity,
  onSeverityChange,
  status,
  onStatusChange,
  service,
  onServiceChange,
  dateRange,
  onDateRangeChange,
  searchQuery,
  onSearchChange,
  onClearFilters,
  hasActiveFilters,
}: IncidentsFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search incidents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-background"
            aria-label="Search incidents"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={severity} onValueChange={(value) => onSeverityChange(value as IncidentSeverity | "all")}>
            <SelectTrigger className="w-[150px] bg-background" aria-label="Filter by severity">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              {severityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(value) => onStatusChange(value as IncidentStatus | "all")}>
            <SelectTrigger className="w-[160px] bg-background" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={service} onValueChange={(value) => onServiceChange(value)}>
            <SelectTrigger className="w-[170px] bg-background" aria-label="Filter by service">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {targetServices.map((svc) => (
                <SelectItem key={svc} value={svc}>
                  {svc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal bg-transparent",
                  !dateRange.from && "text-muted-foreground"
                )}
                aria-label="Filter by date range"
              >
                <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Time range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => onDateRangeChange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Clear all filters"
            >
              <X className="mr-1 h-4 w-4" aria-hidden="true" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
