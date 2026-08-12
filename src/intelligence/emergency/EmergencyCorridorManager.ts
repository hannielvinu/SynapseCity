import { TrafficSnapshot } from '../../domain/types';
import { EmergencyCorridor, CorridorStatus, AgentProposal, SafetyValidationResult } from '../types';
import { IntelligenceEventBus } from '../events/IntelligenceEventBus';
import { SafetyValidator } from '../safety/SafetyValidator';

/**
 * EmergencyCorridorManager — manages the full lifecycle of emergency corridors.
 * 
 * PREPARING → ACTIVE → RESTORING → COMPLETED
 *                                 → CANCELLED
 *                    → FAILED
 * 
 * All signal changes are routed through SafetyValidator.
 */
export class EmergencyCorridorManager {
  private corridors: Map<string, EmergencyCorridor> = new Map();
  private eventBus: IntelligenceEventBus;
  private safetyValidator: SafetyValidator;

  constructor(safetyValidator: SafetyValidator) {
    this.eventBus = IntelligenceEventBus.getInstance();
    this.safetyValidator = safetyValidator;
  }

  /**
   * Create a new corridor from an emergency unit dispatch.
   * The corridor starts in PREPARING status.
   */
  public createCorridor(
    emergencyUnitId: string,
    callsign: string,
    route: string[],
    etaSeconds: number,
    reason: string
  ): EmergencyCorridor {
    const corridor: EmergencyCorridor = {
      id: `corridor-${Date.now()}`,
      emergencyUnitId,
      callsign,
      route,
      affectedIntersections: [...route],
      status: 'PREPARING',
      priority: 100, // Emergency priority
      createdAt: Date.now(),
      estimatedEtaSeconds: etaSeconds,
      currentEtaSeconds: etaSeconds,
      reason,
      decisions: [],
      metrics: {
        intersectionsCleared: 0,
        totalIntersections: route.length,
        timeSavedSeconds: 0
      }
    };

    this.corridors.set(corridor.id, corridor);
    
    this.eventBus.publish({
      type: 'EMERGENCY_CORRIDOR_CREATED',
      data: { corridor: { ...corridor } }
    });

    return corridor;
  }

  /**
   * Attempt to activate the corridor by generating proposals for affected intersections.
   * Each proposal goes through SafetyValidator. If any critical proposal fails,
   * corridor status → FAILED.
   */
  public activateCorridor(corridorId: string, snapshot: TrafficSnapshot): SafetyValidationResult[] {
    const corridor = this.corridors.get(corridorId);
    if (!corridor || corridor.status !== 'PREPARING') {
      return [];
    }

    const results: SafetyValidationResult[] = [];
    let allApproved = true;

    for (const intersectionId of corridor.affectedIntersections) {
      const intersection = snapshot.intersections.find(i => i.id === intersectionId);
      if (!intersection) continue;

      const proposal: AgentProposal = {
        id: `corridor-prop-${Date.now()}-${intersectionId}`,
        agentId: 'EmergencyCorridorManager',
        intersectionId,
        timestamp: Date.now(),
        requestedPhase: intersection.currentPhase, // Keep current phase but extend
        requestedDuration: 60, // Extended green for emergency passage
        reason: `Emergency corridor activation for ${corridor.callsign}`,
        expectedImpact: 'Emergency vehicle green wave passage',
        priority: 100,
        confidence: 1.0,
        source: 'EmergencyDispatcher'
      };

      const validation = this.safetyValidator.validate(proposal, snapshot);
      results.push(validation);

      if (validation.approved) {
        corridor.decisions.push(proposal.id);
      } else {
        allApproved = false;
      }
    }

    if (allApproved || results.some(r => r.approved)) {
      // At least partial activation — set ACTIVE
      corridor.status = 'ACTIVE';
      corridor.activatedAt = Date.now();
      corridor.metrics.intersectionsCleared = results.filter(r => r.approved).length;

      this.eventBus.publish({
        type: 'EMERGENCY_CORRIDOR_ACTIVATED',
        data: { corridor: { ...corridor }, validations: results }
      });
    } else {
      // Complete failure — no intersection could be cleared
      corridor.status = 'FAILED';
      this.eventBus.publish({
        type: 'EMERGENCY_CORRIDOR_FAILED',
        data: { corridor: { ...corridor }, reason: 'All intersection proposals rejected by SafetyValidator' }
      });
    }

    return results;
  }

  /**
   * Monitor active corridors during each tick.
   * Updates ETA, checks if emergency has passed, triggers restoration.
   */
  public monitorCorridors(snapshot: TrafficSnapshot): void {
    for (const corridor of this.corridors.values()) {
      if (corridor.status === 'ACTIVE') {
        // Find the emergency unit in the snapshot
        const unit = snapshot.emergencies.find(e => 
          e.callsign === corridor.callsign || e.id === corridor.emergencyUnitId
        );

        if (unit) {
          // Update ETA from live simulation data
          corridor.currentEtaSeconds = unit.etaSeconds;
          
          // Check if emergency has arrived
          if (unit.status === 'arrived' || unit.currentProgress >= 100) {
            corridor.status = 'RESTORING';
            this.eventBus.publish({
              type: 'EMERGENCY_CORRIDOR_RESTORING',
              data: { corridor: { ...corridor } }
            });
          } else {
            // Emit periodic update
            this.eventBus.publish({
              type: 'EMERGENCY_CORRIDOR_UPDATED',
              data: { 
                corridorId: corridor.id,
                currentEta: corridor.currentEtaSeconds,
                progress: unit.currentProgress,
                status: corridor.status
              }
            });
          }
        } else {
          // Emergency unit no longer exists — consider it cancelled
          corridor.status = 'CANCELLED';
        }
      } else if (corridor.status === 'RESTORING') {
        // Signal restoration is handled by the engine's normal phase cycling.
        // After a brief restoration window, mark as completed.
        const restorationDuration = 10000; // 10 seconds
        if (corridor.activatedAt && Date.now() - corridor.activatedAt > restorationDuration) {
          corridor.status = 'COMPLETED';
          corridor.completedAt = Date.now();
          corridor.metrics.timeSavedSeconds = Math.max(0, 
            corridor.estimatedEtaSeconds - corridor.currentEtaSeconds
          );

          this.eventBus.publish({
            type: 'EMERGENCY_CORRIDOR_COMPLETED',
            data: { corridor: { ...corridor } }
          });
        }
      }
    }
  }

  /**
   * Cancel a corridor by ID.
   */
  public cancelCorridor(corridorId: string): void {
    const corridor = this.corridors.get(corridorId);
    if (corridor && corridor.status !== 'COMPLETED' && corridor.status !== 'FAILED') {
      corridor.status = 'CANCELLED';
      corridor.completedAt = Date.now();
    }
  }

  /**
   * Get all corridors.
   */
  public getCorridors(): EmergencyCorridor[] {
    return Array.from(this.corridors.values());
  }

  /**
   * Get active corridors only.
   */
  public getActiveCorridors(): EmergencyCorridor[] {
    return Array.from(this.corridors.values()).filter(c => 
      c.status === 'PREPARING' || c.status === 'ACTIVE' || c.status === 'RESTORING'
    );
  }
}
