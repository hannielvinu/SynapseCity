import { EventEmitter } from 'events';
import { SimulationProvider } from '../simulation/SimulationProvider';
import { PrototypeProvider } from '../simulation/PrototypeProvider';
import { SumoProvider } from '../simulation/SumoProvider';
import { TrafficSnapshot, SimulationState, Scenario } from '../../domain/types';
import { SimulationConfiguration } from '../../config/simulation';

export class TrafficStore extends EventEmitter {
  private activeProvider: SimulationProvider;
  private sumoProvider: SumoProvider;
  private prototypeProvider: PrototypeProvider;
  
  private currentSnapshot: TrafficSnapshot | null = null;
  private tickInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.sumoProvider = new SumoProvider();
    this.prototypeProvider = new PrototypeProvider();
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
      this.broadcastState();
    }, 1000); // 1 tick per second
  }

  private broadcastState(): void {
    if (this.currentSnapshot) {
      this.emit('state_update', {
        snapshot: this.currentSnapshot,
        status: this.activeProvider.getStatus()
      });
    }
  }

  getSnapshot(): TrafficSnapshot | null {
    return this.currentSnapshot;
  }

  getStatus(): SimulationState {
    return this.activeProvider.getStatus();
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
        case "DISPATCH_EMERGENCY":
          engine.dispatchEmergency(command.unit);
          break;
        case "CLEAR_EMERGENCY":
          engine.clearEmergency(command.unitId);
          break;
        case "RESOLVE_INCIDENT":
          engine.resolveIncident(command.incidentId);
          break;
        case "ADD_REPORT":
          engine.addCitizenReport(command.report);
          break;
        case "UPDATE_CONFIG":
          engine.updateConfig(command.config);
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
      }
    }
  }

  async shutdown(): Promise<void> {
    if (this.tickInterval) clearInterval(this.tickInterval);
    await this.activeProvider.shutdown();
  }
}
