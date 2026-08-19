import { 
  IntersectionNode, 
  CameraFeed, 
  EmergencyUnit, 
  TransitRoute, 
  CityMetrics,
  IncidentItem,
  AIAgentNode,
  AIAgentLog,
  CongestionRiskZone,
  CitizenReport
} from '../types';

export const INITIAL_CITY_METRICS: CityMetrics = {
  totalActiveVehicles: 0,
  avgSpeedKmh: 45.2,
  congestionIndex: 22,
    activeAiAgents: 8,
  emergencyCorridorsActive: 1,
  signalOptimizationEfficiency: 0,
  pedestrianSafetyScore: 0
};

export const INITIAL_INTERSECTIONS: IntersectionNode[] = [
  {
    id: 'node-1',
    name: 'Gandhipuram Signal',
    district: 'Commercial Core',
    x: 48,
    y: 35,
    lat: 11.0183,
    lng: 76.9655,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 12,
    vehicleCount: 84,
    avgSpeedKmh: 45,
    densityScore: 42,
    currentPhase: 'N-S Straight & Left Protected',
    phaseTimeRemaining: 18,
    connectedNodes: ['node-2', 'node-10'],
    northSouthDensity: 55,
    eastWestDensity: 30,
    pedestrianWaiting: 8
  },
  {
    id: 'node-2',
    name: 'Lakshmi Mills Junction',
    district: 'Avinashi Road',
    x: 60,
    y: 35,
    lat: 11.0094,
    lng: 76.9856,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 8,
    vehicleCount: 62,
    avgSpeedKmh: 67,
    densityScore: 25,
    currentPhase: 'E-W Express Flow',
    phaseTimeRemaining: 32,
    connectedNodes: ['node-1', 'node-9'],
    northSouthDensity: 18,
    eastWestDensity: 32,
    pedestrianWaiting: 3
  },
  {
    id: 'node-3',
    name: 'Hopes College Junction',
    district: 'Educational Hub',
    x: 75,
    y: 35,
    lat: 11.0264,
    lng: 77.0163,
    signalState: 'yellow',
    signalMode: 'autonomous_ai',
    queueLength: 22,
    vehicleCount: 110,
    avgSpeedKmh: 35,
    densityScore: 68,
    currentPhase: 'Transit Priority Clearance',
    phaseTimeRemaining: 4,
    connectedNodes: ['node-9', 'node-7'],
    northSouthDensity: 72,
    eastWestDensity: 64,
    pedestrianWaiting: 14
  },
  {
    id: 'node-4',
    name: 'Uppilipalayam Signal',
    district: 'Transport Hub',
    x: 32,
    y: 62,
    lat: 11.005,
    lng: 76.962,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 15,
    vehicleCount: 95,
    avgSpeedKmh: 38,
    densityScore: 54,
    currentPhase: 'Pedestrian & Transit Synchronization',
    phaseTimeRemaining: 24,
    connectedNodes: ['node-10', 'node-5'],
    northSouthDensity: 48,
    eastWestDensity: 60,
    pedestrianWaiting: 28
  },
  {
    id: 'node-5',
    name: 'Singanallur Junction',
    district: 'Trichy Road',
    x: 55,
    y: 58,
    lat: 10.9992,
    lng: 77.021,
    signalState: 'emergency_override',
    signalMode: 'emergency_corridor',
    queueLength: 2,
    vehicleCount: 38,
    avgSpeedKmh: 77,
    densityScore: 15,
    currentPhase: 'EMERGENCY GREEN WAVE LOCK (Emergency A17)',
    phaseTimeRemaining: 45,
    connectedNodes: ['node-4', 'node-7'],
    northSouthDensity: 10,
    eastWestDensity: 20,
    pedestrianWaiting: 2,
    incidentAlert: 'Emergency A17 Priority Corridor Active'
  },
  {
    id: 'node-6',
    name: 'Ukkadam Junction',
    district: 'Market / Transit Area',
    x: 20,
    y: 75,
    lat: 10.988,
    lng: 76.958,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 6,
    vehicleCount: 45,
    avgSpeedKmh: 50,
    densityScore: 28,
    currentPhase: 'Multi-Modal Phase',
    phaseTimeRemaining: 21,
    connectedNodes: ['node-4'],
    northSouthDensity: 24,
    eastWestDensity: 32,
    pedestrianWaiting: 19
  },
  {
    id: 'node-7',
    name: 'Airport Junction',
    district: 'SITRA',
    x: 90,
    y: 35,
    lat: 11.0312,
    lng: 77.0425,
    signalState: 'red',
    signalMode: 'autonomous_ai',
    queueLength: 34,
    vehicleCount: 140,
    avgSpeedKmh: 22,
    densityScore: 82,
    currentPhase: 'Congestion Metering Phase',
    phaseTimeRemaining: 8,
    connectedNodes: ['node-3', 'node-5'],
    northSouthDensity: 88,
    eastWestDensity: 76,
    pedestrianWaiting: 0,
    incidentAlert: 'Minor Congestion Metering Active'
  },
  {
    id: 'node-8',
    name: 'Cinthamani Signal',
    district: 'North Coimbatore',
    x: 40,
    y: 15,
    lat: 11.0118,
    lng: 76.951,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 18,
    vehicleCount: 88,
    avgSpeedKmh: 58,
    densityScore: 38,
    currentPhase: 'Heavy Mixed Flow',
    phaseTimeRemaining: 29,
    connectedNodes: ['node-1'],
    northSouthDensity: 30,
    eastWestDensity: 46,
    pedestrianWaiting: 4
  },
  {
    id: 'node-9',
    name: 'Nava India',
    district: 'Avinashi Road',
    x: 68,
    y: 35,
    lat: 11.021,
    lng: 76.995,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 10,
    vehicleCount: 50,
    avgSpeedKmh: 55,
    densityScore: 20,
    currentPhase: 'N-S Cross Traffic',
    phaseTimeRemaining: 12,
    connectedNodes: ['node-2', 'node-3'],
    northSouthDensity: 25,
    eastWestDensity: 22,
    pedestrianWaiting: 5
  },
  {
    id: 'node-10',
    name: 'Anna Silai',
    district: 'Avinashi Road',
    x: 35,
    y: 40,
    lat: 11.0062,
    lng: 76.9754,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 20,
    vehicleCount: 75,
    avgSpeedKmh: 42,
    densityScore: 40,
    currentPhase: 'E-W Heavy Flow',
    phaseTimeRemaining: 35,
    connectedNodes: ['node-1', 'node-4'],
    northSouthDensity: 35,
    eastWestDensity: 45,
    pedestrianWaiting: 10
  }
];

