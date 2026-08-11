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
  co2SavedTonsToday: 0,
  activeAiAgents: 8,
  emergencyCorridorsActive: 1,
  signalOptimizationEfficiency: 0,
  pedestrianSafetyScore: 0
};

export const INITIAL_INTERSECTIONS: IntersectionNode[] = [
  {
    id: 'node-1',
    name: 'Katpadi Junction',
    district: 'Katpadi',
    x: 48,
    y: 35,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 12,
    vehicleCount: 84,
    avgSpeedKmh: 45,
    densityScore: 42,
    currentPhase: 'N-S Straight & Left Protected',
    phaseTimeRemaining: 18,
    aiConfidence: 82.2,
    connectedNodes: ['node-2', 'node-3', 'node-5'],
    northSouthDensity: 55,
    eastWestDensity: 30,
    pedestrianWaiting: 8
  },
  {
    id: 'node-2',
    name: 'Sathuvachari Circle',
    district: 'Sathuvachari',
    x: 25,
    y: 28,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 8,
    vehicleCount: 62,
    avgSpeedKmh: 67,
    densityScore: 25,
    currentPhase: 'E-W Express Flow',
    phaseTimeRemaining: 32,
    aiConfidence: 86.5,
    connectedNodes: ['node-1', 'node-4'],
    northSouthDensity: 18,
    eastWestDensity: 32,
    pedestrianWaiting: 3
  },
  {
    id: 'node-3',
    name: 'VIT Main Gate Junction',
    district: 'Academic Zone',
    x: 75,
    y: 25,
    signalState: 'yellow',
    signalMode: 'autonomous_ai',
    queueLength: 22,
    vehicleCount: 110,
    avgSpeedKmh: 35,
    densityScore: 68,
    currentPhase: 'Campus Priority Clearance',
    phaseTimeRemaining: 4,
    aiConfidence: 74.1,
    connectedNodes: ['node-1', 'node-6'],
    northSouthDensity: 72,
    eastWestDensity: 64,
    pedestrianWaiting: 14
  },
  {
    id: 'node-4',
    name: 'CMC Hospital Gate',
    district: 'Medical Sector',
    x: 32,
    y: 62,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 15,
    vehicleCount: 95,
    avgSpeedKmh: 38,
    densityScore: 54,
    currentPhase: 'Pedestrian & Transit Synchronization',
    phaseTimeRemaining: 24,
    aiConfidence: 87.8,
    connectedNodes: ['node-2', 'node-5', 'node-7'],
    northSouthDensity: 48,
    eastWestDensity: 60,
    pedestrianWaiting: 28
  },
  {
    id: 'node-5',
    name: 'Long Bazaar / Scudder Road',
    district: 'Market Area',
    x: 55,
    y: 58,
    signalState: 'emergency_override',
    signalMode: 'emergency_corridor',
    queueLength: 2,
    vehicleCount: 38,
    avgSpeedKmh: 77,
    densityScore: 15,
    currentPhase: 'EMERGENCY GREEN WAVE LOCK (Emergency A17)',
    phaseTimeRemaining: 45,
    aiConfidence: 99.9,
    connectedNodes: ['node-1', 'node-4', 'node-8'],
    northSouthDensity: 10,
    eastWestDensity: 20,
    pedestrianWaiting: 2,
    incidentAlert: 'Emergency A17 Priority Corridor Active'
  },
  {
    id: 'node-6',
    name: 'Officers Line Junction',
    district: 'Government Offices',
    x: 82,
    y: 55,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 6,
    vehicleCount: 45,
    avgSpeedKmh: 50,
    densityScore: 28,
    currentPhase: 'Multi-Modal Phase',
    phaseTimeRemaining: 21,
    aiConfidence: 85.7,
    connectedNodes: ['node-3', 'node-8'],
    northSouthDensity: 24,
    eastWestDensity: 32,
    pedestrianWaiting: 19
  },
  {
    id: 'node-7',
    name: 'Thorapadi Junction',
    district: 'Residential',
    x: 18,
    y: 82,
    signalState: 'red',
    signalMode: 'autonomous_ai',
    queueLength: 34,
    vehicleCount: 140,
    avgSpeedKmh: 22,
    densityScore: 82,
    currentPhase: 'Congestion Metering Phase',
    phaseTimeRemaining: 8,
    aiConfidence: 72.4,
    connectedNodes: ['node-4', 'node-8'],
    northSouthDensity: 88,
    eastWestDensity: 76,
    pedestrianWaiting: 0,
    incidentAlert: 'Minor Congestion Metering Active'
  },
  {
    id: 'node-8',
    name: 'Gandhi Road / Balujas Junction',
    district: 'Shopping District',
    x: 65,
    y: 85,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 18,
    vehicleCount: 88,
    avgSpeedKmh: 58,
    densityScore: 38,
    currentPhase: 'Heavy Mixed Flow',
    phaseTimeRemaining: 29,
    aiConfidence: 86.0,
    connectedNodes: ['node-5', 'node-6', 'node-7'],
    northSouthDensity: 30,
    eastWestDensity: 46,
    pedestrianWaiting: 4
  }
];

