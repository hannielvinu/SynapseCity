import { EventEmitter } from 'events';
import { SimulationProvider } from '../simulation/SimulationProvider';
import { PrototypeProvider } from '../simulation/PrototypeProvider';
import { SumoProvider } from '../simulation/SumoProvider';
import { TrafficSnapshot, SimulationState, Scenario } from '../../domain/types';
import { SimulationConfiguration } from '../../config/simulation';
import { CityCoordinator } from '../../intelligence/coordination/CityCoordinator';
import { DefaultIntelligenceConfig } from '../../intelligence/config';
import { EmergencyCorridorManager } from '../../intelligence/emergency/EmergencyCorridorManager';
import { SafetyValidator } from '../../intelligence/safety/SafetyValidator';
import { DigitalTwinEngine } from '../digitalTwin/DigitalTwinEngine';
import { DigitalTwinScenario, EmergencyCorridor, DigitalTwinComparison } from '../../intelligence/types';

export class TrafficStore extends EventEmitter {
  private activeProvider: SimulationProvider;
  private sumoProvider: SumoProvider;
  private prototypeProvider: PrototypeProvider;
  private coordinator: CityCoordinator;
  private corridorManager: EmergencyCorridorManager;
  private digitalTwin: DigitalTwinEngine;
  
  private currentSnapshot: TrafficSnapshot | null = null;
  private tickInterval: NodeJS.Timeout | null = null;
  private tickCount: number = 0;

  constructor() {
    super();
    this.sumoProvider = new SumoProvider();
    this.prototypeProvider = new PrototypeProvider();
    this.coordinator = new CityCoordinator();
    this.corridorManager = new EmergencyCorridorManager(new SafetyValidator());
    this.digitalTwin = new DigitalTwinEngine();
    // Default to prototype until initialized
    this.activeProvider = this.prototypeProvider;
  }

  async initialize(): Promise<void> {
    const sumoAvailable = await this.sumoProvider.initialize();
    await this.prototypeProvider.initialize();

    if (sumoAvailable && !SimulationConfiguration.FALLBACK_TO_PROTOTYPE) {
      this.activeProvider = this.sumoProvider;
      console.log("[TrafficStore] Using SUMO Simulation Provider.");
    } else {
      this.activeProvider = this.prototypeProvider;
      console.log("[TrafficStore] SUMO unavailable or fallback enforced. Using Prototype Simulation Provider.");
    }
  }

  start(): void {
    this.activeProvider.start();
    this.startTickLoop();
    this.emit('simulation_started');
  }

  pause(): void {
    this.activeProvider.pause();
    this.emit('simulation_paused');
  }

  resume(): void {
    this.activeProvider.resume();
    this.emit('simulation_resumed');
  }

  reset(): void {
    this.activeProvider.reset();
    this.emit('simulation_reset');
    this.broadcastState();
  }

  private startTickLoop(): void {
    if (this.tickInterval) clearInterval(this.tickInterval);
    this.tickInterval = setInterval(() => {
      this.activeProvider.step();
      this.currentSnapshot = this.activeProvider.getState();
      
      this.tickCount++;

      // Run intelligence layer at configured interval
      if (this.currentSnapshot && this.tickCount % DefaultIntelligenceConfig.decisionIntervalTicks === 0) {
        const decisions = this.coordinator.coordinate(this.currentSnapshot);
        this.executeDecisions(decisions);
      }

      // Monitor active emergency corridors
      if (this.currentSnapshot) {
        this.corridorManager.monitorCorridors(this.currentSnapshot);
      }

      this.broadcastState();
    }, 1000); // 1 tick per second
  }

  private executeDecisions(decisions: any[]): void {
    for (const decision of decisions) {
      if (decision.approvalStatus === 'APPROVED' && this.activeProvider instanceof PrototypeProvider) {
        try {
          if (decision.decisionType === 'SIGNAL_CHANGE') {
            // Send the command down to the engine
            this.activeProvider.engine.forceSignalPhase(decision.intersectionId, decision.requestedChange.phase, decision.requestedChange.duration);
            decision.approvalStatus = 'EXECUTED';
            decision.executedAt = Date.now();
          }
        } catch (e) {
          console.error("Failed to execute approved decision:", e);
        }
      }
    }
  }

