import { TrafficSnapshot } from '../../domain/types';
import { AgentProposal, SafetyValidationResult } from '../types';
import { DefaultIntelligenceConfig } from '../config';

export class SafetyValidator {
  
  public validate(proposal: AgentProposal, snapshot: TrafficSnapshot): SafetyValidationResult {
    const intersection = snapshot.intersections.find(i => i.id === proposal.intersectionId);
    
    if (!intersection) {
      return {
        approved: false,
        reason: 'Target intersection not found in canonical state.'
      };
    }

    // Rule 1: Signal bounds
    if (proposal.requestedDuration < DefaultIntelligenceConfig.minGreenSeconds) {
      return {
        approved: false,
        reason: `Requested duration (${proposal.requestedDuration}s) violates minimum green safety bound (${DefaultIntelligenceConfig.minGreenSeconds}s).`
      };
    }

    if (proposal.requestedDuration > DefaultIntelligenceConfig.maxGreenSeconds) {
      return {
        approved: false,
        reason: `Requested duration (${proposal.requestedDuration}s) violates maximum green safety bound (${DefaultIntelligenceConfig.maxGreenSeconds}s).`
      };
    }

    // Rule 2: Conflicting greens check (impossible geometries)
    // E.g., You cannot request "N-S Straight" while "E-W Left" is active without a clearance phase.
    // In our simplified model, any phase change requires ensuring we aren't bypassing yellow/all-red.
    // If the proposal asks to switch phases IMMEDIATELY while current is green, reject unless clearance is handled.
    if (intersection.signalState === 'GREEN' && intersection.currentPhase !== proposal.requestedPhase) {
      return {
        approved: false,
        reason: `Cannot immediately switch phase to ${proposal.requestedPhase} while ${intersection.currentPhase} is GREEN. Missing clearance phase.`
      };
    }

    // Rule 3: Manual Mode lock
    if (intersection.operationalMode === 'MANUAL' && proposal.source !== 'Operator' && proposal.source !== 'EmergencyDispatcher') {
      return {
        approved: false,
        reason: `Intersection is in MANUAL mode. AI proposals are currently locked out.`
      };
    }
    
    // Rule 4: Emergency Lock
    if (intersection.operationalMode === 'EMERGENCY' && proposal.source !== 'EmergencyDispatcher') {
      return {
        approved: false,
        reason: `Intersection is locked for EMERGENCY corridor. Standard agent proposals rejected.`
      };
    }

    return {
      approved: true,
      reason: 'Proposal passes all safety bounds.',
      validatedPhase: proposal.requestedPhase,
      validatedDuration: proposal.requestedDuration
    };
  }
}
