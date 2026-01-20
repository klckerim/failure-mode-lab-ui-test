"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { RunHeader } from "@/components/run-detail/run-header"
import { MetricsCards } from "@/components/run-detail/metrics-cards"
import { Timeline } from "@/components/run-detail/timeline"
import { IncidentsList } from "@/components/run-detail/incidents-list"
import { getRunDetail } from "@/lib/mock-data"
import type { RunDetail } from "@/lib/types"

interface RunDetailPageProps {
  params: Promise<{ id: string }>
}

export default function RunDetailPage({ params }: RunDetailPageProps) {
  const { id } = use(params)
  const [run, setRun] = useState<RunDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      const runData = getRunDetail(id)
      setRun(runData)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [id])

  const handleStopRun = () => {
    // Mock stop run action
    alert(`Stopping run ${id}`)
  }

  const handleExportJson = () => {
    if (!run) return
    const dataStr = JSON.stringify(run, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    const exportName = `${run.id}-export.json`
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportName)
    linkElement.click()
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-4 md:px-6">
            <MobileSidebar />

            <nav aria-label="Breadcrumb" className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link href="/runs">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Back to Runs</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
            </nav>

            <div className="flex-1" />

            {run && (
              <p className="text-sm text-muted-foreground hidden md:block">
                Run started {new Date(run.startedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {!isLoading && !run ? (
            <NotFoundState runId={id} />
          ) : (
            <>
              <RunHeader
                run={run}
                isLoading={isLoading}
                onStopRun={handleStopRun}
                onExportJson={handleExportJson}
              />

              <MetricsCards run={run} isLoading={isLoading} />

              <div className="grid gap-6 xl:grid-cols-2">
                <Timeline
                  events={run?.detailedTimeline ?? null}
                  isLoading={isLoading}
                />
                <IncidentsList
                  incidents={run?.incidents ?? null}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function NotFoundState({ runId }: { runId: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <ArrowLeft className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h1 className="text-xl font-semibold text-foreground mb-2">Run not found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The run <span className="font-mono text-foreground">{runId}</span> could not be found.
        It may have been deleted or the ID is incorrect.
      </p>
      <Button asChild>
        <Link href="/runs">View all runs</Link>
      </Button>
    </div>
  )
}
