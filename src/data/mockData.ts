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
  totalActiveVehicles: 14850,
  avgSpeedMph: 34.2,
  congestionIndex: 22,
  co2SavedTonsToday: 18.4,
  activeAiAgents: 142,
  emergencyCorridorsActive: 1,
  signalOptimizationEfficiency: 94.2,
  pedestrianSafetyScore: 98.6
};

export const INITIAL_INTERSECTIONS: IntersectionNode[] = [
  {
    id: 'node-1',
    name: '5th Ave & Grand Blvd',
    district: 'Downtown Financial Core',
    x: 48,
    y: 35,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 12,
    vehicleCount: 84,
    avgSpeedMph: 28,
    densityScore: 42,
    currentPhase: 'N-S Straight & Left Protected',
    phaseTimeRemaining: 18,
    aiConfidence: 98.2,
    connectedNodes: ['node-2', 'node-3', 'node-5'],
    northSouthDensity: 55,
    eastWestDensity: 30,
    pedestrianWaiting: 8
  },
  {
    id: 'node-2',
    name: 'Bayfront Pkwy & Harbor Dr',
    district: 'Bayfront Maritime Sector',
    x: 25,
    y: 28,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 8,
    vehicleCount: 62,
    avgSpeedMph: 42,
    densityScore: 25,
    currentPhase: 'E-W Bayfront Express Flow',
    phaseTimeRemaining: 32,
    aiConfidence: 96.5,
    connectedNodes: ['node-1', 'node-4'],
    northSouthDensity: 18,
    eastWestDensity: 32,
    pedestrianWaiting: 3
  },
  {
    id: 'node-3',
    name: 'Innovation Way & Tech Corridor',
    district: 'Silicon Quarter',
    x: 75,
    y: 25,
    signalState: 'yellow',
    signalMode: 'autonomous_ai',
    queueLength: 22,
    vehicleCount: 110,
    avgSpeedMph: 22,
    densityScore: 68,
    currentPhase: 'AV Fleet Priority Clearance',
    phaseTimeRemaining: 4,
    aiConfidence: 94.1,
    connectedNodes: ['node-1', 'node-6'],
    northSouthDensity: 72,
    eastWestDensity: 64,
    pedestrianWaiting: 14
  },
  {
    id: 'node-4',
    name: 'Metro Central & Station Plaza',
    district: 'Transit Hub District',
    x: 32,
    y: 62,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 15,
    vehicleCount: 95,
    avgSpeedMph: 24,
    densityScore: 54,
    currentPhase: 'Pedestrian & BRT Synchronization',
    phaseTimeRemaining: 24,
    aiConfidence: 97.8,
    connectedNodes: ['node-2', 'node-5', 'node-7'],
    northSouthDensity: 48,
    eastWestDensity: 60,
    pedestrianWaiting: 28
  },
  {
    id: 'node-5',
    name: 'Junction 12 (St. Jude Hospital & 12th)',
    district: 'Medical & Emergency Center',
    x: 55,
    y: 58,
    signalState: 'emergency_override',
    signalMode: 'emergency_corridor',
    queueLength: 2,
    vehicleCount: 38,
    avgSpeedMph: 48,
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
    name: 'University Ring & Campus Way',
    district: 'Academic & Research Zone',
    x: 82,
    y: 55,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 6,
    vehicleCount: 45,
    avgSpeedMph: 31,
    densityScore: 28,
    currentPhase: 'Multi-Modal Micro-Mobility Phase',
    phaseTimeRemaining: 21,
    aiConfidence: 95.7,
    connectedNodes: ['node-3', 'node-8'],
    northSouthDensity: 24,
    eastWestDensity: 32,
    pedestrianWaiting: 19
  },
  {
    id: 'node-7',
    name: 'River Bridge Toll & Express West',
    district: 'Western River Gateway',
    x: 18,
    y: 82,
    signalState: 'red',
    signalMode: 'autonomous_ai',
    queueLength: 34,
    vehicleCount: 140,
    avgSpeedMph: 14,
    densityScore: 82,
    currentPhase: 'Dynamic Toll Metering Phase',
    phaseTimeRemaining: 8,
    aiConfidence: 92.4,
    connectedNodes: ['node-4', 'node-8'],
    northSouthDensity: 88,
    eastWestDensity: 76,
    pedestrianWaiting: 0,
    incidentAlert: 'Minor Congestion Metering Active'
  },
  {
    id: 'node-8',
    name: 'South Port Logistics & Industrial Way',
    district: 'Port & Industrial Hub',
    x: 65,
    y: 85,
    signalState: 'green',
    signalMode: 'autonomous_ai',
    queueLength: 18,
    vehicleCount: 88,
    avgSpeedMph: 36,
    densityScore: 38,
    currentPhase: 'Heavy Freight & AV Platoon Wave',
    phaseTimeRemaining: 29,
    aiConfidence: 96.0,
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
    title: 'CAM-101: 5th & Grand High-Res Vision',
    district: 'Downtown Financial',
    status: 'active',
    streamUrlPlaceholder: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    detections: { cars: 38, trucks: 4, buses: 3, bicycles: 7, pedestrians: 18 },
    avgSpeedMph: 28.4,
    licensePlatesScanned: 1420,
    speedViolations: 2
  },
  {
    id: 'cam-2',
    intersectionId: 'node-3',
    title: 'CAM-304: Tech Corridor Vision Radar',
    district: 'Silicon Quarter',
    status: 'active',
    streamUrlPlaceholder: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    detections: { cars: 52, trucks: 2, buses: 6, bicycles: 12, pedestrians: 24 },
    avgSpeedMph: 22.1,
    licensePlatesScanned: 2180,
    speedViolations: 5
  },
  {
    id: 'cam-3',
    intersectionId: 'node-5',
    title: 'CAM-502: Junction 12 Emergency Approach',
    district: 'Medical Sector',
    status: 'active',
    streamUrlPlaceholder: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80',
    detections: { cars: 14, trucks: 1, buses: 1, bicycles: 2, pedestrians: 5 },
    avgSpeedMph: 48.0,
    licensePlatesScanned: 940,
    speedViolations: 0,
    incidentFlag: 'Emergency Siren Detected - Clearing Junction 12'
  },
  {
    id: 'cam-4',
    intersectionId: 'node-7',
    title: 'CAM-701: River Bridge Toll Vision',
    district: 'Western River Gateway',
    status: 'warning',
    streamUrlPlaceholder: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    detections: { cars: 78, trucks: 12, buses: 4, bicycles: 1, pedestrians: 0 },
    avgSpeedMph: 14.5,
    licensePlatesScanned: 3100,
    speedViolations: 1,
    incidentFlag: 'Heavy Queue Density Warning'
  }
];

