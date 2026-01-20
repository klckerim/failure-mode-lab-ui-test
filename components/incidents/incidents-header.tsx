"use client"

import { AlertTriangle } from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface IncidentsHeaderProps {
  totalCount: number
  openCount: number
  criticalCount: number
}

export function IncidentsHeader({ totalCount, openCount, criticalCount }: IncidentsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Incidents</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Triage and resolve detected issues from chaos experiments
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-secondary/50">
          {totalCount} Total
        </Badge>
        {openCount > 0 && (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
            {openCount} Open
          </Badge>
        )}
        {criticalCount > 0 && (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <AlertTriangle className="mr-1 h-3 w-3" aria-hidden="true" />
            {criticalCount} Critical
          </Badge>
        )}
      </div>
    </div>
  )
}
