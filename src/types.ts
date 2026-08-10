export type AppRoute = 
  | 'landing'
  | 'dashboard' 
  | 'traffic' 
  | 'intersections' 
  | 'emergency' 
  | 'predictions' 
  | 'digital-twin' 
  | 'agents' 
  | 'incidents' 
  | 'analytics' 
  | 'citizen-reports' 
  | 'architecture';

export type NavigationTab = 
  | 'overview' 
  | 'signals' 
  | 'vision' 
  | 'emergency' 
  | 'transit' 
  | 'predictive';

export type SignalMode = 'autonomous_ai' | 'manual_override' | 'emergency_corridor' | 'fixed_timer';

export interface IntersectionNode {
  id: string;
  name: string;
  district: string;
  x: number; // 0-100 percentage for map grid
  y: number; // 0-100 percentage for map grid
  signalState: 'green' | 'yellow' | 'red' | 'emergency_override';
  signalMode: SignalMode;
  queueLength: number; // in meters or vehicle count
  vehicleCount: number;
  avgSpeedMph: number;
  densityScore: number; // 0 - 100
  currentPhase: string;
  phaseTimeRemaining: number; // seconds
  aiConfidence: number; // percentage
  connectedNodes: string[];
  northSouthDensity: number;
  eastWestDensity: number;
  pedestrianWaiting: number;
  incidentAlert?: string;
}

export interface CameraFeed {
  id: string;
  intersectionId: string;
  title: string;
  district: string;
  status: 'active' | 'warning' | 'offline';
  streamUrlPlaceholder: string;
  detections: {
    cars: number;
    trucks: number;
    buses: number;
    bicycles: number;
    pedestrians: number;
  };
  avgSpeedMph: number;
  licensePlatesScanned: number;
  speedViolations: number;
  incidentFlag?: string;
}

export interface EmergencyUnit {
  id: string;
  callsign: string;
  type: 'ambulance' | 'fire_engine' | 'police_interceptor';
  origin: string;
  destination: string;
  currentProgress: number; // 0 to 100% along corridor
  pathNodeIds: string[];
  status: 'dispatching' | 'en_route' | 'arrived' | 'cleared';
  etaSeconds: number;
  timeSavedSeconds: number;
  greenWaveActive: boolean;
}

export interface TransitRoute {
  id: string;
  code: string;
  name: string;
  type: 'autonomous_shuttle' | 'brt_bus' | 'light_rail';
  scheduleAdherenceMinutes: number; // + or -
  activeVehicles: number;
  passengerCapacityPercent: number;
  priorityLaneStatus: 'active' | 'shared' | 'blocked';
  co2ReductionKgToday: number;
  connectedNodes: string[];
}

export interface CityMetrics {
  totalActiveVehicles: number;
  avgSpeedMph: number;
  congestionIndex: number; // 0 - 100%
  co2SavedTonsToday: number;
  activeAiAgents: number;
  emergencyCorridorsActive: number;
  signalOptimizationEfficiency: number; // %
  pedestrianSafetyScore: number; // %
}

export interface IncidentItem {
  id: string;
  title: string;
  location: string;
  intersectionId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'vehicle_breakdown' | 'accident' | 'signal_fault' | 'weather_hazard' | 'debris' | 'pedestrian_hazard';
  reportedAt: string;
  status: 'detected' | 'verifying' | 'responding' | 'resolved';
  aiActionTaken: string;
  impactDelayMinutes: number;
  coordinates: { x: number; y: number };
}

export interface AIAgentNode {
  id: string;
  name: string;
  type: 'city_coordinator' | 'predictive' | 'emergency' | 'route' | 'incident' | 'intersection';
  status: 'active' | 'optimizing' | 'idle' | 'warning';
  assignedNodeId?: string;
  roleDescription: string;
  decisionsMadeToday: number;
  latencyMs: number;
  accuracyRate: number;
  lastDecisionTime: string;
}

export interface AIAgentLog {
  id: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  topic: string;
  message: string;
  confidence: number;
  type: 'info' | 'action' | 'warning' | 'negotiation';
}

export interface CongestionRiskZone {
  id: string;
  name: string;
  district: string;
  currentDensity: number;
  predicted15m: number;
  predicted30m: number;
  predicted60m: number;
  primaryCause: string;
  recommendedIntervention: string;
  riskLevel: 'high' | 'moderate' | 'low';
  x: number;
  y: number;
}

export interface CitizenReport {
  id: string;
  reportNumber: string;
  category: 'traffic_light_broken' | 'hazard' | 'pothole' | 'accident' | 'congestion_spike';
  locationName: string;
  description: string;
  submittedAt: string;
  status: 'received' | 'ai_verified' | 'dispatched' | 'resolved';
  upvotes: number;
  citizenName: string;
  aiVerificationConfidence: number;
}

export interface SimulationConfig {
  speedMultiplier: number; // 1x, 2x, 5x
  weather: 'clear' | 'heavy_rain' | 'dense_fog' | 'snow';
  trafficSurge: number; // -50% to +100%
  activeIncidentNodeId: string | null;
  evPriorityMode: boolean;
  transitPriorityMode: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}
