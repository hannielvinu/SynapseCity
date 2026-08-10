import { IntersectionNode, CameraFeed, EmergencyUnit, CityMetrics, SimulationConfig } from '../types';
import { SimulatedVehicle } from './trafficEngine';

export interface SimulationEngineState {
  nodes: IntersectionNode[];
  cameraFeeds: CameraFeed[];
  emergencyUnits: EmergencyUnit[];
  vehicles: SimulatedVehicle[];
  metrics: CityMetrics;
}

export interface SimulationEngine {
  getName(): string;
  isAvailable(): boolean;
  tick(
    state: SimulationEngineState,
    config: SimulationConfig,
    strategy: 'baseline' | 'ai'
  ): SimulationEngineState;
}

// 1. Prototype Simulation Engine (Local, deterministic, lightweight)
export class PrototypeSimulationEngine implements SimulationEngine {
  public getName(): string {
    return "Prototype Simulation Engine (Authoritative Server Clock)";
  }

  public isAvailable(): boolean {
    return true;
  }

  public tick(
    state: SimulationEngineState,
    config: SimulationConfig,
    strategy: 'baseline' | 'ai'
  ): SimulationEngineState {
    const multiplier = config.speedMultiplier || 1;
    const surge = config.trafficSurge || 0;
    const weatherFactor = config.weather === 'heavy_rain' ? 0.75 :
                         config.weather === 'dense_fog' ? 0.6 :
                         config.weather === 'snow' ? 0.5 : 1.0;

    // A. Tick signal phases
    const nodes = state.nodes.map(node => {
      if (node.signalMode === 'manual_override') return node;
      if (node.signalState === 'emergency_override') return node;

      let remaining = node.phaseTimeRemaining - multiplier;
      let signalState = node.signalState;
      let phase = node.currentPhase;

      if (remaining <= 0) {
        remaining = 25 + Math.floor(Math.random() * 15);
        if (phase.includes('N-S')) {
          phase = 'E-W Straight & Left Turn Phase';
          signalState = 'green';
        } else {
          phase = 'N-S Straight & Pedestrian Protected';
          signalState = 'green';
        }
      } else if (remaining <= 4) {
        signalState = 'yellow';
      }

      // If strategy is baseline (fixed timers), ignore agent optimizations
      const activeMode = strategy === 'ai' ? 'autonomous_ai' : 'fixed_timer';

      return {
        ...node,
        phaseTimeRemaining: Math.max(0, remaining),
        signalState,
        currentPhase: phase,
        signalMode: activeMode as any
      };
    });

    // B. Move vehicles
    const vehicles: SimulatedVehicle[] = state.vehicles.map((veh): SimulatedVehicle => {
      const roadParts = veh.currentRoad.split('->');
      const originNode = nodes.find(n => n.id === roadParts[0]);
      const targetNode = nodes.find(n => n.id === roadParts[1]);

      if (!originNode || !targetNode) return veh;

      let isBlocked = false;
      const isApproachingEnd = veh.progress >= 90;

      if (isApproachingEnd) {
        const isNorthSouthRoad = Math.abs(originNode.y - targetNode.y) > Math.abs(originNode.x - targetNode.x);
        const signal = targetNode.signalState;

        if (signal === 'emergency_override') {
          if (veh.type !== 'emergency') {
            isBlocked = true;
          }
        } else if (signal === 'red') {
          isBlocked = true;
        } else if (signal === 'yellow') {
          isBlocked = Math.random() > 0.5;
        } else {
          // Green light checks
          const activePhaseIsNS = targetNode.currentPhase.includes('N-S');
          if (isNorthSouthRoad && !activePhaseIsNS) {
            isBlocked = true;
          } else if (!isNorthSouthRoad && activePhaseIsNS) {
            isBlocked = true;
          }
        }
      }

      let newProgress = veh.progress;
      let newStatus: 'moving' | 'queued' | 'delayed' = veh.status;
      let speed = (25 + Math.random() * 15) * weatherFactor;

      if (isBlocked) {
        newStatus = 'queued';
        speed = 0;
      } else {
        newStatus = 'moving';
        const densityPenalty = 1 - (targetNode.densityScore / 160);
        speed = Math.max(8, speed * densityPenalty);
        newProgress += (speed * 0.05 * multiplier);
      }

      if (newProgress >= 100) {
        newProgress = 0;
        const nextTargetId = targetNode.connectedNodes[Math.floor(Math.random() * targetNode.connectedNodes.length)];
        return {
          ...veh,
          currentRoad: `${targetNode.id}->${nextTargetId}`,
          progress: 0,
          originNodeId: targetNode.id,
          targetNodeId: nextTargetId,
          speedMph: speed,
          status: 'moving'
        };
      }

      return {
        ...veh,
        progress: newProgress,
        status: newStatus,
        speedMph: speed
      };
    });

    // C. Update Node density & queues
    const updatedNodes = nodes.map(node => {
      const approachingVehicles = vehicles.filter(v => v.targetNodeId === node.id);
      const vehicleCount = approachingVehicles.length;
      const queuedCount = approachingVehicles.filter(v => v.status === 'queued').length;

      const calculatedDensity = Math.min(99, Math.floor((vehicleCount * 8) + (queuedCount * 4) + (surge * 0.2)));
      const avgSpeed = Math.max(12, Math.floor(35 - (calculatedDensity * 0.22) - (weatherFactor === 1 ? 0 : 6)));

      return {
        ...node,
        vehicleCount,
        queueLength: queuedCount,
        densityScore: calculatedDensity,
        avgSpeedMph: avgSpeed
      };
    });

    // D. Update active emergency units progress
    const emergencyUnits = state.emergencyUnits.map(unit => {
      if (unit.status !== 'en_route') return unit;

      let nextProgress = unit.currentProgress + 2.5 * multiplier;
      let status: 'dispatching' | 'en_route' | 'arrived' | 'cleared' = unit.status;
      let waveActive = unit.greenWaveActive;

      if (nextProgress >= 100) {
        nextProgress = 100;
        status = 'arrived';
        waveActive = false;
      }

      return {
        ...unit,
        currentProgress: nextProgress,
        status,
        greenWaveActive: waveActive,
        etaSeconds: Math.max(0, Math.floor((100 - nextProgress) * 1.8))
      };
    });

    // E. Aggregated metrics calculation
    const avgGridSpeed = Math.floor(updatedNodes.reduce((acc, n) => acc + n.avgSpeedMph, 0) / updatedNodes.length);
    const avgCongestion = Math.floor(updatedNodes.reduce((acc, n) => acc + n.densityScore, 0) / updatedNodes.length);

    const metrics: CityMetrics = {
      ...state.metrics,
      totalActiveVehicles: vehicles.length + (surge * 2),
      avgSpeedMph: avgGridSpeed,
      congestionIndex: avgCongestion,
      co2SavedTonsToday: Math.min(45, state.metrics.co2SavedTonsToday + (multiplier * 0.001 * (1.5 - avgCongestion/60)))
    };

    // Update Camera Feeds metrics
    const cameraFeeds = state.cameraFeeds.map(cam => {
      const node = updatedNodes.find(n => n.id === cam.intersectionId);
      if (!node) return cam;

      return {
        ...cam,
        avgSpeedMph: node.avgSpeedMph,
        detections: {
          cars: Math.floor(node.vehicleCount * 0.75),
          trucks: Math.floor(node.vehicleCount * 0.15),
          buses: Math.floor(node.vehicleCount * 0.05),
          bicycles: Math.floor(node.pedestrianWaiting * 0.2),
          pedestrians: node.pedestrianWaiting
        }
      };
    });

    return {
      nodes: updatedNodes,
      cameraFeeds,
      emergencyUnits,
      vehicles,
      metrics
    };
  }
}

// 2. SUMO Simulation Engine (Placeholder for future TraCI connection)
export class SUMOSimulationEngine implements SimulationEngine {
  public getName(): string {
    return "SUMO / TraCI Simulation Engine";
  }

  public isAvailable(): boolean {
    // Label it as unavailable in local dev environment
    return false;
  }

  public tick(
    state: SimulationEngineState,
    config: SimulationConfig,
    strategy: 'baseline' | 'ai'
  ): SimulationEngineState {
    console.warn("SUMO Engine is currently unavailable. Falling back to local Prototype engine.");
    const fallback = new PrototypeSimulationEngine();
    return fallback.tick(state, config, strategy);
  }
}