export const INITIAL_CAMERA_FEEDS: CameraFeed[] = [
  {
    id: 'cam-1',
    intersectionId: 'node-1',
    title: 'CAM-101: Gandhipuram Signal',
    district: 'Commercial Core',
    status: 'active',
    streamUrlPlaceholder: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    detections: { cars: 12, trucks: 2, buses: 3, bicycles: 7, pedestrians: 18, motorcycles: 35, scooters: 15, auto_rickshaws: 8 },
    avgSpeedKmh: 45.4,
    licensePlatesScanned: 0,
    speedViolations: 2
  },
  {
    id: 'cam-2',
    intersectionId: 'node-3',
    title: 'CAM-304: Hopes College',
    district: 'Educational Hub',
    status: 'active',
    streamUrlPlaceholder: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    detections: { cars: 5, trucks: 0, buses: 6, bicycles: 12, pedestrians: 45, motorcycles: 82, scooters: 34, auto_rickshaws: 12 },
    avgSpeedKmh: 35.1,
    licensePlatesScanned: 0,
    speedViolations: 5
  },
  {
    id: 'cam-3',
    intersectionId: 'node-5',
    title: 'CAM-502: Singanallur Terminus',
    district: 'Trichy Road',
    status: 'active',
    streamUrlPlaceholder: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80',
    detections: { cars: 14, trucks: 1, buses: 1, bicycles: 2, pedestrians: 35, motorcycles: 40, scooters: 22, auto_rickshaws: 28 },
    avgSpeedKmh: 28.0,
    licensePlatesScanned: 0,
    speedViolations: 0,
    incidentFlag: 'Emergency Siren Detected - Clearing Intersection'
  },
  {
    id: 'cam-4',
    intersectionId: 'node-7',
    title: 'CAM-701: Airport Approach',
    district: 'SITRA',
    status: 'warning',
    streamUrlPlaceholder: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    detections: { cars: 22, trucks: 4, buses: 4, bicycles: 1, pedestrians: 0, motorcycles: 55, scooters: 31, auto_rickshaws: 9 },
    avgSpeedKmh: 22.5,
    licensePlatesScanned: 0,
    speedViolations: 1,
    incidentFlag: 'Heavy Queue Density Warning'
  }
];