  public getEngineState() {
    return this.prototypeProvider.engine.getFullState();
  }

  private broadcastState(): void {
    if (this.currentSnapshot) {
      const fullState = this.getEngineState();
      this.emit('state_update', {
        snapshot: this.currentSnapshot,
        status: this.activeProvider.getStatus(),
        corridors: this.corridorManager.getCorridors(),
        digitalTwinComparison: this.digitalTwin.getLastComparison(),
        cameraFeeds: fullState.cameraFeeds,
        agents: fullState.agents,
        agentLogs: fullState.agentLogs,
        simConfig: fullState.simConfig,
        timelineStage: fullState.timelineStage,
        strategy: fullState.strategy,
        comparison: fullState.comparison,
        history: fullState.history
      });
    }
  }

  getSnapshot(): TrafficSnapshot | null {
    return this.currentSnapshot;
  }

  getStatus(): SimulationState {
    return this.activeProvider.getStatus();
  }

  getCorridors(): EmergencyCorridor[] {
    return this.corridorManager.getCorridors();
  }

  getDigitalTwinComparison(): DigitalTwinComparison | null {
    return this.digitalTwin.getLastComparison();
  }

  // Adapter methods for specific engine commands (fallback mapped to Prototype for now)
  setScenario(scenario: Scenario): void {
    // Implement scenario switching internally if supported by the provider
    if (this.activeProvider instanceof PrototypeProvider) {
      const configUpdate: any = {};
      if (scenario === 'PEAK_HOUR') configUpdate.trafficSurge = 60;
      else if (scenario === 'HEAVY_RAIN') configUpdate.weather = 'heavy_rain';
      else if (scenario === 'NORMAL') { configUpdate.trafficSurge = 0; configUpdate.weather = 'clear'; }
      this.activeProvider.engine.updateConfig(configUpdate);
    }
  }

