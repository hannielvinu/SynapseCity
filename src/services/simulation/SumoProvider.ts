import { execSync } from 'child_process';
import { SimulationProvider } from './SimulationProvider';
import { TrafficSnapshot, SimulationState } from '../../domain/types';
import { SimulationConfiguration } from '../../config/simulation';

export class SumoProvider implements SimulationProvider {
  private isAvailable: boolean = false;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private simTime: number = 0;

  constructor() {}

  async initialize(): Promise<boolean> {
    try {
      // Attempt to check if SUMO is installed in the environment
      const binary = SimulationConfiguration.SUMO_BINARY || 'sumo';
      execSync(`${binary} --version`, { stdio: 'ignore' });
      this.isAvailable = true;
      console.log(`[SUMO Adapter] SUMO binary '${binary}' found. Adapter initialized.`);
    } catch (e) {
      this.isAvailable = false;
      console.warn(`[SUMO Adapter] SUMO binary not found in environment. SUMO unavailable.`);
    }
    return this.isAvailable;
  }

  start(): void {
    if (!this.isAvailable) return;
    this.isRunning = true;
    this.isPaused = false;
    // In a full implementation, we would spawn SUMO and connect TraCI here
  }

  pause(): void {
    if (!this.isAvailable) return;
    this.isPaused = true;
  }

  resume(): void {
    if (!this.isAvailable) return;
    this.isPaused = false;
  }

  reset(): void {
    if (!this.isAvailable) return;
    this.simTime = 0;
  }

  step(): void {
    if (!this.isAvailable || !this.isRunning || this.isPaused) return;
    this.simTime++;
    // In a full implementation, we would call traci.simulationStep() here
  }

  getState(): TrafficSnapshot {
    // If SUMO is not available or running, we return an empty skeleton.
    // The architecture ensures we fallback to PrototypeProvider if initialize() returned false.
    return {
      timestamp: Date.now(),
      simulationTime: this.simTime,
      provider: 'SUMO',
      vehicles: [],
      intersections: [],
      incidents: [],
      emergencies: [],
      networkMetrics: {
        vehicleCount: 0,
        averageSpeedKmh: 0,
        density: 0,
        queueLength: 0,
        throughput: 0,
        activeIncidents: 0,
        emergencyCount: 0
      }
    };
  }

  getStatus(): SimulationState {
    return {
      running: this.isRunning,
      paused: this.isPaused,
      simulationTime: this.simTime,
      tickRateHz: 1,
      connected: this.isAvailable,
      provider: 'SUMO',
      scenario: 'NORMAL'
    };
  }

  async shutdown(): Promise<void> {
    this.pause();
    this.isRunning = false;
    // Disconnect TraCI and kill SUMO subprocess here
  }
}
