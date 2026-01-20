import type { 
  Run, 
  Scenario, 
  RunDetail, 
  DetailedTimelineEvent, 
  Incident,
  ScenarioDetail,
  FailureType,
  ScenarioStatus,
  ScenarioStep,
  ScenarioVersion,
  IncidentDetail,
  IncidentStatus,
  IncidentSeverity,
  IncidentSignal
} from "./types"

export const scenarios: Scenario[] = [
  { id: "sc-001", name: "API Latency Spike", description: "Simulate increased API response times" },
  { id: "sc-002", name: "Database Failover", description: "Test database failover behavior" },
  { id: "sc-003", name: "Memory Pressure", description: "Simulate high memory usage conditions" },
  { id: "sc-004", name: "Network Partition", description: "Test behavior during network issues" },
  { id: "sc-005", name: "CPU Saturation", description: "Simulate CPU-bound workloads" },
  { id: "sc-006", name: "Disk I/O Stress", description: "Test disk performance limits" },
]

const errorMessages = [
  { code: "ERR_TIMEOUT", message: "Request timeout exceeded 5000ms", count: 12 },
  { code: "ERR_CONNECTION", message: "Connection refused by upstream", count: 8 },
  { code: "ERR_MEMORY", message: "Out of memory exception", count: 3 },
  { code: "ERR_RATE_LIMIT", message: "Rate limit exceeded", count: 24 },
  { code: "ERR_CIRCUIT_OPEN", message: "Circuit breaker open", count: 5 },
]

function generateTimeline(startedAt: Date, status: Run["status"]): Run["timeline"] {
  const events: Run["timeline"] = [
    { timestamp: new Date(startedAt), event: "Run initialized", type: "info" },
    { timestamp: new Date(startedAt.getTime() + 1000), event: "Chaos injection started", type: "info" },
    { timestamp: new Date(startedAt.getTime() + 5000), event: "Baseline metrics captured", type: "info" },
  ]

  if (status === "failed") {
    events.push(
      { timestamp: new Date(startedAt.getTime() + 15000), event: "Error threshold exceeded", type: "warning" },
      { timestamp: new Date(startedAt.getTime() + 25000), event: "System recovery failed", type: "error" },
      { timestamp: new Date(startedAt.getTime() + 30000), event: "Run terminated with failures", type: "error" }
    )
  } else if (status === "degraded") {
    events.push(
      { timestamp: new Date(startedAt.getTime() + 12000), event: "Latency increase detected", type: "warning" },
      { timestamp: new Date(startedAt.getTime() + 22000), event: "Partial recovery observed", type: "warning" },
      { timestamp: new Date(startedAt.getTime() + 35000), event: "Run completed with degradation", type: "warning" }
    )
  } else {
    events.push(
      { timestamp: new Date(startedAt.getTime() + 10000), event: "System responded within SLA", type: "success" },
      { timestamp: new Date(startedAt.getTime() + 20000), event: "Recovery verified", type: "success" },
      { timestamp: new Date(startedAt.getTime() + 25000), event: "Run completed successfully", type: "success" }
    )
  }

  return events
}

function generateRun(index: number): Run {
  const statuses: Run["status"][] = ["success", "failed", "degraded"]
  const status = statuses[index % 3 === 0 ? 1 : index % 5 === 0 ? 2 : 0]
  const scenario = scenarios[index % scenarios.length]
  const startedAt = new Date(Date.now() - (index * 3600000) - Math.random() * 1800000)
  const duration = 20000 + Math.random() * 40000

  return {
    id: `run-${String(index + 1).padStart(4, "0")}`,
    scenario: scenario.name,
    scenarioId: scenario.id,
    status,
    startedAt,
    duration,
    metrics: {
      latencyP50: 45 + Math.random() * 100,
      latencyP99: 200 + Math.random() * 300,
      errorRate: status === "failed" ? 5 + Math.random() * 10 : status === "degraded" ? 1 + Math.random() * 3 : Math.random() * 0.5,
      requestCount: Math.floor(5000 + Math.random() * 15000),
    },
    errors: status === "success" ? [] : errorMessages.slice(0, status === "failed" ? 4 : 2).map(e => ({
      ...e,
      count: Math.floor(e.count * (0.5 + Math.random()))
    })),
    timeline: generateTimeline(startedAt, status),
  }
}

export const mockRuns: Run[] = Array.from({ length: 50 }, (_, i) => generateRun(i))

