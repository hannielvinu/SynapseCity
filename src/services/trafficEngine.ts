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
import { SimulationEngine, PrototypeSimulationEngine, SUMOSimulationEngine } from './simulationEngine';
import { SimulationHistory, SimulationRun, SimulationResult } from './simulationHistory';

export interface SimulatedVehicle {
  id: string;
  type: 'car' | 'truck' | 'bus' | 'emergency' | 'motorcycle' | 'scooter' | 'auto_rickshaw';
  speedKmh: number;
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

  // Pluggable Simulation Engines
  private activeSimEngine: SimulationEngine = new PrototypeSimulationEngine();
  private sumoSimEngine = new SUMOSimulationEngine();
  private configUseSumo: boolean = false; // Enabled through configuration

  // Strategy & Timeline States
  private activeStrategy: 'baseline' | 'ai' = 'ai';
  private timelineStage: 'start' | 'congestion' | 'prediction' | 'intervention' | 'recovery' = 'start';
  private simHistory = new SimulationHistory();
  private tickCount: number = 0;

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
      avgSpeedKmh: 45,
      congestionIndex: 20,
      co2SavedTonsToday: 0,
      activeAiAgents: 8,
      emergencyCorridorsActive: 0,
      signalOptimizationEfficiency: 0,
      pedestrianSafetyScore: 0
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
          const rand = Math.random();
          const vehicleType = rand > 0.95 ? 'truck' : rand > 0.90 ? 'bus' : rand > 0.60 ? 'car' : rand > 0.30 ? 'motorcycle' : rand > 0.15 ? 'scooter' : 'auto_rickshaw';
          this.vehicles.push({
            id: `v-${vehicleId++}`,
            type: vehicleType,
            speedKmh: 35 + Math.random() * 25,
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

    // Compute strategy comparisons dynamically
    const baseCongestion = this.metrics.congestionIndex;
    const isAi = this.activeStrategy === 'ai';
    const delay = isAi ? Math.max(12, 60 - (this.metrics.avgSpeedKmh)) : Math.max(25, 90 - (this.metrics.avgSpeedKmh));
    
    const comparison: SimulationResult = {
      avgDelaySeconds: delay,
      travelTimeSeconds: delay * 12,
      queueLength: this.nodes.reduce((acc, n) => acc + n.queueLength, 0),
      throughput: this.vehicles.length + (isAi ? 150 : 0),
      emergencyEtaSeconds: this.emergencyUnits.length > 0 ? this.emergencyUnits[0].etaSeconds : 0
    };

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
      agentLogs: this.bus.getLogs(),
      // Digital Twin properties
      simEngineName: this.configUseSumo ? this.sumoSimEngine.getName() : this.activeSimEngine.getName(),
      timelineStage: this.timelineStage,
      strategy: this.activeStrategy,
      comparison,
      history: this.simHistory.getHistory()
    };
  }

  public updateConfig(config: Partial<SimulationConfig>) {
    this.simConfig = { ...this.simConfig, ...config };
    this.simulationAgent.process();
    if (config.weather) {
      this.weatherAgent.process();
    }
  }

  public setStrategy(strategy: 'baseline' | 'ai') {
    this.activeStrategy = strategy;
    this.bus.publish('signal.optimization', 'coordinator', { nodeId: 'all', mode: strategy === 'ai' ? 'autonomous_ai' : 'fixed_timer' });
  }

  public setSumoEnabled(enabled: boolean) {
    this.configUseSumo = enabled;
  }

  public saveCurrentRun() {
    const isAi = this.activeStrategy === 'ai';
    const delay = isAi ? Math.max(12, 60 - (this.metrics.avgSpeedKmh)) : Math.max(25, 90 - (this.metrics.avgSpeedKmh));
    
    this.simHistory.addRun({
      config: {
        trafficSurge: this.simConfig.trafficSurge,
        weather: this.simConfig.weather,
        speedMultiplier: this.simConfig.speedMultiplier
      },
      strategy: this.activeStrategy,
      results: {
        avgDelaySeconds: delay,
        travelTimeSeconds: delay * 12,
        queueLength: this.nodes.reduce((acc, n) => acc + n.queueLength, 0),
        throughput: this.vehicles.length + (isAi ? 150 : 0),
        emergencyEtaSeconds: this.emergencyUnits.length > 0 ? this.emergencyUnits[0].etaSeconds : 0
      }
    });
  }

