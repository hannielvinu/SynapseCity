import { Intersection } from "../domain/types";

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

export interface IntelligenceEvent {
  id: string;
  type: 'AGENT_PROPOSAL_CREATED' | 'AGENT_PROPOSAL_REJECTED' | 'AGENT_PROPOSAL_APPROVED' | 'DECISION_EXECUTED' | 'PREDICTION_UPDATED' | 'EMERGENCY_CORRIDOR_CREATED' | 'EMERGENCY_CORRIDOR_UPDATED';
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