const environments = ["production", "staging", "development"]

function generateDetailedTimeline(startedAt: Date, status: Run["status"]): DetailedTimelineEvent[] {
  const events: DetailedTimelineEvent[] = [
    {
      id: "evt-001",
      timestamp: new Date(startedAt),
      type: "info",
      title: "Run initialized",
      description: "Chaos engineering run started, baseline metrics being captured",
      metadata: { targetService: "api-gateway", region: "us-east-1" },
    },
    {
      id: "evt-002",
      timestamp: new Date(startedAt.getTime() + 2000),
      type: "fault_injected",
      title: "Fault injected",
      description: "Latency injection enabled for 30% of requests",
      metadata: { latencyMs: 500, percentage: 30 },
    },
    {
      id: "evt-003",
      timestamp: new Date(startedAt.getTime() + 8000),
      type: "retry_triggered",
      title: "Retry triggered",
      description: "Automatic retry mechanism activated after timeout threshold exceeded",
      metadata: { retryAttempt: 1, maxRetries: 3 },
    },
  ]

  if (status === "failed") {
    events.push(
      {
        id: "evt-004",
        timestamp: new Date(startedAt.getTime() + 15000),
        type: "circuit_breaker_open",
        title: "Circuit breaker opened",
        description: "Error rate exceeded 50%, circuit breaker tripped to prevent cascade failures",
        metadata: { errorRate: 52.3, threshold: 50 },
      },
      {
        id: "evt-005",
        timestamp: new Date(startedAt.getTime() + 18000),
        type: "fallback_served",
        title: "Fallback served",
        description: "Degraded response served from cache while primary service unavailable",
        metadata: { cacheHitRate: 78 },
      },
      {
        id: "evt-006",
        timestamp: new Date(startedAt.getTime() + 30000),
        type: "info",
        title: "Run terminated",
        description: "Run completed with failures, system did not recover within SLA",
      }
    )
  } else if (status === "degraded") {
    events.push(
      {
        id: "evt-004",
        timestamp: new Date(startedAt.getTime() + 12000),
        type: "circuit_breaker_open",
        title: "Circuit breaker opened",
        description: "Error rate elevated, circuit breaker engaged briefly",
        metadata: { errorRate: 35.2, threshold: 50 },
      },
      {
        id: "evt-005",
        timestamp: new Date(startedAt.getTime() + 20000),
        type: "recovery",
        title: "Partial recovery",
        description: "System partially recovered, operating with reduced throughput",
        metadata: { throughputPercent: 75 },
      },
      {
        id: "evt-006",
        timestamp: new Date(startedAt.getTime() + 35000),
        type: "info",
        title: "Run completed",
        description: "Run completed with degradation, manual review recommended",
      }
    )
  } else {
    events.push(
      {
        id: "evt-004",
        timestamp: new Date(startedAt.getTime() + 12000),
        type: "retry_triggered",
        title: "Retry successful",
        description: "Automatic retry succeeded, request completed within SLA",
        metadata: { retryAttempt: 2, latencyMs: 180 },
      },
      {
        id: "evt-005",
        timestamp: new Date(startedAt.getTime() + 20000),
        type: "recovery",
        title: "Full recovery",
        description: "System fully recovered, all metrics within normal parameters",
        metadata: { recoveryTimeMs: 8000 },
      },
      {
        id: "evt-006",
        timestamp: new Date(startedAt.getTime() + 25000),
        type: "info",
        title: "Run completed",
        description: "Chaos experiment completed successfully, system demonstrated resilience",
      }
    )
  }

  return events
}