  public rebalanceNode(nodeId: string) {
    const agent = this.intersectionAgents[nodeId];
    if (agent) {
      agent.evaluateSignalTiming({
        density: 15,
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

  public forceSignalPhase(nodeId: string, phase: string, duration: number) {
    this.nodes = this.nodes.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          currentPhase: phase,
          signalState: 'green' // Reset to green for the new phase
          // In a real implementation we would track time remaining based on duration
        };
      }
      return n;
    });
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
          // Safe restoration: do not force green. Just lift the emergency lock.
          // The engine's normal tick cycle will handle clearance phases safely.
          const isAnotherEmergency = this.emergencyUnits.some(u => u.greenWaveActive && u.pathNodeIds.includes(n.id));
          return {
            ...n,
            signalMode: isAnotherEmergency ? 'emergency_corridor' : 'autonomous_ai',
            incidentAlert: isAnotherEmergency ? n.incidentAlert : undefined
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

    this.nodes = this.nodes.map(n => 
      n.id === matchedNode.id ? { ...n, incidentAlert: report.description } : n
    );
  }

  public resetSimulation() {
    this.nodes = JSON.parse(JSON.stringify(INITIAL_INTERSECTIONS));
    this.cameraFeeds = JSON.parse(JSON.stringify(INITIAL_CAMERA_FEEDS));
    this.emergencyUnits = JSON.parse(JSON.stringify(INITIAL_EMERGENCY_UNITS));
    this.incidents = JSON.parse(JSON.stringify(INITIAL_INCIDENTS));
    this.citizenReports = [];
    this.vehicles = [];
    this.tickCount = 0;
    this.timelineStage = 'start';
    this.simConfig.trafficSurge = 0;
    this.initializeVehicles();
  }

  public tick() {
    const multiplier = this.simConfig.speedMultiplier || 1;
    if (multiplier === 0) return; // Simulation paused

    this.tickCount += multiplier;

    // 1. Advance simulation timeline stages based on ticks and configs
    if (this.tickCount < 15) {
      this.timelineStage = 'start';
    } else if (this.tickCount < 30) {
      this.timelineStage = 'congestion';
      this.simConfig.trafficSurge = 60; // Auto-increase surge to simulate congestion formation
    } else if (this.tickCount < 45) {
      this.timelineStage = 'prediction';
    } else if (this.tickCount < 60) {
      this.timelineStage = 'intervention';
      this.activeStrategy = 'ai';
    } else {
      this.timelineStage = 'recovery';
      this.simConfig.trafficSurge = 0; // Recover back to normal
    }

    // 2. Delegate state calculation to active SimulationEngine
    const engine = this.configUseSumo ? this.sumoSimEngine : this.activeSimEngine;
    
    const updatedState = engine.tick(
      {
        nodes: this.nodes,
        cameraFeeds: this.cameraFeeds,
        emergencyUnits: this.emergencyUnits,
        vehicles: this.vehicles,
        metrics: this.metrics
      },
      this.simConfig,
      this.activeStrategy
    );

    this.nodes = updatedState.nodes;
    this.cameraFeeds = updatedState.cameraFeeds;
    this.emergencyUnits = updatedState.emergencyUnits;
    this.vehicles = updatedState.vehicles;
    this.metrics = updatedState.metrics;

    // Update active emergency units progress
    this.emergencyUnits = this.emergencyUnits.map(unit => {
      if (unit.status !== 'en_route') return unit;

      let nextProgress = unit.currentProgress + 2.5 * multiplier;
      let status: 'dispatching' | 'en_route' | 'arrived' | 'cleared' = unit.status;
      let waveActive = unit.greenWaveActive;

      const segmentIndex = Math.min(
        unit.pathNodeIds.length - 2, 
        Math.floor((nextProgress / 100) * (unit.pathNodeIds.length - 1))
      );
      
      const currentNodeId = unit.pathNodeIds[segmentIndex];
      const nextNodeId = unit.pathNodeIds[segmentIndex + 1];

      // Green wave locks updates
      this.nodes = this.nodes.map(n => {
        if (n.id === nextNodeId) {
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

    // 3. Trigger Agent optimizations on nodes
    this.nodes = this.nodes.map(node => {
      const agent = this.intersectionAgents[node.id];
      const isEmergencyOnNode = this.emergencyUnits.some(u => u.greenWaveActive && u.pathNodeIds.includes(node.id));

      if (agent && Math.random() > 0.6) {
        agent.evaluateSignalTiming({
          density: node.densityScore,
          queueLength: node.queueLength,
          currentPhase: node.currentPhase,
          weather: this.simConfig.weather,
          emergencyActive: isEmergencyOnNode,
          predictedCongestionRisk: node.densityScore > 70 ? 'high' : 'low'
        });
      }

      const activeIncidentOnNode = this.incidents.some(i => i.intersectionId === node.id && i.status !== 'resolved');
      this.predictionAgent.calculateCongestionForecast(node, this.simConfig.weather, activeIncidentOnNode);

      return node;
    });
  }
}