  // Command handlers
  executeCommand(command: any): void {
    // Commands specific to prototype engine that UI triggers
    if (this.activeProvider instanceof PrototypeProvider) {
      const engine = this.activeProvider.engine;
      
      // Safety Boundary Interception
      if (['UPDATE_PHASE_DURATION', 'REBALANCE', 'DISPATCH_EMERGENCY', 'UPDATE_SIGNAL_MODE', 'CLEAR_EMERGENCY'].includes(command.type) && this.currentSnapshot) {
        
        let targetNodeId = command.nodeId;
        let requestedDuration = command.duration || 45; // default fallback
        let source = 'Operator';
        
        // For emergency, figure out the first node
        if (command.type === 'DISPATCH_EMERGENCY') {
           targetNodeId = command.unit.origin;
           source = 'EmergencyDispatcher';
           requestedDuration = 60; // emergencies hold longer
        } else if (command.type === 'CLEAR_EMERGENCY') {
           source = 'EmergencyDispatcher';
           // Find the unit in current snapshot to get a node to validate against
           const unit = this.currentSnapshot.emergencies.find(u => u.id === command.unitId);
           if (unit && unit.pathNodeIds.length > 0) {
             targetNodeId = unit.pathNodeIds[0];
           } else {
             // If unit not found, let it pass to allow cleanup of orphaned states
             targetNodeId = null;
           }
        }

        if (targetNodeId) {
          const intersection = this.currentSnapshot.intersections.find(i => i.id === targetNodeId);
        if (intersection) {
          const proposal = {
            id: `cmd-${Date.now()}`,
            agentId: 'external-ui',
            intersectionId: targetNodeId,
            timestamp: Date.now(),
            requestedPhase: intersection.currentPhase, // For simple duration/rebalance requests, keep phase
            requestedDuration: requestedDuration,
            reason: `External command: ${command.type}`,
            expectedImpact: 'Immediate manual/emergency override',
            priority: source === 'EmergencyDispatcher' ? 100 : 80,
            confidence: 1,
            source
          };

            const validation = this.coordinator.validateExternalProposal(proposal, this.currentSnapshot);
            if (!validation.approved) {
              console.warn(`[TrafficStore] Safety Boundary REJECTED command ${command.type}: ${validation.reason}`);
              return; // DROP COMMAND
            }
          }
        }
      }

      switch (command.type) {
        case "REBALANCE":
          engine.rebalanceNode(command.nodeId);
          break;
        case "UPDATE_SIGNAL_MODE":
          engine.updateNodeSignalMode(command.nodeId, command.mode);
          break;
        case "UPDATE_PHASE_DURATION":
          engine.updatePhaseDuration(command.nodeId, command.duration);
          break;
        case "DISPATCH_EMERGENCY": {
          engine.dispatchEmergency(command.unit);
          // Create emergency corridor
          if (this.currentSnapshot) {
            const state = engine.getFullState();
            const unit = state.emergencyUnits.find((u: any) => u.callsign === command.unit.callsign);
            if (unit && unit.pathNodeIds.length > 0) {
              const corridor = this.corridorManager.createCorridor(
                unit.id || `eu-${Date.now()}`,
                unit.callsign,
                unit.pathNodeIds,
                unit.etaSeconds,
                `Emergency dispatch: ${unit.callsign}`,
                unit.routingFactors
              );
              // Activate the corridor through SafetyValidator
              this.corridorManager.activateCorridor(corridor.id, this.currentSnapshot);
            }
          }
          break;
        }
        case "CLEAR_EMERGENCY":
          engine.clearEmergency(command.unitId);
          break;
        case "RESOLVE_INCIDENT":
          engine.resolveIncident(command.incidentId);
          break;
        case "SUBMIT_CITIZEN_REPORT":
          engine.addCitizenReport(command.report);
          break;
        case "VERIFY_CITIZEN_REPORT":
          engine.verifyCitizenReport(command.reportId);
          break;
        case "UPDATE_CONFIG":
          engine.updateConfig(command.config || {});
          break;
        case "SET_STRATEGY":
          engine.setStrategy(command.strategy);
          break;
        case "RESET_SIMULATION":
          this.reset();
          break;
        case "PAUSE_SIMULATION":
          this.pause();
          break;
        case "RESUME_SIMULATION":
          this.resume();
          break;
        // Digital Twin Commands
        case "CAPTURE_SNAPSHOT": {
          if (this.currentSnapshot) {
            const snapshot = this.digitalTwin.captureSnapshot(this.currentSnapshot);
            this.emit('snapshot_captured', snapshot);
          }
          break;
        }
        case "RUN_DIGITAL_TWIN": {
          if (command.snapshotId && command.scenario) {
            const scenario: DigitalTwinScenario = command.scenario;
            const baselineScenario: DigitalTwinScenario = { ...scenario, strategy: 'baseline', name: 'Baseline' };
            const strategyScenario: DigitalTwinScenario = { ...scenario, strategy: 'ai', name: 'Coordinated Strategy' };
            
            const baselineRun = this.digitalTwin.runScenario(command.snapshotId, baselineScenario);
            const strategyRun = this.digitalTwin.runScenario(command.snapshotId, strategyScenario);
            const comparison = this.digitalTwin.compare(baselineRun, strategyRun);
            
            this.emit('digital_twin_completed', comparison);
          }
          break;
        }
        case "APPLY_STRATEGY": {
          // Route strategy application through SafetyValidator
          if (this.currentSnapshot && command.strategyChanges) {
            for (const change of command.strategyChanges) {
              const proposal = {
                id: `strategy-apply-${Date.now()}-${change.intersectionId}`,
                agentId: 'DigitalTwinEngine',
                intersectionId: change.intersectionId,
                timestamp: Date.now(),
                requestedPhase: change.phase,
                requestedDuration: change.duration,
                reason: 'Applying Digital Twin recommended strategy',
                expectedImpact: 'Strategy validated through Digital Twin comparison',
                priority: 60,
                confidence: 0.9,
                source: 'Operator'
              };
              const validation = this.coordinator.validateExternalProposal(proposal, this.currentSnapshot);
              if (validation.approved) {
                engine.forceSignalPhase(change.intersectionId, change.phase, change.duration);
              }
            }
          }
          break;
        }
      }
    }
  }

  async shutdown(): Promise<void> {
    if (this.tickInterval) clearInterval(this.tickInterval);
    await this.activeProvider.shutdown();
  }
}