export const INITIAL_EMERGENCY_UNITS: EmergencyUnit[] = [
  {
    id: 'em-1',
    callsign: 'Ambulance A17',
    type: 'ambulance',
    origin: 'Coimbatore Medical College Hospital',
    destination: 'PSG Hospitals',
    currentProgress: 65,
    pathNodeIds: ['node-2', 'node-1', 'node-5'],
    status: 'en_route',
    etaSeconds: 110,
    timeSavedSeconds: 240,
    greenWaveActive: true
  },
  {
    id: 'em-2',
    callsign: 'Coimbatore Fire Rescue-1',
    type: 'fire_engine',
    origin: 'Fire Station South',
    destination: 'Gandhipuram Terminal',
    currentProgress: 20,
    pathNodeIds: ['node-4', 'node-1', 'node-3'],
    status: 'dispatching',
    etaSeconds: 310,
    timeSavedSeconds: 180,
    greenWaveActive: false
  }
];

export const INITIAL_TRANSIT_ROUTES: TransitRoute[] = [
  {
    id: 'tr-101',
    code: 'AV-101',
    name: 'Avinashi Road Express Corridor',
    type: 'autonomous_shuttle',
    scheduleAdherenceMinutes: 0.5,
    activeVehicles: 16,
    passengerCapacityPercent: 78,
    priorityLaneStatus: 'active',
        connectedNodes: ['node-1', 'node-3', 'node-6', 'node-5']
  },
  {
    id: 'tr-202',
    code: 'BRT-1',
    name: 'Trichy Road BRT',
    type: 'brt_bus',
    scheduleAdherenceMinutes: -1.2,
    activeVehicles: 24,
    passengerCapacityPercent: 88,
    priorityLaneStatus: 'active',
        connectedNodes: ['node-2', 'node-4', 'node-7']
  },
  {
    id: 'tr-303',
    code: 'MRTS-Blue',
    name: 'Mettupalayam Corridor Rail',
    type: 'light_rail',
    scheduleAdherenceMinutes: 0.0,
    activeVehicles: 12,
    passengerCapacityPercent: 92,
    priorityLaneStatus: 'active',
        connectedNodes: ['node-4', 'node-5', 'node-8']
  }
];

export const INITIAL_INCIDENTS: IncidentItem[] = [];

export const INITIAL_AGENTS: AIAgentNode[] = [
  {
    id: 'agent-master',
    name: 'City-Coordinator Alpha',
    type: 'city_coordinator',
    status: 'active',
    roleDescription: 'Global orchestrator managing citywide signal equilibrium and resource dispatch.',
    decisionsMadeToday: 0,
    latencyMs: 12,
        lastDecisionTime: 'Just now'
  },
  {
    id: 'agent-pred',
    name: 'Prototype Heuristic Forecaster',
    type: 'predictive',
    status: 'optimizing',
    roleDescription: 'Generates 15-to-60 minute traffic surge maps using statistical heuristics.',
    decisionsMadeToday: 0,
    latencyMs: 34,
        lastDecisionTime: '2s ago'
  },
  {
    id: 'agent-emer',
    name: 'Corridor Sentinel',
    type: 'emergency',
    status: 'active',
    roleDescription: 'Locks dynamic green waves for emergency response vehicles.',
    decisionsMadeToday: 0,
    latencyMs: 4,
        lastDecisionTime: '15s ago'
  },
  {
    id: 'agent-route',
    name: 'Transit Synchronizer',
    type: 'route',
    status: 'active',
    roleDescription: 'Maintains transit priorities and optimizes vehicle flow.',
    decisionsMadeToday: 0,
    latencyMs: 18,
        lastDecisionTime: '5s ago'
  },
  {
    id: 'agent-node1',
    name: 'Node-1 Sub-Agent (Gandhipuram)',
    type: 'intersection',
    status: 'active',
    assignedNodeId: 'node-1',
    roleDescription: 'Edge agent evaluating local phase splits and cross-bound queue balances.',
    decisionsMadeToday: 0,
    latencyMs: 8,
        lastDecisionTime: '1s ago'
  }
];

