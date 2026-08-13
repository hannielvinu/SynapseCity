import { SimulationProvider } from './SimulationProvider';
import { TrafficEngine } from '../trafficEngine';
import { TrafficSnapshot, SimulationState, Vehicle, Intersection, Incident, EmergencyUnit, VehicleType, SignalStateColor } from '../../domain/types';

export class PrototypeProvider implements SimulationProvider {
  public engine: TrafficEngine;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private simTime: number = 0;

  constructor() {
    this.engine = new TrafficEngine();
  }

  async initialize(): Promise<boolean> {
    // Prototype is always available
    return true;
  }

  start(): void {
    this.isRunning = true;
    this.isPaused = false;
  }

  pause(): void {
    this.isPaused = true;
    this.engine.updateConfig({ speedMultiplier: 0 });
  }

  resume(): void {
    this.isPaused = false;
    this.engine.updateConfig({ speedMultiplier: 1 });
  }

  reset(): void {
    this.engine.resetSimulation();
    this.simTime = 0;
  }

  step(): void {
    if (this.isRunning && !this.isPaused) {
      this.engine.tick();
      this.simTime++;
    }
  }

  getState(): TrafficSnapshot {
    const state = this.engine.getFullState();

    const vehicles: Vehicle[] = state.vehicles.map(v => {
      // Map to Canonical Vehicle
      let vehicleType: VehicleType = 'car';
      if (['car', 'truck', 'bus', 'emergency', 'motorcycle', 'scooter', 'auto_rickshaw', 'pedestrian', 'bicycle', 'police', 'fire', 'ambulance'].includes(v.type)) {
        vehicleType = v.type as VehicleType;
      }

      // Map progress to absolute percentage coordinate approximation for frontend
      // The frontend uses absolute x/y for maps. The progress is 0-100 on an edge.
      let pos = { x: 0, y: 0 };
      const edgeParts = v.currentRoad.split('->');
      const origin = state.nodes.find(n => n.id === edgeParts[0]);
      const target = state.nodes.find(n => n.id === edgeParts[1]);
      if (origin && target) {
        pos.x = origin.x + (target.x - origin.x) * (v.progress / 100);
        pos.y = origin.y + (target.y - origin.y) * (v.progress / 100);
      }

      return {
        id: v.id,
        type: vehicleType,
        position: pos,
        speedKmh: v.speedKmh,
        heading: v.direction,
        currentRoad: v.currentRoad,
        destination: v.targetNodeId,
        status: v.status as any
      };
    });

    const intersections: Intersection[] = state.nodes.map(n => {
      let signalColor: SignalStateColor = 'GREEN';
      if (n.signalState.toLowerCase() === 'red') signalColor = 'RED';
      else if (n.signalState.toLowerCase() === 'yellow') signalColor = 'YELLOW';
      else if (n.signalState.toLowerCase() === 'all_red') signalColor = 'ALL_RED';

      return {
        id: n.id,
        name: n.name,
        latitude: n.x, // approximation: frontend uses percentage coordinates
        longitude: n.y,
        x: n.x,
        y: n.y,
        approaches: n.connectedNodes,
        signalState: signalColor,
        currentPhase: n.currentPhase,
        phaseStart: 0,
        phaseEnd: n.phaseTimeRemaining,
        queueLength: n.queueLength,
        density: n.densityScore,
        averageSpeedKmh: n.avgSpeedKmh,
        neighboringIntersections: n.connectedNodes,
        operationalMode: n.signalMode === 'manual_override' ? 'MANUAL' : (n.signalMode === 'emergency_corridor' ? 'EMERGENCY' : 'ADAPTIVE'),
        incidentAlert: n.incidentAlert
      };
    });

    const incidents: Incident[] = state.incidents.map(i => ({
      id: i.id,
      title: i.title,
      location: i.location,
      intersectionId: i.intersectionId,
      severity: i.severity as any,
      category: i.category,
      reportedAt: i.reportedAt,
      status: i.status as any,
      impactDelayMinutes: i.impactDelayMinutes
    }));

    const emergencies: EmergencyUnit[] = state.emergencyUnits.map(e => ({
      ...e,
      type: 'ambulance',
      status: e.status as any,
      timeSavedSeconds: e.timeSavedSeconds
    }));

    return {
      timestamp: Date.now(),
      simulationTime: this.simTime,
      provider: 'Prototype',
      vehicles,
      intersections,
      incidents,
      emergencies,
      networkMetrics: {
        vehicleCount: state.metrics.totalActiveVehicles,
        averageSpeedKmh: state.metrics.avgSpeedKmh,
        density: state.metrics.congestionIndex,
        queueLength: intersections.reduce((acc, i) => acc + i.queueLength, 0),
        throughput: vehicles.length,
        activeIncidents: state.incidents.filter(i => i.status !== 'resolved').length,
        emergencyCount: state.emergencyUnits.length
      }
    };
  }

  getStatus(): SimulationState {
    return {
      running: this.isRunning,
      paused: this.isPaused,
      simulationTime: this.simTime,
      tickRateHz: 1, // Simulated 1 tick per real second
      connected: true,
      provider: 'Prototype',
      scenario: 'NORMAL'
    };
  }

  async shutdown(): Promise<void> {
    this.pause();
  }
}