export const INITIAL_EMERGENCY_UNITS: EmergencyUnit[] = [
  {
    id: 'em-1',
    callsign: 'Ambulance Emergency A17',
    type: 'ambulance',
    origin: 'Bayfront Sector 2',
    destination: 'St. Jude Medical Center',
    currentProgress: 65,
    pathNodeIds: ['node-2', 'node-1', 'node-5'],
    status: 'en_route',
    etaSeconds: 110,
    timeSavedSeconds: 240,
    greenWaveActive: true
  },
  {
    id: 'em-2',
    callsign: 'Fire Rescue Engine-12',
    type: 'fire_engine',
    origin: 'Central Fire Station 4',
    destination: 'Tech Corridor Building B',
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
    title: 'Stalled EV Truck blocking Northbound Lane',
    location: 'River Bridge Toll & Express West',
    intersectionId: 'node-7',
    severity: 'high',
    category: 'vehicle_breakdown',
    reportedAt: '12 mins ago',
    status: 'responding',
    aiActionTaken: 'Re-routed 32% incoming traffic to Harbor Bypass; extended Southbound signal phase by +14s.',
    impactDelayMinutes: 4.5,
    coordinates: { x: 18, y: 82 }
  },
  {
    id: 'inc-102',
    title: 'Pedestrian Crowding Surge near Metro Plaza',
    location: 'Metro Central & Station Plaza',
    intersectionId: 'node-4',
    severity: 'medium',
    category: 'pedestrian_hazard',
    reportedAt: '5 mins ago',
    status: 'verifying',
    aiActionTaken: 'Triggered 30s All-Walk Scramble phase; notified Autonomous Shuttle Route BRT-1 to slow approach.',
    impactDelayMinutes: 2.1,
    coordinates: { x: 32, y: 62 }
  },
  {
    id: 'inc-103',
    title: 'Minor Fender Bender in Lane 2',
    location: 'Innovation Way & Tech Corridor',
    intersectionId: 'node-3',
    severity: 'medium',
    category: 'accident',
    reportedAt: '24 mins ago',
    status: 'resolved',
    aiActionTaken: 'Autonomous tow dispatched; signal timings adjusted dynamically until lane cleared.',
    impactDelayMinutes: 1.0,
    coordinates: { x: 75, y: 25 }
  }
];

