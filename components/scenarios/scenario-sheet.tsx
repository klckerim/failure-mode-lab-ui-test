"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { ScenarioFormData, ScenarioDetail } from "@/lib/types"
import { ScenarioForm } from "./scenario-form"

interface ScenarioSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  scenario?: ScenarioDetail | null
  onSubmit: (data: ScenarioFormData) => void
  isSubmitting?: boolean
}

export function ScenarioSheet({
  open,
  onOpenChange,
  scenario,
  onSubmit,
  isSubmitting,
}: ScenarioSheetProps) {
  const isEditing = !!scenario

  const initialData: Partial<ScenarioFormData> | undefined = scenario
    ? {
        name: scenario.name,
        description: scenario.description,
        targetService: scenario.targetService,
        environment: scenario.environment,
        type: scenario.type,
        intensity: scenario.intensity,
        duration: scenario.duration,
        scheduleType: scenario.scheduleType,
        cronExpression: scenario.cronExpression,
        maxErrorRate: scenario.safetyConfig.maxErrorRate,
        autoStopEnabled: scenario.safetyConfig.autoStopEnabled,
        steps: scenario.steps,
      }
    : undefined

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl p-0 flex flex-col h-dvh overflow-hidden"
      >
        <SheetHeader className="flex-shrink-0 px-6 py-4 border-b border-border">
          <SheetTitle>
            {isEditing ? "Edit Scenario" : "New Scenario"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the configuration for this chaos scenario."
              : "Create a new chaos engineering scenario to test system resilience."}
          </SheetDescription>
        </SheetHeader>

        <ScenarioForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </SheetContent>
    </Sheet>
  )
}