export const INITIAL_AGENT_LOGS: AIAgentLog[] = [
  {
    id: 'log-1',
    agentId: 'agent-master',
    agentName: 'City-Coordinator Alpha',
    timestamp: '14:28:12',
    topic: 'Global Equilibrium',
    message: 'Evaluated citywide density matrix. Congestion index down 1.4%. Signal synchronization optimized across 8 nodes.',
        type: 'action'
  },
  {
    id: 'log-2',
    agentId: 'agent-pred',
    agentName: 'Prototype Heuristic Forecaster',
    timestamp: '14:28:05',
    topic: '30-Min Forecast',
    message: 'Predicted +18% queue buildup on Airport Junction (Node-7) in 25 mins. Pre-allocating +12s green wave on approach.',
        type: 'warning'
  },
  {
    id: 'log-3',
    agentId: 'agent-emer',
    agentName: 'Corridor Sentinel',
    timestamp: '14:27:50',
    topic: 'Corridor Lock',
    message: 'Ambulance Emergency A17 speed verified at 77kmh. Holding Singanallur Terminus green phase for 18 additional seconds.',
        type: 'action'
  },
  {
    id: 'log-4',
    agentId: 'agent-node1',
    agentName: 'Node-1 Sub-Agent',
    timestamp: '14:27:33',
    topic: 'Peer Negotiation',
    message: 'Negotiated +6s eastbound clearance with Node-3 to alleviate Avinashi Road spillback.',
        type: 'negotiation'
  }
];

export const INITIAL_CONGESTION_ZONES: CongestionRiskZone[] = [
  {
    id: 'zone-1',
    name: 'Airport Road Bottleneck',
    district: 'SITRA Gateway',
    currentDensity: 82,
    predicted15m: 88,
    predicted30m: 94,
    predicted60m: 76,
    primaryCause: 'Road narrowing & peak outbound commuter traffic',
    recommendedIntervention: 'Enable dynamic metering & reroute 25% traffic via Bypass',
    riskLevel: 'high',
    x: 18,
    y: 82
  },
  {
    id: 'zone-2',
    name: 'Hopes College Arterial',
    district: 'Avinashi Road',
    currentDensity: 68,
    predicted15m: 74,
    predicted30m: 81,
    predicted60m: 62,
    primaryCause: 'High concentration of student traffic & shift exit',
    recommendedIntervention: 'Synchronize timing windows & adjust Node-3 phase splits',
    riskLevel: 'moderate',
    x: 75,
    y: 25
  },
  {
    id: 'zone-3',
    name: 'Government Hospital Pedestrian Crossing',
    district: 'Trichy Road Sector',
    currentDensity: 54,
    predicted15m: 62,
    predicted30m: 70,
    predicted60m: 45,
    primaryCause: 'Hospital arrival surge & high pedestrian footfall across road',
    recommendedIntervention: 'Activate 3-phase pedestrian scramble & prioritize transit lanes',
    riskLevel: 'moderate',
    x: 32,
    y: 62
  }
];

export const INITIAL_CITIZEN_REPORTS: CitizenReport[] = [];

export const PRESET_SCENARIOS = [
  {
    id: 'rain-storm',
    name: 'Heavy Monsoon Storm (+40% Congestion Risk)',
    description: 'Simulate severe rainfall across the Avinashi & Trichy Road gateways. Reduces road friction and speeds up AI signal buffers.',
    weather: 'heavy_rain',
    trafficSurge: 35
  },
  {
    id: 'stadium-event',
    name: 'Nehru Stadium Major Event Exit',
    description: 'Simulates a sudden surge in pedestrian crossings and auto-rickshaw ride requests near the stadium.',
    weather: 'clear',
    trafficSurge: 65
  },
  {
    id: 'emergency-surge',
    name: 'Multi-Vehicle Emergency Dispatch',
    description: 'Triggers simultaneous priority green corridors for Fire Engine 12 and Ambulance Med-7 across the central grid.',
    weather: 'clear',
    trafficSurge: 10
  },
  {
    id: 'night-freight',
    name: 'Freight Night Platooning',
    description: 'Optimizes Ukkadam & L&T Bypass for uninterrupted heavy truck convoys with low emission idle time.',
    weather: 'clear',
    trafficSurge: -20
  }
];