export const INITIAL_AGENTS: AIAgentNode[] = [
  {
    id: 'agent-master',
    name: 'City-Coordinator Alpha',
    type: 'city_coordinator',
    status: 'active',
    roleDescription: 'Global multi-agent orchestrator managing citywide signal equilibrium and resource dispatch.',
    decisionsMadeToday: 28410,
    latencyMs: 12,
    accuracyRate: 99.8,
    lastDecisionTime: 'Just now'
  },
  {
    id: 'agent-pred',
    name: 'LSTM Congestion Forecaster',
    type: 'predictive',
    status: 'optimizing',
    roleDescription: 'Generates 15-to-60 minute traffic surge maps using spatial-temporal graph neural networks.',
    decisionsMadeToday: 14200,
    latencyMs: 34,
    accuracyRate: 96.4,
    lastDecisionTime: '2s ago'
  },
  {
    id: 'agent-emer',
    name: 'Corridor-Green Sentinel',
    type: 'emergency',
    status: 'active',
    roleDescription: 'Intersects V2X siren beacons and locks dynamic green waves for emergency response vehicles.',
    decisionsMadeToday: 412,
    latencyMs: 4,
    accuracyRate: 100.0,
    lastDecisionTime: '15s ago'
  },
  {
    id: 'agent-route',
    name: 'AV Fleet & Transit Synchronizer',
    type: 'route',
    status: 'active',
    roleDescription: 'Maintains zero-delay transit priorities and optimizes autonomous shuttle platooning.',
    decisionsMadeToday: 8930,
    latencyMs: 18,
    accuracyRate: 98.1,
    lastDecisionTime: '5s ago'
  },
  {
    id: 'agent-node1',
    name: 'Node-1 Sub-Agent (5th & Grand)',
    type: 'intersection',
    status: 'active',
    assignedNodeId: 'node-1',
    roleDescription: 'Distributed edge RL agent controlling local phase splits and cross-bound queue balances.',
    decisionsMadeToday: 4810,
    latencyMs: 8,
    accuracyRate: 97.9,
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
    agentName: 'LSTM Congestion Forecaster',
    timestamp: '14:28:05',
    topic: '30-Min Forecast',
    message: 'Predicted +18% queue buildup on River Bridge (Node-7) in 25 mins. Pre-allocating +12s green wave on approach.',
    confidence: 0.95,
    type: 'warning'
  },
  {
    id: 'log-3',
    agentId: 'agent-emer',
    agentName: 'Corridor-Green Sentinel',
    timestamp: '14:27:50',
    topic: 'Siren Lock',
    message: 'Ambulance Emergency A17 speed verified at 48mph. Holding Junction 12 green phase for 18 additional seconds.',
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
    name: 'River Bridge Bottleneck',
    district: 'Western River Gateway',
    currentDensity: 82,
    predicted15m: 88,
    predicted30m: 94,
    predicted60m: 76,
    primaryCause: 'Bridge toll lane narrowing & peak outbound commuter traffic',
    recommendedIntervention: 'Enable dynamic ramp metering & reroute 25% traffic via Harbor Expressway',
    riskLevel: 'high',
    x: 18,
    y: 82
  },
  {
    id: 'zone-2',
    name: 'Silicon Quarter Tech Arterial',
    district: 'Silicon Quarter',
    currentDensity: 68,
    predicted15m: 74,
    predicted30m: 81,
    predicted60m: 62,
    primaryCause: 'High concentration of autonomous delivery shuttles & shift exit',
    recommendedIntervention: 'Synchronize AV platoon timing windows & adjust Node-3 phase splits',
    riskLevel: 'moderate',
    x: 75,
    y: 25
  },
  {
    id: 'zone-3',
    name: 'Station Plaza Pedestrian Crossing',
    district: 'Transit Hub District',
    currentDensity: 54,
    predicted15m: 62,
    predicted30m: 70,
    predicted60m: 45,
    primaryCause: 'Train arrival surge & high pedestrian footfall across Grand Ave',
    recommendedIntervention: 'Activate 3-phase pedestrian scramble & prioritize BRT express lanes',
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
    locationName: '5th Ave & 8th Street Crossing',
    description: 'Pedestrian push button signal flashing erratically on North crosswalk.',
    submittedAt: '18 mins ago',
    status: 'ai_verified',
    upvotes: 14,
    citizenName: 'Elena Rostova',
    aiVerificationConfidence: 98.4
  },
  {
    id: 'cit-102',
    reportNumber: 'REP-9038',
    category: 'hazard',
    locationName: 'Bayfront Pkwy Lane 1',
    description: 'Debris/cardboard box on right shoulder near Harbor View entrance.',
    submittedAt: '42 mins ago',
    status: 'dispatched',
    upvotes: 28,
    citizenName: 'Marcus Vance',
    aiVerificationConfidence: 94.2
  },
  {
    id: 'cit-103',
    reportNumber: 'REP-9012',
    category: 'pothole',
    locationName: 'University Ring Road',
    description: 'Deep asphalt dip causing vehicles to brake abruptly.',
    submittedAt: '2 hours ago',
    status: 'resolved',
    upvotes: 42,
    citizenName: 'Dr. Aris Thorne',
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

