import { 
  IntersectionNode, 
  CameraFeed, 
  EmergencyUnit, 
  CityMetrics, 
  IncidentItem, 
  SimulationConfig,
  SignalMode,
  CitizenReport
} from '../types';
import { 
  INITIAL_INTERSECTIONS, 
  INITIAL_CAMERA_FEEDS, 
  INITIAL_EMERGENCY_UNITS,
  INITIAL_INCIDENTS 
} from '../data/mockData';

export interface SimulatedVehicle {
  id: string;
  type: 'car' | 'truck' | 'bus' | 'emergency';
  speedMph: number;
  direction: 'N' | 'S' | 'E' | 'W';
  currentRoad: string; // e.g. "node-1->node-2"
  progress: number; // 0 to 100% along the road segment
  originNodeId: string;
  targetNodeId: string;
  status: 'moving' | 'queued' | 'delayed';
  dataSource: 'simulated';
}

export class TrafficEngine {
  private nodes: IntersectionNode[];
  private cameraFeeds: CameraFeed[];
  private emergencyUnits: EmergencyUnit[];
  private incidents: IncidentItem[];
  private citizenReports: CitizenReport[];
  private vehicles: SimulatedVehicle[];
  private metrics: CityMetrics;
  private simConfig: SimulationConfig;

  constructor() {
    this.nodes = JSON.parse(JSON.stringify(INITIAL_INTERSECTIONS));
    this.cameraFeeds = JSON.parse(JSON.stringify(INITIAL_CAMERA_FEEDS));
    this.emergencyUnits = JSON.parse(JSON.stringify(INITIAL_EMERGENCY_UNITS));
    this.incidents = JSON.parse(JSON.stringify(INITIAL_INCIDENTS));
    this.citizenReports = [];
    this.vehicles = [];
    this.simConfig = {
      speedMultiplier: 1,
      weather: 'clear',
      trafficSurge: 0,
      activeIncidentNodeId: null,
      evPriorityMode: true,
      transitPriorityMode: true
    };
    this.metrics = {
      totalActiveVehicles: 0,
      avgSpeedMph: 35,
      congestionIndex: 20,
      co2SavedTonsToday: 18.4,
      activeAiAgents: 142,
      emergencyCorridorsActive: 0,
      signalOptimizationEfficiency: 94.2,
      pedestrianSafetyScore: 98.6
    };

    this.initializeVehicles();
  }

  private initializeVehicles() {
    // Generate initial set of simulated vehicles
    let vehicleId = 1;
    for (const node of this.nodes) {
      for (const targetId of node.connectedNodes) {
        const count = 4 + Math.floor(Math.random() * 6);
        for (let i = 0; i < count; i++) {
          this.vehicles.push({
            id: `v-${vehicleId++}`,
            type: Math.random() > 0.85 ? 'truck' : Math.random() > 0.93 ? 'bus' : 'car',
            speedMph: 25 + Math.random() * 15,
            direction: Math.random() > 0.5 ? 'N' : 'E',
            currentRoad: `${node.id}->${targetId}`,
            progress: Math.random() * 100,
            originNodeId: node.id,
            targetNodeId: targetId,
            status: 'moving',
            dataSource: 'simulated'
          });
        }
      }
    }
  }

  public getFullState() {
    return {
      nodes: this.nodes,
      cameraFeeds: this.cameraFeeds,
      emergencyUnits: this.emergencyUnits,
      incidents: this.incidents,
      citizenReports: this.citizenReports,
      vehicles: this.vehicles,
      metrics: this.metrics,
      simConfig: this.simConfig
    };
  }

  public updateConfig(config: Partial<SimulationConfig>) {
    this.simConfig = { ...this.simConfig, ...config };
  }

