import { TrafficSnapshot, Intersection } from '../../domain/types';
import { AgentProposal, AgentStatus, PredictionResult } from '../types';
import { DefaultIntelligenceConfig } from '../config';

export class IntersectionAgent {
  public id: string;
  public intersectionId: string;
  public status: AgentStatus = 'IDLE';
  
  private lastUpdate: number = 0;
  private lastProposalId: string | null = null;

  constructor(intersectionId: string) {
    this.intersectionId = intersectionId;
    this.id = `agent-${intersectionId}`;
  }

  public evaluate(
    snapshot: TrafficSnapshot, 
    predictions: PredictionResult[]
  ): AgentProposal | null {
    this.status = 'OBSERVING';
    this.lastUpdate = Date.now();

    const intersection = snapshot.intersections.find(i => i.id === this.intersectionId);
    if (!intersection) {
      this.status = 'ERROR';
      return null;
    }

    // Filter predictions relevant to this intersection
    const localPredictions = predictions.filter(p => p.affectedIntersectionId === this.intersectionId);
    const criticalPrediction = localPredictions.find(p => p.riskLevel === 'CRITICAL' || p.riskLevel === 'HIGH');

    // Default objective weights
    let queueWeight = intersection.queueLength / DefaultIntelligenceConfig.queueThresholdHigh;
    let speedWeight = DefaultIntelligenceConfig.speedThresholdLow / Math.max(1, intersection.averageSpeedKmh);
    
    // Check neighbors (canonical state)
    const neighbors = snapshot.intersections.filter(i => intersection.neighboringIntersections.includes(i.id));
    const neighborAvgDensity = neighbors.length > 0 
      ? neighbors.reduce((acc, i) => acc + i.density, 0) / neighbors.length 
      : 0;

    // Formulation of proposal
    if (criticalPrediction) {
      this.status = 'PROPOSING';
      const proposal: AgentProposal = {
        id: `prop-${Date.now()}-${this.id}`,
        agentId: this.id,
        intersectionId: this.intersectionId,
        timestamp: Date.now(),
        requestedPhase: this.determineReliefPhase(intersection),
        requestedDuration: Math.min(DefaultIntelligenceConfig.maxGreenSeconds, 45), // Push duration up
        reason: criticalPrediction.reason,
        expectedImpact: "Reduce projected queue growth.",
        priority: 50,
        confidence: criticalPrediction.confidence,
        source: 'IntersectionAgent'
      };
      this.lastProposalId = proposal.id;
      return proposal;
    } else if (queueWeight > 1.2 || speedWeight > 1.2) {
      this.status = 'PROPOSING';
      const proposal: AgentProposal = {
        id: `prop-${Date.now()}-${this.id}`,
        agentId: this.id,
        intersectionId: this.intersectionId,
        timestamp: Date.now(),
        requestedPhase: this.determineReliefPhase(intersection),
        requestedDuration: 30,
        reason: `Local queue length (${intersection.queueLength}) and speed (${intersection.averageSpeedKmh}km/h) violate thresholds.`,
        expectedImpact: "Flush accumulated local queue.",
        priority: 30,
        confidence: 0.8,
        source: 'IntersectionAgent'
      };
      this.lastProposalId = proposal.id;
      return proposal;
    } else if (neighborAvgDensity > 80 && intersection.density < 40) {
      this.status = 'PROPOSING';
      const proposal: AgentProposal = {
        id: `prop-${Date.now()}-${this.id}`,
        agentId: this.id,
        intersectionId: this.intersectionId,
        timestamp: Date.now(),
        requestedPhase: 'HOLD_ALL_RED', // Theoretical phase to meter traffic
        requestedDuration: 10,
        reason: `Neighbor density critically high (${Math.round(neighborAvgDensity)}). Local density low.`,
        expectedImpact: "Meter traffic flow to protect saturated neighbors (upstream gating).",
        priority: 40,
        confidence: 0.9,
        source: 'IntersectionAgent'
      };
      this.lastProposalId = proposal.id;
      return proposal;
    }

    this.status = 'IDLE';
    return null;
  }

  private determineReliefPhase(intersection: Intersection): string {
    // A real heuristic would analyze which specific approach has the queue.
    // For now, toggle to the opposite of current phase if it's currently green.
    if (intersection.currentPhase.includes('N-S')) {
      return 'E-W Straight & Right';
    }
    return 'N-S Straight & Left Protected';
  }
}
