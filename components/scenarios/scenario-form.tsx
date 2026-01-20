"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Loader2 } from "lucide-react"
import type { ScenarioFormData, FailureType, ScheduleType, ScenarioStep } from "@/lib/types"
import { targetServices, failureTypes } from "@/lib/mock-data"
import { StepsEditor } from "./steps-editor"
import { cn } from "@/lib/utils"

interface ScenarioFormProps {
  initialData?: Partial<ScenarioFormData>
  onSubmit: (data: ScenarioFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

interface FormErrors {
  name?: string
  description?: string
  targetService?: string
  environment?: string
  cronExpression?: string
  steps?: string
}

const environments = ["production", "staging", "development"]

const defaultSteps: ScenarioStep[] = [
  { id: "default-1", type: "inject_fault", label: "Inject fault", config: {} },
  { id: "default-2", type: "wait", label: "Wait", config: { duration: 30 } },
  { id: "default-3", type: "recover", label: "Recover", config: {} },
]

export function ScenarioForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: ScenarioFormProps) {
  const [formData, setFormData] = useState<ScenarioFormData>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    targetService: initialData?.targetService ?? "",
    environment: initialData?.environment ?? "",
    type: initialData?.type ?? "latency",
    intensity: initialData?.intensity ?? 30,
    duration: initialData?.duration ?? 60,
    scheduleType: initialData?.scheduleType ?? "manual",
    cronExpression: initialData?.cronExpression ?? "",
    maxErrorRate: initialData?.maxErrorRate ?? 5,
    autoStopEnabled: initialData?.autoStopEnabled ?? true,
    steps: initialData?.steps ?? defaultSteps,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const validateField = (name: string, value: unknown): string | undefined => {
    switch (name) {
      case "name":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return "Scenario name is required"
        }
        if (typeof value === "string" && value.length > 100) {
          return "Name must be 100 characters or less"
        }
        break
      case "description":
        if (typeof value === "string" && value.length > 500) {
          return "Description must be 500 characters or less"
        }
        break
      case "targetService":
        if (!value) {
          return "Target service is required"
        }
        break
      case "environment":
        if (!value) {
          return "Environment is required"
        }
        break
      case "cronExpression":
        if (formData.scheduleType === "cron" && (!value || (typeof value === "string" && value.trim() === ""))) {
          return "Cron expression is required for scheduled scenarios"
        }
        break
      case "steps":
        if (Array.isArray(value) && value.length === 0) {
          return "At least one step is required"
        }
        break
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    const nameError = validateField("name", formData.name)
    if (nameError) newErrors.name = nameError
    
    const descError = validateField("description", formData.description)
    if (descError) newErrors.description = descError
    
    const serviceError = validateField("targetService", formData.targetService)
    if (serviceError) newErrors.targetService = serviceError
    
    const envError = validateField("environment", formData.environment)
    if (envError) newErrors.environment = envError
    
    const cronError = validateField("cronExpression", formData.cronExpression)
    if (cronError) newErrors.cronExpression = cronError

    const stepsError = validateField("steps", formData.steps)
    if (stepsError) newErrors.steps = stepsError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBlur = (name: string) => {
    setTouched((prev) => new Set(prev).add(name))
    const error = validateField(name, formData[name as keyof ScenarioFormData])
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const updateField = <K extends keyof ScenarioFormData>(
    field: K,
    value: ScenarioFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (touched.has(field)) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Basic Information
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="e.g., API Latency Spike Test"
              className={cn(errors.name && touched.has("name") && "border-destructive")}
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && touched.has("name") && (
              <p id="name-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              placeholder="Describe what this scenario tests..."
              rows={3}
              className={cn(errors.description && touched.has("description") && "border-destructive")}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            {errors.description && touched.has("description") && (
              <p id="description-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                {errors.description}
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Target Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Target Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetService">
                Target Service <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.targetService}
                onValueChange={(value) => updateField("targetService", value)}
              >
                <SelectTrigger 
                  id="targetService"
                  className={cn(errors.targetService && touched.has("targetService") && "border-destructive")}
                  aria-describedby={errors.targetService ? "targetService-error" : undefined}
                >
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {targetServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.targetService && touched.has("targetService") && (
                <p id="targetService-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {errors.targetService}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="environment">
                Environment <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.environment}
                onValueChange={(value) => updateField("environment", value)}
              >
                <SelectTrigger 
                  id="environment"
                  className={cn(errors.environment && touched.has("environment") && "border-destructive")}
                  aria-describedby={errors.environment ? "environment-error" : undefined}
                >
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  {environments.map((env) => (
                    <SelectItem key={env} value={env}>
                      {env.charAt(0).toUpperCase() + env.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.environment && touched.has("environment") && (
                <p id="environment-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {errors.environment}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Failure Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: FailureType) => updateField("type", value)}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {failureTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Intensity & Duration */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Intensity & Duration
          </h3>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="intensity">Intensity</Label>
                <span className="text-sm font-medium text-foreground">
                  {formData.intensity}%
                </span>
              </div>
              <Slider
                id="intensity"
                value={[formData.intensity]}
                onValueChange={([value]) => updateField("intensity", value)}
                min={10}
                max={100}
                step={5}
                className="w-full"
                aria-label="Fault injection intensity"
              />
              <p className="text-xs text-muted-foreground">
                Percentage of requests affected by the fault injection
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="duration">Duration</Label>
                <span className="text-sm font-medium text-foreground">
                  {formData.duration}s
                </span>
              </div>
              <Slider
                id="duration"
                value={[formData.duration]}
                onValueChange={([value]) => updateField("duration", value)}
                min={15}
                max={300}
                step={15}
                className="w-full"
                aria-label="Scenario duration in seconds"
              />
              <p className="text-xs text-muted-foreground">
                Total duration of the chaos experiment
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Schedule */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Schedule
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleType">Trigger Type</Label>
              <Select
                value={formData.scheduleType}
                onValueChange={(value: ScheduleType) => updateField("scheduleType", value)}
              >
                <SelectTrigger id="scheduleType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="cron">Scheduled (Cron)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.scheduleType === "cron" && (
              <div className="space-y-2">
                <Label htmlFor="cronExpression">
                  Cron Expression <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cronExpression"
                  value={formData.cronExpression}
                  onChange={(e) => updateField("cronExpression", e.target.value)}
                  onBlur={() => handleBlur("cronExpression")}
                  placeholder="e.g., 0 2 * * 1 (Monday 2am)"
                  className={cn(errors.cronExpression && touched.has("cronExpression") && "border-destructive")}
                  aria-describedby={errors.cronExpression ? "cronExpression-error" : undefined}
                />
                {errors.cronExpression && touched.has("cronExpression") && (
                  <p id="cronExpression-error" className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    {errors.cronExpression}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Safety Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Safety Controls
          </h3>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="maxErrorRate">Max Error Rate</Label>
                <span className="text-sm font-medium text-foreground">
                  {formData.maxErrorRate}%
                </span>
              </div>
              <Slider
                id="maxErrorRate"
                value={[formData.maxErrorRate]}
                onValueChange={([value]) => updateField("maxErrorRate", value)}
                min={1}
                max={25}
                step={1}
                className="w-full"
                aria-label="Maximum error rate threshold"
              />
              <p className="text-xs text-muted-foreground">
                Scenario will pause if error rate exceeds this threshold
              </p>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="autoStop" className="text-sm font-medium">
                  Auto-stop on threshold
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically stop the run if safety thresholds are breached
                </p>
              </div>
              <Switch
                id="autoStop"
                checked={formData.autoStopEnabled}
                onCheckedChange={(checked) => updateField("autoStopEnabled", checked)}
                aria-label="Enable auto-stop"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Steps Editor */}
        <div className="space-y-4">
          <StepsEditor
            steps={formData.steps}
            onChange={(steps) => updateField("steps", steps)}
            disabled={isSubmitting}
          />
          {errors.steps && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.steps}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-border px-6 py-4">
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                Saving...
              </>
            ) : (
              "Save Scenario"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
