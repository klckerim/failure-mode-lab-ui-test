"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { 
  IncidentHeader, 
  IncidentHeaderSkeleton 
} from "@/components/incident-detail/incident-header"
import { 
  SummaryCard, 
  SummaryCardSkeleton 
} from "@/components/incident-detail/summary-card"
import { 
  SignalsCards, 
  SignalsCardsSkeleton 
} from "@/components/incident-detail/signals-cards"
import { 
  RootCauseSection, 
  RootCauseSectionSkeleton 
} from "@/components/incident-detail/root-cause-section"
import { 
  ActionsChecklist, 
  ActionsChecklistSkeleton 
} from "@/components/incident-detail/actions-checklist"
import { 
  RelatedRuns, 
  RelatedRunsSkeleton 
} from "@/components/incident-detail/related-runs"
import { 
  getIncidentById, 
  getRelatedRunsForIncident, 
  getIncidentConfidence 
} from "@/lib/mock-data"
import type { IncidentDetail, Run } from "@/lib/types"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function IncidentDetailPage({ params }: PageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [incident, setIncident] = useState<IncidentDetail | null>(null)
  const [relatedRuns, setRelatedRuns] = useState<Run[]>([])
  const [confidence, setConfidence] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundIncident = getIncidentById(resolvedParams.id)
      if (foundIncident) {
        setIncident(foundIncident)
        setRelatedRuns(getRelatedRunsForIncident(resolvedParams.id))
        setConfidence(getIncidentConfidence(foundIncident.severity))
      } else {
        setNotFound(true)
      }
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [resolvedParams.id])

  const handleAcknowledge = () => {
    if (incident) {
      setIncident({
        ...incident,
        status: "acknowledged",
        owner: "current-user@example.com",
      })
    }
  }

  const handleResolve = () => {
    if (incident) {
      setIncident({
        ...incident,
        status: "resolved",
        owner: incident.owner || "current-user@example.com",
      })
    }
  }

  const handleExport = () => {
    if (incident) {
      const dataStr = JSON.stringify(incident, null, 2)
      const blob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `incident-${incident.id}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:pl-64">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-foreground">Incident Not Found</h1>
              <p className="text-muted-foreground">
                The incident you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Button onClick={() => router.push("/incidents")} className="mt-4">
                Back to Incidents
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar />

      <div className="flex-1 flex flex-col lg:pl-64">
        {isLoading ? (
          <>
            <IncidentHeaderSkeleton />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <SignalsCardsSkeleton />
                    <RootCauseSectionSkeleton />
                  </div>
                  <div className="space-y-6">
                    <SummaryCardSkeleton />
                    <ActionsChecklistSkeleton />
                  </div>
                </div>
                <RelatedRunsSkeleton />
              </div>
            </main>
          </>
        ) : incident ? (
          <>
            <IncidentHeader
              incident={incident}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
              onExport={handleExport}
            />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left column - wider */}
                  <div className="lg:col-span-2 space-y-6">
                    <SignalsCards incident={incident} />
                    <RootCauseSection incident={incident} confidence={confidence} />
                  </div>

                  {/* Right column - sidebar */}
                  <div className="space-y-6">
                    <SummaryCard incident={incident} />
                    <ActionsChecklist incident={incident} />
                  </div>
                </div>

                {/* Related runs - full width */}
                <RelatedRuns runs={relatedRuns} currentRunId={incident.runId} />
              </div>
            </main>
          </>
        ) : null}
      </div>
    </div>
  )
}