export const INITIAL_CAMERA_FEEDS: CameraFeed[] = [
  {
    id: 'cam-1',
    intersectionId: 'node-1',
    title: 'CAM-101: Katpadi High-Res',
    district: 'Katpadi',
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
    title: 'CAM-304: VIT Main Gate Vision',
    district: 'Academic Zone',
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
    title: 'CAM-502: Long Bazaar Access',
    district: 'Market Area',
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
    title: 'CAM-701: Thorapadi Approach',
    district: 'Residential',
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
    origin: 'Sathuvachari Station',
    destination: 'CMC Hospital',
    currentProgress: 65,
    pathNodeIds: ['node-2', 'node-1', 'node-5'],
    status: 'en_route',
    etaSeconds: 110,
    timeSavedSeconds: 240,
    greenWaveActive: true
  },
  {
    id: 'em-2',
    callsign: 'Vellore Fire Rescue-1',
    type: 'fire_engine',
    origin: 'Vellore Fort Fire Station',
    destination: 'VIT Campus',
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
    name: 'Autonomous Downtown Loop',
    type: 'autonomous_shuttle',
    scheduleAdherenceMinutes: 0.5,
    activeVehicles: 16,
    passengerCapacityPercent: 78,
    priorityLaneStatus: 'active',
    co2ReductionKgToday: 3200,
    connectedNodes: ['node-1', 'node-3', 'node-6', 'node-5']
  },
  {
    id: 'tr-202',
    code: 'BRT-1',
    name: 'Bayfront Bus Rapid Transit',
    type: 'brt_bus',
    scheduleAdherenceMinutes: -1.2,
    activeVehicles: 24,
    passengerCapacityPercent: 88,
    priorityLaneStatus: 'active',
    co2ReductionKgToday: 8900,
    connectedNodes: ['node-2', 'node-4', 'node-7']
  },
  {
    id: 'tr-303',
    code: 'LRT-Blue',
    name: 'Cross-City Light Rail Express',
    type: 'light_rail',
    scheduleAdherenceMinutes: 0.0,
    activeVehicles: 12,
    passengerCapacityPercent: 92,
    priorityLaneStatus: 'active',
    co2ReductionKgToday: 14200,
    connectedNodes: ['node-4', 'node-5', 'node-8']
  }
];

export const INITIAL_INCIDENTS: IncidentItem[] = [
  {
    id: 'inc-101',
    title: 'Stalled Bus blocking Northbound Lane',
    location: 'Katpadi Junction',
    intersectionId: 'node-1',
    severity: 'high',
    category: 'vehicle_breakdown',
    reportedAt: '12 mins ago',
    status: 'responding',
    aiActionTaken: 'Re-routed 32% incoming traffic to alternate route; extended Southbound signal phase by +14s.',
    impactDelayMinutes: 4.5,
    coordinates: { x: 48, y: 35 }
  },
  {
    id: 'inc-102',
    title: 'Pedestrian Crowding Surge near Gate',
    location: 'CMC Hospital Gate',
    intersectionId: 'node-4',
    severity: 'medium',
    category: 'pedestrian_hazard',
    reportedAt: '5 mins ago',
    status: 'verifying',
    aiActionTaken: 'Triggered 30s All-Walk Scramble phase; notified transit routes to slow approach.',
    impactDelayMinutes: 2.1,
    coordinates: { x: 32, y: 62 }
  },
  {
    id: 'inc-103',
    title: 'Minor Auto-Rickshaw Collision in Lane 2',
    location: 'Officers Line Junction',
    intersectionId: 'node-6',
    severity: 'medium',
    category: 'accident',
    reportedAt: '24 mins ago',
    status: 'resolved',
    aiActionTaken: 'Tow dispatched; signal timings adjusted dynamically until lane cleared.',
    impactDelayMinutes: 1.0,
    coordinates: { x: 82, y: 55 }
  }
];

