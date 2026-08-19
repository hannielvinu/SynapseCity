import { Intersection, TrafficSnapshot, NetworkMetrics } from "../domain/types";

export type AgentStatus = 'IDLE' | 'OBSERVING' | 'PROPOSING' | 'WAITING_VALIDATION' | 'APPROVED' | 'EXECUTING' | 'BLOCKED' | 'ERROR';
export type DecisionStatus = 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'EXECUTED' | 'EXPIRED';

export interface PredictionResult {
  timestamp: number;
  horizonMinutes: number; // 15, 30, 60
  affectedIntersectionId: string;
  currentState: { density: number; queueLength: number; averageSpeedKmh: number };
  predictedState: { density: number; queueLength: number; averageSpeedKmh: number };
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number; // e.g., 0.85
  reason: string;
  recommendedAction?: string;
}

export interface AgentProposal {
  id: string;
  agentId: string;
  intersectionId: string;
  timestamp: number;
  requestedPhase: string;
  requestedDuration: number;
  reason: string;
  expectedImpact: string;
  priority: number;
  confidence: number;
  source: string; // e.g. "IntersectionAgent", "EmergencyDispatcher"
}

export interface SafetyValidationResult {
  approved: boolean;
  reason: string;
  validatedPhase?: string;
  validatedDuration?: number;
}

export interface Decision {
  id: string;
  timestamp: number;
  source: string;
  intersectionId: string;
  decisionType: 'SIGNAL_CHANGE' | 'MODE_CHANGE' | 'EMERGENCY_OVERRIDE';
  requestedChange: { phase: string; duration: number };
  approvalStatus: DecisionStatus;
  priority: number;
  reason: string;
  expectedImpact: string;
  validation: SafetyValidationResult;
  executedAt?: number;
}

export type IntelligenceEventType =
  | 'AGENT_PROPOSAL_CREATED'
  | 'AGENT_PROPOSAL_REJECTED'
  | 'AGENT_PROPOSAL_APPROVED'
  | 'DECISION_EXECUTED'
  | 'PREDICTION_UPDATED'
  | 'EMERGENCY_CORRIDOR_CREATED'
  | 'EMERGENCY_CORRIDOR_ACTIVATED'
  | 'EMERGENCY_CORRIDOR_UPDATED'
  | 'EMERGENCY_CORRIDOR_RESTORING'
  | 'EMERGENCY_CORRIDOR_COMPLETED'
  | 'EMERGENCY_CORRIDOR_FAILED'
  | 'DIGITAL_TWIN_SNAPSHOT_CAPTURED'
  | 'DIGITAL_TWIN_RUN_COMPLETED';

export interface IntelligenceEvent {
  id: string;
  type: IntelligenceEventType;
  timestamp: number;
  data: any;
}

export interface IntelligenceConfig {
  decisionIntervalTicks: number; // E.g., run intelligence every 10 ticks (10s)
  predictionHorizons: number[]; // [15, 30, 60]
  queueThresholdHigh: number;
  speedThresholdLow: number;
  minGreenSeconds: number;
  maxGreenSeconds: number;
  yellowClearanceSeconds: number;
  allRedClearanceSeconds: number;
  emergencyPriorityWeight: number;
  proposalExpirySeconds: number;
}

// ============================================================
// Emergency Corridor Domain Model
// ============================================================

export type CorridorStatus = 'PREPARING' | 'ACTIVE' | 'RESTORING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';

export interface EmergencyCorridor {
  id: string;
  emergencyUnitId: string;
  callsign: string;
  route: string[]; // ordered intersection IDs
  affectedIntersections: string[];
  status: CorridorStatus;
  priority: number;
  createdAt: number;
  activatedAt?: number;
  completedAt?: number;
  estimatedEtaSeconds: number;
  currentEtaSeconds: number;
  reason: string;
  decisions: string[]; // decision IDs applied
  metrics: {
    intersectionsCleared: number;
    totalIntersections: number;
    timeSavedSeconds: number;
  };
  routingFactors?: {
    baseTravelTime: number;
    congestionPenalty: number;
    incidentPenalty: number;
    weatherPenalty: number;
    railwayPenalty: number;
  };
}

// ============================================================
// Digital Twin Domain Model
// ============================================================

export type DigitalTwinScenarioType = 'BASELINE' | 'PEAK_HOUR' | 'INCIDENT' | 'HEAVY_RAIN' | 'EMERGENCY' | 'CUSTOM';
export type DigitalTwinRunStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type DigitalTwinRecommendation = 'STRATEGY_FAVORED' | 'BASELINE_FAVORED' | 'NO_MATERIAL_DIFFERENCE' | 'INCONCLUSIVE';

export interface DigitalTwinSnapshot {
  id: string;
  createdAt: number;
  simulationTime: number;
  provider: string;
  intersections: any[]; // deep copy of Intersection[]
  vehicles: any[];
  incidents: any[];
  emergencies: any[];
  networkMetrics: NetworkMetrics;
}

export interface DigitalTwinScenario {
  name: string;
  description: string;
  scenarioType: DigitalTwinScenarioType;
  strategy: 'baseline' | 'ai';
  durationTicks: number;
}

export interface DigitalTwinRunMetrics {
  averageSpeedKmh: number;
  averageQueueLength: number;
  maxQueueLength: number;
  vehicleThroughput: number;
  averageDelaySeconds: number;
  activeIncidents: number;
}

export interface DigitalTwinRun {
  id: string;
  scenario: DigitalTwinScenario;
  startTime: number;
  endTime?: number;
  durationTicks: number;
  metrics: DigitalTwinRunMetrics;
  status: DigitalTwinRunStatus;
}

export interface DigitalTwinComparison {
  baselineRun: DigitalTwinRun;
  strategyRun: DigitalTwinRun;
  differences: {
    speedDelta: number;
    queueDelta: number;
    throughputDelta: number;
    delayDelta: number;
  };
  recommendation: DigitalTwinRecommendation;
  explanation: string;
}
