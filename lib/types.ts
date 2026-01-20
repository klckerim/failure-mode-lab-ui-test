export type RunStatus = "success" | "failed" | "degraded"

export interface Run {
  id: string
  scenario: string
  scenarioId: string
  status: RunStatus
  startedAt: Date
  duration: number // in milliseconds
  metrics: {
    latencyP50: number
    latencyP99: number
    errorRate: number
    requestCount: number
  }
  errors: Array<{
    code: string
    message: string
    count: number
  }>
  timeline: Array<{
    timestamp: Date
    event: string
    type: "info" | "warning" | "error" | "success"
  }>
}

export interface Scenario {
  id: string
  name: string
  description: string
}

// Extended Scenario Types for Scenarios Page
export type FailureType = "latency" | "error" | "shutdown" | "resource"
export type ScenarioStatus = "active" | "archived"
export type ScheduleType = "manual" | "cron"
export type StepType = "inject_fault" | "wait" | "increase_intensity" | "recover" | "validate"

export interface ScenarioStep {
  id: string
  type: StepType
  label: string
  config: Record<string, string | number | boolean>
}

export interface ScenarioDetail {
  id: string
  name: string
  description: string
  type: FailureType
  targetService: string
  version: string
  lastUpdated: Date
  owner: string
  status: ScenarioStatus
  environment: string
  intensity: number
  duration: number
  scheduleType: ScheduleType
  cronExpression?: string
  safetyConfig: {
    maxErrorRate: number
    autoStopEnabled: boolean
  }
  steps: ScenarioStep[]
}

export interface ScenarioFormData {
  name: string
  description: string
  targetService: string
  environment: string
  type: FailureType
  intensity: number
  duration: number
  scheduleType: ScheduleType
  cronExpression: string
  maxErrorRate: number
  autoStopEnabled: boolean
  steps: ScenarioStep[]
}

export interface ScenarioVersion {
  id: string
  version: string
  publishedAt: Date
  publishedBy: string
  changelog: string
  isCurrent: boolean
}

// Extended Incident Types for Incidents Page
export type IncidentStatus = "open" | "acknowledged" | "resolved"

export interface IncidentSignal {
  id: string
  timestamp: Date
  type: "metric_anomaly" | "threshold_breach" | "correlation" | "alert_fired"
  title: string
  value?: string
}

export interface IncidentDetail {
  id: string
  title: string
  summary: string
  severity: IncidentSeverity
  status: IncidentStatus
  service: string
  detectedAt: Date
  runId: string
  owner: string | null
  suspectedRootCause: string
  impactedEndpoints: string[]
  recommendedActions: string[]
  signals: IncidentSignal[]
  metrics: {
    latencyP95: number
    errorRate: number
  }
}

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export type IncidentSeverity = "critical" | "high" | "medium" | "low"

export interface Incident {
  id: string
  title: string
  severity: IncidentSeverity
  description: string
  recommendedAction: string
  detectedAt: Date
}

export type TimelineEventType = "fault_injected" | "retry_triggered" | "circuit_breaker_open" | "fallback_served" | "recovery" | "info"

export interface DetailedTimelineEvent {
  id: string
  timestamp: Date
  type: TimelineEventType
  title: string
  description: string
  metadata?: Record<string, string | number>
}

export interface RunDetail extends Run {
  environment: string
  metrics: Run["metrics"] & {
    latencyP95: number
    throughput: number
    cpuUsage: number
    memoryUsage: number
  }
  detailedTimeline: DetailedTimelineEvent[]
  incidents: Incident[]
}
