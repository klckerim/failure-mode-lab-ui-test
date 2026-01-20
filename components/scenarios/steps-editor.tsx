"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, ChevronUp, ChevronDown, Zap, Clock, TrendingUp, RotateCcw, CheckCircle } from "lucide-react"
import type { ScenarioStep, StepType } from "@/lib/types"
import { stepTypes } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface StepsEditorProps {
  steps: ScenarioStep[]
  onChange: (steps: ScenarioStep[]) => void
  disabled?: boolean
}

const stepIcons: Record<StepType, React.ElementType> = {
  inject_fault: Zap,
  wait: Clock,
  increase_intensity: TrendingUp,
  recover: RotateCcw,
  validate: CheckCircle,
}

const stepColors: Record<StepType, string> = {
  inject_fault: "text-orange-500",
  wait: "text-blue-500",
  increase_intensity: "text-amber-500",
  recover: "text-emerald-500",
  validate: "text-cyan-500",
}

function getDefaultLabel(type: StepType): string {
  const labels: Record<StepType, string> = {
    inject_fault: "Inject fault",
    wait: "Wait",
    increase_intensity: "Increase intensity",
    recover: "Recover",
    validate: "Validate",
  }
  return labels[type]
}

export function StepsEditor({ steps, onChange, disabled }: StepsEditorProps) {
  const addStep = () => {
    const newStep: ScenarioStep = {
      id: `step-${Date.now()}`,
      type: "inject_fault",
      label: "Inject fault",
      config: {},
    }
    onChange([...steps, newStep])
  }

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index)
    onChange(newSteps)
  }

  const moveStep = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= steps.length) return

    const newSteps = [...steps]
    const [removed] = newSteps.splice(index, 1)
    newSteps.splice(newIndex, 0, removed)
    onChange(newSteps)
  }

  const updateStepType = (index: number, type: StepType) => {
    const newSteps = [...steps]
    newSteps[index] = {
      ...newSteps[index],
      type,
      label: getDefaultLabel(type),
    }
    onChange(newSteps)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Scenario Steps
        </label>
        <span className="text-xs text-muted-foreground">
          {steps.length} step{steps.length !== 1 ? "s" : ""}
        </span>
      </div>

      {steps.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Zap className="h-8 w-8 text-muted-foreground/50 mb-2" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No steps configured</p>
            <p className="text-xs text-muted-foreground/70 mb-3">
              Add steps to define your chaos experiment
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStep}
              disabled={disabled}
            >
              <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
              Add first step
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {steps.map((step, index) => {
            const Icon = stepIcons[step.type]
            return (
              <Card key={step.id} className="bg-secondary/50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveStep(index, "up")}
                        disabled={disabled || index === 0}
                        aria-label={`Move step ${index + 1} up`}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveStep(index, "down")}
                        disabled={disabled || index === steps.length - 1}
                        aria-label={`Move step ${index + 1} down`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background">
                      <span className="text-xs font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                    </div>

                    <div className={cn("flex-shrink-0", stepColors[step.type])}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Select
                        value={step.type}
                        onValueChange={(value: StepType) => updateStepType(index, value)}
                        disabled={disabled}
                      >
                        <SelectTrigger className="h-9 bg-background" aria-label={`Step ${index + 1} type`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {stepTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeStep(index)}
                      disabled={disabled}
                      aria-label={`Remove step ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {steps.length > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addStep}
          disabled={disabled}
          className="w-full bg-transparent"
        >
          <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
          Add step
        </Button>
      )}
    </div>
  )
}
