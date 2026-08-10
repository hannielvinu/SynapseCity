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
import { 
  AgentEventBus, 
  CityCoordinatorAgent, 
  IntersectionAgent, 
  TrafficPredictionAgent, 
  EmergencyAgent, 
  RouteAgent, 
  IncidentAgent,
  SimulationAgent,
  WeatherAgent,
  LiveAgentLog,
  AgentState
} from './agentSystem';
import { RoutingEngine } from './routingEngine';
import { DeterministicDecisionProvider, AIProvider } from './aiProvider';

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

  // Agent Mesh
  private bus = AgentEventBus.getInstance();
  private coordinatorAgent = new CityCoordinatorAgent();
  private predictionAgent = new TrafficPredictionAgent();
  private emergencyAgent = new EmergencyAgent();
  private routeAgent = new RouteAgent();
  private incidentAgent = new IncidentAgent();
  private simulationAgent = new SimulationAgent();
  private weatherAgent = new WeatherAgent();
  private intersectionAgents: { [id: string]: IntersectionAgent } = {};
  
  private aiProvider: AIProvider = new DeterministicDecisionProvider();

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

    // Initialize Intersection Agents
    this.nodes.forEach(node => {
      this.intersectionAgents[node.id] = new IntersectionAgent(node.id, node.name);
    });

    this.initializeVehicles();
  }

  private initializeVehicles() {
    let vehicleId = 1;
    for (const node of this.nodes) {
      for (const targetId of node.connectedNodes) {
        const count = 4 + Math.floor(Math.random() * 5);
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
    // Collect active agents list and states dynamically
    const agentsList: AgentState[] = [
      this.coordinatorAgent.getState(),
      this.predictionAgent.getState(),
      this.emergencyAgent.getState(),
      this.routeAgent.getState(),
      this.incidentAgent.getState(),
      this.simulationAgent.getState(),
      this.weatherAgent.getState(),
      ...Object.values(this.intersectionAgents).map(a => a.getState())
    ];

    return {
      nodes: this.nodes,
      cameraFeeds: this.cameraFeeds,
      emergencyUnits: this.emergencyUnits,
      incidents: this.incidents,
      citizenReports: this.citizenReports,
      vehicles: this.vehicles,
      metrics: this.metrics,
      simConfig: this.simConfig,
      agents: agentsList,
      agentLogs: this.bus.getLogs()
    };
  }

  public updateConfig(config: Partial<SimulationConfig>) {
    this.simConfig = { ...this.simConfig, ...config };
    this.simulationAgent.process();
    if (config.weather) {
      this.weatherAgent.process();
    }
  }

  public rebalanceNode(nodeId: string) {
    const agent = this.intersectionAgents[nodeId];
    if (agent) {
      agent.evaluateSignalTiming({
        density: 15, // Rebalance forces density lower
        queueLength: 0,
        currentPhase: 'N-S Straight & Left Protected',
        weather: this.simConfig.weather,
        emergencyActive: false,
        predictedCongestionRisk: 'low'
      });
    }

    this.nodes = this.nodes.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          densityScore: Math.max(10, n.densityScore - 25),
          aiConfidence: Math.min(99.9, n.aiConfidence + 2.0),
          signalState: 'green'
        };
      }
      return n;
    });

    this.bus.publish('signal.optimization', 'coordinator', { nodeId, mode: 'autonomous_ai' });
  }

  public updateNodeSignalMode(nodeId: string, mode: SignalMode) {
    this.nodes = this.nodes.map(n => (n.id === nodeId ? { ...n, signalMode: mode } : n));
    this.bus.publish('signal.optimization', nodeId, { nodeId, mode });
  }

  public updatePhaseDuration(nodeId: string, duration: number) {
    this.nodes = this.nodes.map(n => (n.id === nodeId ? { ...n, phaseTimeRemaining: duration } : n));
  }

  public dispatchEmergency(unit: Omit<EmergencyUnit, 'id'>) {
    const router = new RoutingEngine(this.nodes, this.incidents);
    const route = router.calculateRoute(unit.origin, unit.destination, this.simConfig.weather);

    const newUnit: EmergencyUnit = {
      ...unit,
      id: `em-${Date.now()}`,
      greenWaveActive: true,
      pathNodeIds: route.pathNodeIds,
      etaSeconds: route.etaSeconds,
      timeSavedSeconds: 15
    };
    this.emergencyUnits.push(newUnit);

    this.bus.publish('emergency.detected', 'emergency', newUnit);
    this.bus.publish('emergency.route.created', 'router', { callsign: newUnit.callsign, pathNodeIds: route.pathNodeIds });

    // Enable preemption lock on the first intersection node immediately
    const firstNode = route.pathNodeIds[0];
    this.nodes = this.nodes.map(n => {
      if (n.id === firstNode) {
        this.bus.publish('corridor.activated', 'emergency', { nodeId: n.id, callsign: newUnit.callsign });
        return {
          ...n,
          signalState: 'emergency_override',
          signalMode: 'emergency_corridor',
          incidentAlert: `${newUnit.callsign} Preemption Lock Active`
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
      this.bus.publish('incident.updated', 'emergency', { intersectionId: unitToClear.pathNodeIds[0], status: 'restored' });
    }
  }

  public resolveIncident(incidentId: string) {
    const incident = this.incidents.find(i => i.id === incidentId);
    this.incidents = this.incidents.map(inc => 
      inc.id === incidentId ? { ...inc, status: 'resolved' } : inc
    );

    if (incident) {
      this.bus.publish('incident.updated', 'incident', { intersectionId: incident.intersectionId, status: 'resolved' });
      // Reset signal state alert
      this.nodes = this.nodes.map(n => 
        n.id === incident.intersectionId ? { ...n, incidentAlert: undefined } : n
      );
    }
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
    this.citizenReports.unshift(newReport);

    // AI assessment converting report to active incident
    const matchedNode = this.nodes.find(n => n.name.toLowerCase().includes(report.locationName.toLowerCase())) || this.nodes[0];
    
    const newIncident: IncidentItem = {
      id: `inc-${Date.now()}`,
      title: `Reported: ${report.description}`,
      location: report.locationName,
      intersectionId: matchedNode.id,
      severity: 'medium',
      category: 'debris',
      reportedAt: new Date().toLocaleTimeString(),
      status: 'detected',
      aiActionTaken: 'Dynamic detours broadcast to adjacent route agents.',
      impactDelayMinutes: 5,
      coordinates: { x: matchedNode.x + 1.5, y: matchedNode.y - 1.5 }
    };
    
    this.incidents.unshift(newIncident);
    this.bus.publish('incident.detected', 'incident', newIncident);

    // Apply incident warning to the intersection
    this.nodes = this.nodes.map(n => 
      n.id === matchedNode.id ? { ...n, incidentAlert: report.description } : n
    );
  }

  public tick() {
    const multiplier = this.simConfig.speedMultiplier || 1;
    const surge = this.simConfig.trafficSurge || 0;
    const weatherFactor = this.simConfig.weather === 'heavy_rain' ? 0.75 :
                         this.simConfig.weather === 'dense_fog' ? 0.6 :
                         this.simConfig.weather === 'snow' ? 0.5 : 1.0;

    if (multiplier === 0) return; // Simulation paused

    // 1. Update active emergency units progress & corridor advances
    this.emergencyUnits = this.emergencyUnits.map(unit => {
      if (unit.status !== 'en_route') return unit;

      let nextProgress = unit.currentProgress + 2.5 * multiplier;
      let status: 'dispatching' | 'en_route' | 'arrived' | 'cleared' = unit.status;
      let waveActive = unit.greenWaveActive;

      // Determine vehicle's position index in pathNodeIds
      const segmentIndex = Math.min(
        unit.pathNodeIds.length - 2, 
        Math.floor((nextProgress / 100) * (unit.pathNodeIds.length - 1))
      );
      
      const currentNodeId = unit.pathNodeIds[segmentIndex];
      const nextNodeId = unit.pathNodeIds[segmentIndex + 1];

      // Green wave lock advances: Unlock previous nodes, lock upcoming nodes
      this.nodes = this.nodes.map(n => {
        if (n.id === nextNodeId) {
          // Lock upcoming
          if (n.signalState !== 'emergency_override') {
            this.bus.publish('corridor.activated', 'emergency', { nodeId: n.id, callsign: unit.callsign });
          }
          return {
            ...n,
            signalState: 'emergency_override',
            signalMode: 'emergency_corridor',
            incidentAlert: `${unit.callsign} Preemption Wave Active`
          };
        } else if (n.id === currentNodeId && nextProgress > 30) {
          // Restore passed nodes back to normal
          return {
            ...n,
            signalState: 'green',
            signalMode: 'autonomous_ai',
            incidentAlert: undefined
          };
        }
        return n;
      });

      if (nextProgress >= 100) {
        nextProgress = 100;
        status = 'arrived';
        waveActive = false;
        // Restore all corridor nodes
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
        etaSeconds: Math.max(0, Math.floor((100 - nextProgress) * 1.8))
      };
    });

    // 2. Tick intersection signal phases
    this.nodes = this.nodes.map(node => {
      if (node.signalMode === 'manual_override') return node;

      let remaining = node.phaseTimeRemaining - multiplier;
      let state = node.signalState;
      let phase = node.currentPhase;

      if (node.signalState === 'emergency_override') return node; // Controlled by preemption

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

    // 3. Move vehicles along road links
    this.vehicles = this.vehicles.map(veh => {
      const roadParts = veh.currentRoad.split('->');
      const originNode = this.nodes.find(n => n.id === roadParts[0]);
      const targetNode = this.nodes.find(n => n.id === roadParts[1]);

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

    // 4. Update Node queues, density values, and trigger Agent Decisions
    this.nodes = this.nodes.map(node => {
      const approachingVehicles = this.vehicles.filter(v => v.targetNodeId === node.id);
      const vehicleCount = approachingVehicles.length;
      const queuedCount = approachingVehicles.filter(v => v.status === 'queued').length;

      const calculatedDensity = Math.min(99, Math.floor((vehicleCount * 8) + (queuedCount * 4) + (surge * 0.2)));
      const avgSpeed = Math.max(12, Math.floor(35 - (calculatedDensity * 0.22) - (weatherFactor === 1 ? 0 : 6)));

      // Trigger Intersection Agent Decision
      const agent = this.intersectionAgents[node.id];
      const isEmergencyOnNode = this.emergencyUnits.some(u => u.greenWaveActive && u.pathNodeIds.includes(node.id));

      if (agent && Math.random() > 0.6) { // Throttled agent processing
        agent.evaluateSignalTiming({
          density: calculatedDensity,
          queueLength: queuedCount,
          currentPhase: node.currentPhase,
          weather: this.simConfig.weather,
          emergencyActive: isEmergencyOnNode,
          predictedCongestionRisk: calculatedDensity > 70 ? 'high' : 'low'
        });
      }

      // Calculate congestion prediction dynamically via Prediction Agent
      const activeIncidentOnNode = this.incidents.some(i => i.intersectionId === node.id && i.status !== 'resolved');
      this.predictionAgent.calculateCongestionForecast(node, this.simConfig.weather, activeIncidentOnNode);

      return {
        ...node,
        vehicleCount,
        queueLength: queuedCount,
        densityScore: calculatedDensity,
        avgSpeedMph: avgSpeed
      };
    });

    // 5. Update overall metrics
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
  }
}
