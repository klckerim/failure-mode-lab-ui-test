"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { ScenarioHeader } from "@/components/scenario-detail/scenario-header"
import { OverviewTab } from "@/components/scenario-detail/overview-tab"
import { StepsTab } from "@/components/scenario-detail/steps-tab"
import { VersionsTab } from "@/components/scenario-detail/versions-tab"
import { RunHistoryTab } from "@/components/scenario-detail/run-history-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  getScenarioById, 
  getScenarioVersions, 
  getScenarioRuns 
} from "@/lib/mock-data"
import type { ScenarioDetail, ScenarioVersion, Run } from "@/lib/types"
import { 
  LayoutDashboard, 
  ListOrdered, 
  GitBranch, 
  History 
} from "lucide-react"

interface ScenarioDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ScenarioDetailPage({ params }: ScenarioDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [scenario, setScenario] = useState<ScenarioDetail | null>(null)
  const [versions, setVersions] = useState<ScenarioVersion[]>([])
  const [runs, setRuns] = useState<Run[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const scenarioData = getScenarioById(id)
      setScenario(scenarioData)
      
      if (scenarioData) {
        setVersions(getScenarioVersions(id))
        setRuns(getScenarioRuns(id))
      }
      
      setIsLoading(false)
    }

    loadData()
  }, [id])

  const handleRunNow = () => {
    // In a real app, this would trigger a run
    alert(`Starting run for scenario: ${scenario?.name}`)
  }

  const handleEdit = () => {
    router.push(`/scenarios?edit=${id}`)
  }

  const handlePublish = () => {
    // In a real app, this would open a publish dialog
    alert(`Publishing new version for: ${scenario?.name}`)
  }

  const handleCompare = (versionA: string, versionB: string) => {
    // In a real app, this would open a comparison view
    alert(`Comparing versions: ${versionA} vs ${versionB}`)
  }

  const handleToggleVersion = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(v => v !== versionId)
      }
      if (prev.length >= 2) {
        return [prev[1], versionId]
      }
      return [...prev, versionId]
    })
  }

  if (!isLoading && !scenario) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border/50 flex items-center px-4 lg:px-6">
            <MobileSidebar />
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <LayoutDashboard className="h-16 w-16 text-muted-foreground/30 mb-4" aria-hidden="true" />
              <h1 className="text-2xl font-semibold text-foreground mb-2">Scenario Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The scenario you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <button
                onClick={() => router.push("/scenarios")}
                className="text-primary hover:underline"
              >
                Back to Scenarios
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border/50 flex items-center px-4 lg:px-6">
          <MobileSidebar />
          <h2 className="text-sm font-medium text-muted-foreground ml-2 lg:ml-0">
            Scenario Detail
          </h2>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <ScenarioHeader
              scenario={scenario}
              isLoading={isLoading}
              onRunNow={handleRunNow}
              onEdit={handleEdit}
              onPublish={handlePublish}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start bg-secondary/50 p-1 h-auto flex-wrap">
                <TabsTrigger 
                  value="overview" 
                  className="gap-1.5 data-[state=active]:bg-background"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="steps" 
                  className="gap-1.5 data-[state=active]:bg-background"
                >
                  <ListOrdered className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Steps</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="versions" 
                  className="gap-1.5 data-[state=active]:bg-background"
                >
                  <GitBranch className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Versions</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="gap-1.5 data-[state=active]:bg-background"
                >
                  <History className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Run History</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="overview" className="m-0">
                  <OverviewTab scenario={scenario} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value="steps" className="m-0">
                  <StepsTab scenario={scenario} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value="versions" className="m-0">
                  <VersionsTab 
                    versions={versions} 
                    isLoading={isLoading}
                    onCompare={handleCompare}
                    selectedVersions={selectedVersions}
                    onToggleVersion={handleToggleVersion}
                  />
                </TabsContent>

                <TabsContent value="history" className="m-0">
                  <RunHistoryTab runs={runs} isLoading={isLoading} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