export const INITIAL_AGENTS: AIAgentNode[] = [
  {
    id: 'agent-master',
    name: 'City-Coordinator Alpha',
    type: 'city_coordinator',
    status: 'active',
    roleDescription: 'Global orchestrator managing citywide signal equilibrium and resource dispatch.',
    decisionsMadeToday: 0,
    latencyMs: 12,
    accuracyRate: 0,
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
    accuracyRate: 0,
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
    accuracyRate: 0,
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
    accuracyRate: 0,
    lastDecisionTime: '5s ago'
  },
  {
    id: 'agent-node1',
    name: 'Node-1 Sub-Agent (Katpadi)',
    type: 'intersection',
    status: 'active',
    assignedNodeId: 'node-1',
    roleDescription: 'Edge agent evaluating local phase splits and cross-bound queue balances.',
    decisionsMadeToday: 0,
    latencyMs: 8,
    accuracyRate: 0,
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
    confidence: 0.99,
    type: 'action'
  },
  {
    id: 'log-2',
    agentId: 'agent-pred',
    agentName: 'Prototype Heuristic Forecaster',
    timestamp: '14:28:05',
    topic: '30-Min Forecast',
    message: 'Predicted +18% queue buildup on Thorapadi Junction (Node-7) in 25 mins. Pre-allocating +12s green wave on approach.',
    confidence: 0.95,
    type: 'warning'
  },
  {
    id: 'log-3',
    agentId: 'agent-emer',
    agentName: 'Corridor Sentinel',
    timestamp: '14:27:50',
    topic: 'Corridor Lock',
    message: 'Ambulance Emergency A17 speed verified at 77kmh. Holding Long Bazaar green phase for 18 additional seconds.',
    confidence: 1.0,
    type: 'action'
  },
  {
    id: 'log-4',
    agentId: 'agent-node1',
    agentName: 'Node-1 Sub-Agent',
    timestamp: '14:27:33',
    topic: 'Peer Negotiation',
    message: 'Negotiated +6s eastbound clearance with Node-3 to alleviate Tech Corridor spillback.',
    confidence: 0.97,
    type: 'negotiation'
  }
];

export const INITIAL_CONGESTION_ZONES: CongestionRiskZone[] = [
  {
    id: 'zone-1',
    name: 'Thorapadi Bottleneck',
    district: 'Residential Gateway',
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
    name: 'VIT Campus Arterial',
    district: 'Academic Zone',
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
    name: 'CMC Pedestrian Crossing',
    district: 'Medical Sector',
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

export const INITIAL_CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'cit-101',
    reportNumber: 'REP-9041',
    category: 'traffic_light_broken',
    locationName: 'Sathuvachari Circle Crossing',
    description: 'Pedestrian push button signal flashing erratically on North crosswalk.',
    submittedAt: '18 mins ago',
    status: 'ai_verified',
    upvotes: 14,
    citizenName: 'Priya K.',
    aiVerificationConfidence: 88.4
  },
  {
    id: 'cit-102',
    reportNumber: 'REP-9038',
    category: 'hazard',
    locationName: 'Katpadi Main Road Lane 1',
    description: 'Debris/cardboard box on right shoulder near entrance.',
    submittedAt: '42 mins ago',
    status: 'dispatched',
    upvotes: 28,
    citizenName: 'Ramesh V.',
    aiVerificationConfidence: 94.2
  },
  {
    id: 'cit-103',
    reportNumber: 'REP-9012',
    category: 'pothole',
    locationName: 'VIT Ring Road',
    description: 'Deep asphalt dip causing vehicles to brake abruptly.',
    submittedAt: '2 hours ago',
    status: 'resolved',
    upvotes: 42,
    citizenName: 'Dr. Aris T.',
    aiVerificationConfidence: 99.1
  }
];

export const PRESET_SCENARIOS = [
  {
    id: 'rain-storm',
    name: 'Heavy Monsoon Storm (+40% Congestion Risk)',
    description: 'Simulate severe rainfall across the Bayfront & Bridge gateways. Reduces road friction and speeds up AI signal buffers.',
    weather: 'heavy_rain',
    trafficSurge: 35
  },
  {
    id: 'stadium-event',
    name: 'Stadium Major Event Exit (25,000 Fan Exodus)',
    description: 'Simulates a sudden surge in pedestrian crossings and AV ride-share requests near Metro Central.',
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
    name: 'Autonomous Freight Night Platooning',
    description: 'Optimizes South Port & Tech Corridor for uninterrupted heavy AV cargo convoys with low emission idle time.',
    weather: 'clear',
    trafficSurge: -20
  }
];

