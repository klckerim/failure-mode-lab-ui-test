"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { RecentRunsTable, type Run } from "@/components/dashboard/recent-runs-table"

// Mocked data
const mockKPIData = {
  runsToday: 247,
  failedRuns: 12,
  avgLatency: 342,
  errorBudgetBurn: 18,
}

const mockRuns: Run[] = [
  {
    id: "run-8f3a",
    scenario: "Database Failover Test",
    status: "success",
    startedAt: "Jan 20, 2026 14:32:15",
    duration: "2m 34s",
  },
  {
    id: "run-7b2c",
    scenario: "Network Partition - Zone A",
    status: "failed",
    startedAt: "Jan 20, 2026 14:28:41",
    duration: "1m 12s",
  },
  {
    id: "run-6d4e",
    scenario: "CPU Stress Test",
    status: "success",
    startedAt: "Jan 20, 2026 14:15:03",
    duration: "5m 01s",
  },
  {
    id: "run-5a1f",
    scenario: "Memory Exhaustion",
    status: "degraded",
    startedAt: "Jan 20, 2026 13:58:22",
    duration: "3m 45s",
  },
  {
    id: "run-4c3g",
    scenario: "Latency Injection - API Gateway",
    status: "success",
    startedAt: "Jan 20, 2026 13:42:08",
    duration: "4m 18s",
  },
  {
    id: "run-3h2i",
    scenario: "Disk I/O Saturation",
    status: "success",
    startedAt: "Jan 20, 2026 13:28:55",
    duration: "2m 56s",
  },
  {
    id: "run-2j1k",
    scenario: "Service Dependency Failure",
    status: "failed",
    startedAt: "Jan 20, 2026 13:15:30",
    duration: "0m 48s",
  },
]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [kpiData, setKpiData] = useState(mockKPIData)
  const [runs, setRuns] = useState<Run[]>(mockRuns)

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleNewRun = () => {
    alert("New Run dialog would open here")
  }

  const handleViewRun = (runId: string) => {
    alert(`Viewing run: ${runId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:pl-64">
        <Header onNewRun={handleNewRun} />
        
        <main className="p-4 lg:p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor your chaos engineering experiments in real-time.
            </p>
          </div>

          <KPICards data={kpiData} isLoading={isLoading} />
          
          <RecentRunsTable 
            runs={runs} 
            isLoading={isLoading}
            onViewRun={handleViewRun}
          />
        </main>
      </div>
    </div>
  )
}
