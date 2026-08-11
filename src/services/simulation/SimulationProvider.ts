import { TrafficSnapshot, SimulationState } from '../../domain/types';

export interface SimulationProvider {
  /** 
   * Initializes the provider (e.g., checks binaries, loads configs).
   * Returns true if successfully initialized and available.
   */
  initialize(): Promise<boolean>;
  
  start(): void;
  pause(): void;
  resume(): void;
  reset(): void;
  
  /** Advances the simulation by one step. */
  step(): void;
  
  /** Returns the canonical authoritative state. */
  getState(): TrafficSnapshot;

  /** Returns provider operational status. */
  getStatus(): SimulationState;
  
  /** Cleanly shuts down any processes or connections. */
  shutdown(): Promise<void>;
}