function generateIncidents(status: Run["status"], startedAt: Date): Incident[] {
  if (status === "success") return []

  const incidents: Incident[] = []

  if (status === "failed") {
    incidents.push(
      {
        id: "inc-001",
        title: "Cascade failure detected",
        severity: "critical",
        description: "Multiple downstream services experienced timeouts leading to cascading failures across the payment processing pipeline.",
        recommendedAction: "Implement bulkhead pattern to isolate service failures and prevent cascade",
        detectedAt: new Date(startedAt.getTime() + 15000),
      },
      {
        id: "inc-002",
        title: "Memory leak identified",
        severity: "high",
        description: "Memory usage increased by 45% during fault injection without recovery after load normalization.",
        recommendedAction: "Review connection pooling configuration and implement proper resource cleanup",
        detectedAt: new Date(startedAt.getTime() + 20000),
      },
      {
        id: "inc-003",
        title: "Retry storm observed",
        severity: "medium",
        description: "Exponential backoff not properly configured, leading to retry storms under load.",
        recommendedAction: "Configure jitter and increase backoff multiplier in retry policy",
        detectedAt: new Date(startedAt.getTime() + 12000),
      }
    )
  } else {
    incidents.push(
      {
        id: "inc-001",
        title: "Elevated latency during recovery",
        severity: "medium",
        description: "P99 latency remained elevated for 30 seconds after fault injection ended.",
        recommendedAction: "Consider implementing connection warming to reduce cold start latency",
        detectedAt: new Date(startedAt.getTime() + 18000),
      },
      {
        id: "inc-002",
        title: "Partial cache invalidation",
        severity: "low",
        description: "Some cached entries were not properly invalidated during failover.",
        recommendedAction: "Review cache invalidation strategy and implement TTL-based fallback",
        detectedAt: new Date(startedAt.getTime() + 22000),
      }
    )
  }

  return incidents
}

// Scenario-related constants
export const targetServices = [
  "api-gateway",
  "user-service", 
  "payment-service",
  "inventory-service",
  "notification-service",
  "auth-service",
]

export const failureTypes: { value: FailureType; label: string }[] = [
  { value: "latency", label: "Latency" },
  { value: "error", label: "Error" },
  { value: "shutdown", label: "Shutdown" },
  { value: "resource", label: "Resource" },
]

export const stepTypes: { value: ScenarioStep["type"]; label: string }[] = [
  { value: "inject_fault", label: "Inject fault" },
  { value: "wait", label: "Wait" },
  { value: "increase_intensity", label: "Increase intensity" },
  { value: "recover", label: "Recover" },
  { value: "validate", label: "Validate" },
]

const owners = ["alice@example.com", "bob@example.com", "charlie@example.com", "diana@example.com"]
const envs = ["production", "staging", "development"]

function generateSteps(type: FailureType): ScenarioStep[] {
  const baseSteps: ScenarioStep[] = [
    {
      id: "step-1",
      type: "inject_fault",
      label: `Inject ${type} fault`,
      config: { percentage: 30, target: "all-endpoints" },
    },
    {
      id: "step-2", 
      type: "wait",
      label: "Wait for metrics",
      config: { duration: 30 },
    },
  ]

  if (type === "latency" || type === "resource") {
    baseSteps.push({
      id: "step-3",
      type: "increase_intensity",
      label: "Increase fault intensity",
      config: { percentage: 60 },
    })
    baseSteps.push({
      id: "step-4",
      type: "wait",
      label: "Observe impact",
      config: { duration: 60 },
    })
  }

  baseSteps.push({
    id: `step-${baseSteps.length + 1}`,
    type: "recover",
    label: "Remove fault injection",
    config: { graceful: true },
  })

  baseSteps.push({
    id: `step-${baseSteps.length + 1}`,
    type: "validate",
    label: "Validate recovery",
    config: { timeout: 120, checkMetrics: true },
  })

  return baseSteps
}

function generateScenarioDetail(index: number): ScenarioDetail {
  const types: FailureType[] = ["latency", "error", "shutdown", "resource"]
  const statuses: ScenarioStatus[] = ["active", "archived"]
  const type = types[index % types.length]
  const baseScenario = scenarios[index % scenarios.length]

  return {
    id: `scenario-${String(index + 1).padStart(3, "0")}`,
    name: baseScenario.name,
    description: baseScenario.description,
    type,
    targetService: targetServices[index % targetServices.length],
    version: `v${Math.floor(index / 3) + 1}.${index % 3}.0`,
    lastUpdated: new Date(Date.now() - index * 86400000 * 2),
    owner: owners[index % owners.length],
    status: index % 7 === 0 ? statuses[1] : statuses[0],
    environment: envs[index % envs.length],
    intensity: 20 + (index * 10) % 80,
    duration: 30 + (index * 15) % 270,
    scheduleType: index % 3 === 0 ? "cron" : "manual",
    cronExpression: index % 3 === 0 ? "0 2 * * 1" : undefined,
    safetyConfig: {
      maxErrorRate: 5 + (index % 10),
      autoStopEnabled: index % 4 !== 0,
    },
    steps: generateSteps(type),
  }
}

