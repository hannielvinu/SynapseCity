export type VehicleType = 'car' | 'truck' | 'bus' | 'emergency' | 'motorcycle' | 'scooter' | 'auto_rickshaw' | 'pedestrian' | 'bicycle' | 'police' | 'fire' | 'ambulance';
export type SignalStateColor = 'RED' | 'GREEN' | 'YELLOW' | 'ALL_RED';
export type OperationalMode = 'FIXED' | 'ADAPTIVE' | 'MANUAL' | 'EMERGENCY';
export type Scenario = 'NORMAL' | 'PEAK_HOUR' | 'HEAVY_RAIN' | 'INCIDENT' | 'EMERGENCY';

export interface Vehicle {
  id: string;
  type: VehicleType;
  position: { x: number; y: number };
  speedKmh: number;
  heading: 'N' | 'S' | 'E' | 'W';
  currentRoad: string;
  currentIntersection?: string;
  destination?: string;
  status: 'moving' | 'queued' | 'delayed' | 'arrived';
}

export interface SignalPhase {
  id: string;
  name: string;
  state: SignalStateColor;
  timeRemainingSeconds: number;
  minimumGreen?: number;
  maximumGreen?: number;
}

export interface Intersection {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  x: number; // Frontend relative coords
  y: number; // Frontend relative coords
  approaches: string[];
  signalState: SignalStateColor;
  currentPhase: string;
  phaseStart: number;
  phaseEnd: number;
  queueLength: number;
  density: number;
  averageSpeedKmh: number;
  neighboringIntersections: string[];
  operationalMode: OperationalMode;
  incidentAlert?: string;
}

export interface Incident {
  id: string;
  title: string;
  location: string;
  intersectionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  reportedAt: string;
  status: 'detected' | 'verified' | 'resolved';
  impactDelayMinutes: number;
}

export interface EmergencyUnit {
  id: string;
  callsign: string;
  type: 'ambulance' | 'fire' | 'police';
  status: 'dispatching' | 'en_route' | 'arrived' | 'cleared';
  origin: string;
  destination: string;
  pathNodeIds: string[];
  currentProgress: number;
  greenWaveActive: boolean;
  etaSeconds: number;
  timeSavedSeconds?: number;
}

export interface NetworkMetrics {
  vehicleCount: number;
  averageSpeedKmh: number;
  density: number;
  queueLength: number;
  throughput: number;
  activeIncidents: number;
  emergencyCount: number;
}

export interface TrafficSnapshot {
  timestamp: number;
  simulationTime: number;
  provider: string;
  vehicles: Vehicle[];
  intersections: Intersection[];
  incidents: Incident[];
  emergencies: EmergencyUnit[];
  networkMetrics: NetworkMetrics;
}

export interface SimulationState {
  running: boolean;
  paused: boolean;
  simulationTime: number;
  tickRateHz: number;
  connected: boolean;
  provider: string;
  scenario: Scenario;
}
