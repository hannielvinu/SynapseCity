import { TrafficSnapshot } from '../../domain/types';
import { AgentProposal, Decision, PredictionResult } from '../types';
import { HeuristicPredictionProvider } from '../prediction/HeuristicPredictionProvider';
import { IntersectionAgent } from '../agents/IntersectionAgent';
import { SafetyValidator } from '../safety/SafetyValidator';
import { ConflictResolver } from './ConflictResolver';
import { IntelligenceEventBus } from '../events/IntelligenceEventBus';

export class CityCoordinator {
  private predictionProvider: HeuristicPredictionProvider;
  private safetyValidator: SafetyValidator;
  private conflictResolver: ConflictResolver;
  private eventBus: IntelligenceEventBus;
  
  private agents: Map<string, IntersectionAgent> = new Map();
  private isEnabled: boolean = true;

  constructor() {
    this.predictionProvider = new HeuristicPredictionProvider();
    this.safetyValidator = new SafetyValidator();
    this.conflictResolver = new ConflictResolver();
    this.eventBus = IntelligenceEventBus.getInstance();
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  /**
   * The core intelligence decision pipeline.
   * Executed explicitly on a configurable interval tick.
   */
  public coordinate(snapshot: TrafficSnapshot): Decision[] {
    if (!this.isEnabled) {
      return [];
    }

    const decisions: Decision[] = [];
    const proposals: AgentProposal[] = [];

    // 1. Generate Predictions
    const predictions: PredictionResult[] = [];
    try {
      predictions.push(...this.predictionProvider.generatePredictions(snapshot));
      predictions.forEach(p => {
        this.eventBus.publish({
          type: 'PREDICTION_UPDATED',
          data: p
        });
      });
    } catch (e) {
      console.error("[Intelligence] PredictionProvider failed. Proceeding without predictions.", e);
    }

    // 2. Synchronize Agents
    // Ensure we have an agent for every intersection in the snapshot
    for (const intersection of snapshot.intersections) {
      if (!this.agents.has(intersection.id)) {
        this.agents.set(intersection.id, new IntersectionAgent(intersection.id));
      }
    }

    // 3. Agent Perceptions & Proposals
    for (const agent of this.agents.values()) {
      try {
        const proposal = agent.evaluate(snapshot, predictions);
        if (proposal) {
          proposals.push(proposal);
          this.eventBus.publish({
            type: 'AGENT_PROPOSAL_CREATED',
            data: proposal
          });
        }
      } catch (e) {
        console.error(`[Intelligence] Agent ${agent.id} failed to evaluate.`, e);
        agent.status = 'ERROR';
      }
    }

    // (Emergency Dispatcher proposals would be injected here in a full implementation)

    // 4. Conflict Resolution
    const resolvedProposals = this.conflictResolver.resolveConflicts(proposals);

    // 5. Safety Validation & Decision Creation
    for (const proposal of resolvedProposals) {
      try {
        const validation = this.safetyValidator.validate(proposal, snapshot);

        const decision: Decision = {
          id: `dec-${Date.now()}-${proposal.intersectionId}`,
          timestamp: Date.now(),
          source: proposal.source,
          intersectionId: proposal.intersectionId,
          decisionType: 'SIGNAL_CHANGE',
          requestedChange: {
            phase: proposal.requestedPhase,
            duration: proposal.requestedDuration
          },
          approvalStatus: validation.approved ? 'APPROVED' : 'REJECTED',
          priority: proposal.priority,
          reason: proposal.reason,
          expectedImpact: proposal.expectedImpact,
          validation
        };

        if (decision.approvalStatus === 'APPROVED') {
          this.eventBus.publish({
            type: 'AGENT_PROPOSAL_APPROVED',
            data: decision
          });
          decisions.push(decision);
        } else {
          this.eventBus.publish({
            type: 'AGENT_PROPOSAL_REJECTED',
            data: decision
          });
          // We still return rejected decisions so they can be logged or shown in UI
          decisions.push(decision);
        }
      } catch (e) {
        console.error(`[Intelligence] SafetyValidator failed on proposal ${proposal.id}. Failing closed.`, e);
      }
    }

    return decisions;
  }

  /**
   * Authoritative Command Boundary for external/UI/Emergency commands.
   * Maps an external command to the shared SafetyValidator.
   */
  public validateExternalProposal(proposal: AgentProposal, snapshot: TrafficSnapshot) {
    const validation = this.safetyValidator.validate(proposal, snapshot);
    if (!validation.approved) {
      this.eventBus.publish({
        type: 'AGENT_PROPOSAL_REJECTED',
        data: {
          id: `ext-rej-${Date.now()}`,
          source: proposal.source,
          decisionType: 'SIGNAL_CHANGE',
          requestedChange: { phase: proposal.requestedPhase, duration: proposal.requestedDuration },
          approvalStatus: 'REJECTED',
          reason: proposal.reason,
          validation
        }
      });
    }
    return validation;
  }

  public getAgents(): IntersectionAgent[] {
    return Array.from(this.agents.values());
  }
}