export const mockScenarios: ScenarioDetail[] = Array.from({ length: 24 }, (_, i) => 
  generateScenarioDetail(i)
)

export function getScenarioById(id: string): ScenarioDetail | null {
  return mockScenarios.find(s => s.id === id) || null
}

const changelogMessages = [
  "Initial release with basic fault injection",
  "Added configurable intensity ramping",
  "Improved recovery validation logic",
  "Added circuit breaker monitoring",
  "Optimized for production workloads",
  "Fixed timing issues in wait steps",
  "Added support for multi-region testing",
  "Improved error rate threshold handling",
]

export function getScenarioVersions(scenarioId: string): ScenarioVersion[] {
  const scenario = getScenarioById(scenarioId)
  if (!scenario) return []

  const versionParts = scenario.version.replace("v", "").split(".")
  const major = Number.parseInt(versionParts[0], 10)
  const minor = Number.parseInt(versionParts[1], 10)

  const versions: ScenarioVersion[] = []
  let idx = 0

  for (let maj = major; maj >= 1; maj--) {
    const maxMin = maj === major ? minor : 2
    for (let min = maxMin; min >= 0; min--) {
      versions.push({
        id: `ver-${scenarioId}-${maj}-${min}`,
        version: `v${maj}.${min}.0`,
        publishedAt: new Date(Date.now() - idx * 7 * 86400000),
        publishedBy: owners[idx % owners.length],
        changelog: changelogMessages[idx % changelogMessages.length],
        isCurrent: idx === 0,
      })
      idx++
      if (versions.length >= 6) break
    }
    if (versions.length >= 6) break
  }

  return versions
}

export function getScenarioRuns(scenarioId: string): Run[] {
  return mockRuns.filter(run => {
    const scenarioIndex = mockScenarios.findIndex(s => s.id === scenarioId)
    if (scenarioIndex === -1) return false
    const scenario = mockScenarios[scenarioIndex]
    return run.scenario === scenario.name
  }).slice(0, 10)
}

// Incident-related mock data
const incidentTitles = [
  "P95 latency exceeded threshold",
  "Error rate spike detected",
  "Circuit breaker tripped repeatedly",
  "Memory usage critical",
  "Connection pool exhausted",
  "Cascade failure in downstream services",
  "Database connection timeouts",
  "Rate limiting triggered",
  "CPU saturation detected",
  "Response time degradation",
]

const incidentSummaries = [
  "p95 latency exceeded 800ms; error rate 4.2%",
  "Error rate spiked to 12.3% over 5 minute window",
  "Circuit breaker opened 8 times in 2 minutes",
  "Memory usage at 94% with no recovery trend",
  "Connection pool 100% utilized; requests queueing",
  "3 downstream services reporting failures",
  "Database connections timing out after 30s",
  "Rate limiter rejecting 45% of requests",
  "CPU at 98% utilization across all instances",
  "Response times 3x baseline for /api/checkout",
]

const rootCauses = [
  "Increased traffic volume exceeded auto-scaling capacity. The scaling policy delay (3 min) caused request queuing.",
  "Database query N+1 problem in user lookup causing exponential load increase under concurrent requests.",
  "Memory leak in connection handling code causing gradual resource exhaustion over time.",
  "Misconfigured retry policy causing retry storms during partial outages.",
  "Third-party payment provider experiencing degraded performance affecting checkout flow.",
  "DNS resolution delays causing connection establishment timeouts to downstream services.",
]

const recommendedActionsList = [
  "Scale up instances immediately to handle traffic surge",
  "Enable circuit breaker on affected endpoints",
  "Implement request rate limiting at edge",
  "Review and optimize database queries",
  "Add connection pool monitoring alerts",
  "Configure exponential backoff with jitter",
  "Implement bulkhead pattern for isolation",
  "Add fallback responses for degraded mode",
]

const impactedEndpointsList = [
  "/api/checkout",
  "/api/users/:id",
  "/api/inventory/search",
  "/api/payments/process",
  "/api/notifications/send",
  "/api/auth/token",
  "/api/orders/:id/status",
  "/api/products/catalog",
]