  public rebalanceNode(nodeId: string) {
    this.nodes = this.nodes.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          densityScore: Math.max(10, n.densityScore - 20),
          aiConfidence: Math.min(99.9, n.aiConfidence + 2.0)
        };
      }
      return n;
    });
  }

  public updateNodeSignalMode(nodeId: string, mode: SignalMode) {
    this.nodes = this.nodes.map(n => (n.id === nodeId ? { ...n, signalMode: mode } : n));
  }

  public updatePhaseDuration(nodeId: string, duration: number) {
    this.nodes = this.nodes.map(n => (n.id === nodeId ? { ...n, phaseTimeRemaining: duration } : n));
  }

  public dispatchEmergency(unit: Omit<EmergencyUnit, 'id'>) {
    const newUnit: EmergencyUnit = {
      ...unit,
      id: `em-${Date.now()}`,
      greenWaveActive: true
    };
    this.emergencyUnits.push(newUnit);

    // Apply immediate overrides along path nodes
    this.nodes = this.nodes.map(n => {
      if (newUnit.pathNodeIds.includes(n.id)) {
        return {
          ...n,
          signalState: 'emergency_override',
          signalMode: 'emergency_corridor',
          incidentAlert: `${newUnit.callsign} Priority Corridor Active`
        };
      }
      return n;
    });
  }

  public clearEmergency(unitId: string) {
    const unitToClear = this.emergencyUnits.find(u => u.id === unitId);
    this.emergencyUnits = this.emergencyUnits.filter(u => u.id !== unitId);

    if (unitToClear) {
      this.nodes = this.nodes.map(n => {
        if (unitToClear.pathNodeIds.includes(n.id)) {
          return {
            ...n,
            signalState: 'green',
            signalMode: 'autonomous_ai',
            incidentAlert: undefined
          };
        }
        return n;
      });
    }
  }

  public resolveIncident(incidentId: string) {
    this.incidents = this.incidents.map(inc => 
      inc.id === incidentId ? { ...inc, status: 'resolved' } : inc
    );
  }

  public addCitizenReport(report: Omit<CitizenReport, 'id' | 'reportNumber' | 'submittedAt' | 'status' | 'upvotes' | 'aiVerificationConfidence'>) {
    const newReport: CitizenReport = {
      ...report,
      id: `rep-${Date.now()}`,
      reportNumber: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toLocaleTimeString(),
      status: 'ai_verified',
      upvotes: 1,
      aiVerificationConfidence: 94.5
    };
    this.citizenReports.push(newReport);

    // Auto-spawn corresponding incident to show on map
    const targetNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
    this.incidents.push({
      id: `inc-${Date.now()}`,
      title: `Citizen: ${report.description}`,
      location: report.locationName,
      intersectionId: targetNode.id,
      severity: 'medium',
      category: 'debris',
      reportedAt: new Date().toLocaleTimeString(),
      status: 'detected',
      aiActionTaken: 'Re-routing recommendations dispatched to adjacent lanes.',
      impactDelayMinutes: 5,
      coordinates: { x: targetNode.x + 2, y: targetNode.y + 2 }
    });
  }

  public tick() {
    const multiplier = this.simConfig.speedMultiplier || 1;
    const surge = this.simConfig.trafficSurge || 0;
    const weatherFactor = this.simConfig.weather === 'heavy_rain' ? 0.75 :
                         this.simConfig.weather === 'dense_fog' ? 0.6 :
                         this.simConfig.weather === 'snow' ? 0.5 : 1.0;

    // 1. Tick signal phases & state transitions
    this.nodes = this.nodes.map(node => {
      if (node.signalMode === 'manual_override') {
        return node;
      }

      let remaining = node.phaseTimeRemaining - multiplier;
      let state = node.signalState;
      let phase = node.currentPhase;

      if (node.signalState === 'emergency_override') {
        // Keeps green lock for emergency corridor
        return node;
      }

      if (remaining <= 0) {
        remaining = 25 + Math.floor(Math.random() * 15);
        if (phase.includes('N-S')) {
          phase = 'E-W Straight & Left Turn Phase';
          state = 'green';
        } else {
          phase = 'N-S Straight & Pedestrian Protected';
          state = 'green';
        }
      } else if (remaining <= 4) {
        state = 'yellow';
      }

      return {
        ...node,
        phaseTimeRemaining: Math.max(0, remaining),
        signalState: state,
        currentPhase: phase
      };
    });

    // 2. Move simulated vehicles along road links
    this.vehicles = this.vehicles.map(veh => {
      const roadParts = veh.currentRoad.split('->');
      const originNode = this.nodes.find(n => n.id === roadParts[0]);
      const targetNode = this.nodes.find(n => n.id === roadParts[1]);

      if (!originNode || !targetNode) return veh;

      // Check if target intersection is red for vehicle's direction
      let isBlocked = false;
      const isApproachingEnd = veh.progress >= 90;

      if (isApproachingEnd) {
        const isNorthSouthRoad = Math.abs(originNode.y - targetNode.y) > Math.abs(originNode.x - targetNode.x);
        const signal = targetNode.signalState;

        if (signal === 'emergency_override') {
          // If emergency corridor is on our node but we are NOT emergency vehicle, we are blocked
          if (veh.type !== 'emergency') {
            isBlocked = true;
          }
        } else if (signal === 'red') {
          isBlocked = true;
        } else if (signal === 'yellow') {
          isBlocked = Math.random() > 0.5; // Amber dilemma zone
        } else {
          // Green light. If it is green, N-S or E-W determines block
          const activePhaseIsNS = targetNode.currentPhase.includes('N-S');
          if (isNorthSouthRoad && !activePhaseIsNS) {
            isBlocked = true;
          } else if (!isNorthSouthRoad && activePhaseIsNS) {
            isBlocked = true;
          }
        }
      }

      let newProgress = veh.progress;
      let newStatus = veh.status;
      let speed = (25 + Math.random() * 15) * weatherFactor;

      if (isBlocked) {
        newStatus = 'queued';
        speed = 0;
      } else {
        newStatus = 'moving';
        // Speed drops as target node congestion/density grows
        const densityPenalty = 1 - (targetNode.densityScore / 150);
        speed = Math.max(8, speed * densityPenalty);
        newProgress += (speed * 0.05 * multiplier);
      }

      // If vehicle reaches end of link, route to next connected node
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

    // 3. Update active emergency units progress
    this.emergencyUnits = this.emergencyUnits.map(unit => {
      if (unit.status !== 'en_route') return unit;

      let nextProgress = unit.currentProgress + 2 * multiplier;
      let status: 'dispatching' | 'en_route' | 'arrived' | 'cleared' = unit.status;
      let waveActive = unit.greenWaveActive;

      if (nextProgress >= 100) {
        nextProgress = 100;
        status = 'arrived';
        waveActive = false;
        // Release signal lock
        this.nodes = this.nodes.map(n => {
          if (unit.pathNodeIds.includes(n.id)) {
            return {
              ...n,
              signalState: 'green',
              signalMode: 'autonomous_ai',
              incidentAlert: undefined
            };
          }
          return n;
        });
      }

      return {
        ...unit,
        currentProgress: nextProgress,
        status,
        greenWaveActive: waveActive,
        etaSeconds: Math.max(0, Math.floor((100 - nextProgress) * 2.2))
      };
    });

    // 4. Recalculate node density scores based on vehicles on approaching lanes
    this.nodes = this.nodes.map(node => {
      // Find vehicles approaching this node
      const approachingVehicles = this.vehicles.filter(v => v.targetNodeId === node.id);
      const vehicleCount = approachingVehicles.length;
      const queuedCount = approachingVehicles.filter(v => v.status === 'queued').length;

      // Mathematical interlocking: density and queues grow together
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

    // 5. Update overall city metrics
    const activeCorridors = this.emergencyUnits.filter(u => u.greenWaveActive).length;
    const avgGridSpeed = Math.floor(this.nodes.reduce((acc, n) => acc + n.avgSpeedMph, 0) / this.nodes.length);
    const avgCongestion = Math.floor(this.nodes.reduce((acc, n) => acc + n.densityScore, 0) / this.nodes.length);

    this.metrics = {
      ...this.metrics,
      totalActiveVehicles: this.vehicles.length + (surge * 2),
      avgSpeedMph: avgGridSpeed,
      congestionIndex: avgCongestion,
      emergencyCorridorsActive: activeCorridors,
      co2SavedTonsToday: Math.min(45, this.metrics.co2SavedTonsToday + (multiplier * 0.001 * (1.5 - avgCongestion/60)))
    };

    // Update Camera Feeds metrics
    this.cameraFeeds = this.cameraFeeds.map(cam => {
      const node = this.nodes.find(n => n.id === cam.intersectionId);
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
  }
}