function generateSignals(detectedAt: Date, severity: IncidentSeverity): IncidentSignal[] {
  const signals: IncidentSignal[] = [
    {
      id: "sig-1",
      timestamp: new Date(detectedAt.getTime() - 180000),
      type: "metric_anomaly",
      title: "Latency anomaly detected",
      value: "p95 increased 150% from baseline",
    },
    {
      id: "sig-2",
      timestamp: new Date(detectedAt.getTime() - 120000),
      type: "threshold_breach",
      title: "Error rate threshold breached",
      value: "4.2% > 2% threshold",
    },
    {
      id: "sig-3",
      timestamp: new Date(detectedAt.getTime() - 60000),
      type: "correlation",
      title: "Correlated with upstream deployment",
      value: "api-gateway v2.3.1 deployed 10min ago",
    },
    {
      id: "sig-4",
      timestamp: new Date(detectedAt.getTime()),
      type: "alert_fired",
      title: "PagerDuty alert triggered",
      value: severity === "critical" ? "P1 - Immediate response" : "P2 - Urgent",
    },
  ]

  if (severity === "critical" || severity === "high") {
    signals.push({
      id: "sig-5",
      timestamp: new Date(detectedAt.getTime() + 30000),
      type: "threshold_breach",
      title: "SLO budget consumption accelerated",
      value: "Burning 15x normal rate",
    })
  }

  return signals
}

function generateIncidentDetail(index: number): IncidentDetail {
  const severities: IncidentSeverity[] = ["critical", "high", "medium", "low"]
  const statuses: IncidentStatus[] = ["open", "acknowledged", "resolved"]
  const severity = severities[index % 4]
  const status = index < 3 ? "open" : index < 8 ? "acknowledged" : statuses[index % 3]
  const detectedAt = new Date(Date.now() - index * 3600000 * 2)
  const run = mockRuns[index % mockRuns.length]

  return {
    id: `inc-${String(index + 1).padStart(4, "0")}`,
    title: incidentTitles[index % incidentTitles.length],
    summary: incidentSummaries[index % incidentSummaries.length],
    severity,
    status,
    service: targetServices[index % targetServices.length],
    detectedAt,
    runId: run.id,
    owner: status === "open" ? null : owners[index % owners.length],
    suspectedRootCause: rootCauses[index % rootCauses.length],
    impactedEndpoints: impactedEndpointsList.slice(0, 2 + (index % 4)),
    recommendedActions: recommendedActionsList.slice(0, 3 + (index % 3)),
    signals: generateSignals(detectedAt, severity),
    metrics: {
      latencyP95: 200 + (index * 50) % 600,
      errorRate: severity === "critical" ? 8 + Math.random() * 7 : severity === "high" ? 4 + Math.random() * 4 : 1 + Math.random() * 3,
    },
  }
}

export const mockIncidents: IncidentDetail[] = Array.from({ length: 30 }, (_, i) => 
  generateIncidentDetail(i)
)

export function getIncidentById(id: string): IncidentDetail | null {
  return mockIncidents.find(inc => inc.id === id) || null
}

export function getRelatedRunsForIncident(incidentId: string): Run[] {
  const incident = getIncidentById(incidentId)
  if (!incident) return []
  
  // Return runs from the same service
  return mockRuns
    .filter(run => {
      const scenario = scenarios.find(s => s.name === run.scenario)
      return scenario && targetServices.some(ts => incident.service === ts)
    })
    .slice(0, 5)
}

export function getIncidentConfidence(severity: IncidentSeverity): number {
  // Mock confidence based on severity - in real app would be ML-derived
  const baseConfidence: Record<IncidentSeverity, number> = {
    critical: 92,
    high: 85,
    medium: 72,
    low: 65,
  }
  return baseConfidence[severity] + Math.floor(Math.random() * 8) - 4
}

export function getRunDetail(runId: string): RunDetail | null {
  const run = mockRuns.find(r => r.id === runId)
  if (!run) return null

  return {
    ...run,
    environment: environments[Math.abs(runId.charCodeAt(4)) % environments.length],
    metrics: {
      ...run.metrics,
      latencyP95: run.metrics.latencyP50 + (run.metrics.latencyP99 - run.metrics.latencyP50) * 0.7,
      throughput: Math.floor(1000 + Math.random() * 4000),
      cpuUsage: run.status === "failed" ? 75 + Math.random() * 20 : 30 + Math.random() * 40,
      memoryUsage: run.status === "failed" ? 70 + Math.random() * 25 : 40 + Math.random() * 30,
    },
    detailedTimeline: generateDetailedTimeline(run.startedAt, run.status),
    incidents: generateIncidents(run.status, run.startedAt),
  }
}
