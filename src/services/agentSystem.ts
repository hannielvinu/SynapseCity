import { IntersectionNode, EmergencyUnit, IncidentItem, SignalMode } from '../types';

export type AgentEventType = 
  | 'prediction.created'
  | 'intersection.decision'
  | 'signal.optimization'
  | 'emergency.detected'
  | 'emergency.route.created'
  | 'corridor.activated'
  | 'incident.detected'
  | 'incident.updated'
  | 'emergency.route.recalculated';

export interface AgentEvent {
  id: string;
  type: AgentEventType;
  sender: string;
  timestamp: string;
  data: any;
}

export interface LiveAgentLog {
  id: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  topic: string;
  message: string;
    type: 'info' | 'action' | 'warning' | 'negotiation';
}

export class AgentEventBus {
  private static instance: AgentEventBus;
  private listeners: { [key: string]: ((event: AgentEvent) => void)[] } = {};
  private logs: LiveAgentLog[] = [];

  private constructor() {}

  public static getInstance(): AgentEventBus {
    if (!AgentEventBus.instance) {
      AgentEventBus.instance = new AgentEventBus();
    }
    return AgentEventBus.instance;
  }

  public subscribe(type: AgentEventType, callback: (event: AgentEvent) => void) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  public publish(type: AgentEventType, sender: string, data: any) {
    const event: AgentEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      sender,
      timestamp: new Date().toLocaleTimeString(),
      data
    };

    if (this.listeners[type]) {
      this.listeners[type].forEach(cb => cb(event));
    }

    // Auto-create log entry
    this.logEvent(event);
  }

  private logEvent(event: AgentEvent) {
    let message = "";
    let confidence = 0.95;
    let logType: LiveAgentLog['type'] = 'info';

    switch (event.type) {
      case 'prediction.created':
        message = `Congestion Forecast: Node ${event.data.nodeId} has ${event.data.riskLevel} risk of congestion in ${event.data.timeHorizon}m (${event.data.probability}% probability).`;
        confidence = event.data.probability / 100;
        logType = 'warning';
        break;
      case 'intersection.decision':
        message = `Signal Shift: Recommending ${event.data.recommendedPhase} for ${event.data.duration}s. Reason: ${event.data.reason}`;
        confidence = event.data.confidence;
        logType = 'negotiation';
        break;
      case 'signal.optimization':
        message = `Applied signal timing adjustments at Node ${event.data.nodeId}. Mode updated to ${event.data.mode}.`;
        confidence = 0.98;
        logType = 'action';
        break;
      case 'emergency.detected':
        message = `Emergency detected: ${event.data.callsign} bound for ${event.data.destination}. Originating from ${event.data.origin}.`;
        confidence = 1.0;
        logType = 'warning';
        break;
      case 'emergency.route.created':
        message = `Corridor Path lock initiated for ${event.data.callsign} through nodes: ${event.data.pathNodeIds.join(' → ')}.`;
        confidence = 0.99;
        logType = 'action';
        break;
      case 'emergency.route.recalculated':
        message = `Emergency route recalculated for ${event.data.callsign}: ${event.data.reason}. Action: ${event.data.action}.`;
        confidence = 0.98;
        logType = 'warning';
        break;
      case 'corridor.activated':
        message = `Green Wave lock enabled at Node ${event.data.nodeId} for preemption vehicle ${event.data.callsign}.`;
        confidence = 1.0;
        logType = 'action';
        break;
      case 'incident.detected':
        message = `Traffic Incident: Detected ${event.data.category} severity [${event.data.severity}] at Node ${event.data.intersectionId}.`;
        confidence = 0.92;
        logType = 'warning';
        break;
      case 'incident.updated':
        message = `Incident Resolved: Node ${event.data.intersectionId} incident status marked as ${event.data.status}.`;
        confidence = 1.0;
        logType = 'action';
        break;
    }

    this.logs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      agentId: event.sender,
      agentName: this.getAgentName(event.sender),
      timestamp: event.timestamp,
      topic: event.type,
      message,
            type: logType
    });

    // Cap logs at 50
    if (this.logs.length > 50) {
      this.logs.pop();
    }
  }

  private getAgentName(id: string): string {
    if (id.startsWith('node-')) return `Intersection Agent (${id})`;
    if (id === 'coordinator') return 'City Coordinator';
    if (id === 'prediction') return 'Predictive Traffic Agent';
    if (id === 'emergency') return 'Emergency Fleet Dispatcher';
    if (id === 'router') return 'Global Routing Engine';
    if (id === 'incident') return 'Incident Desk AI';
    return id;
  }

  public getLogs(): LiveAgentLog[] {
    return this.logs;
  }
}

export interface AgentState {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'optimizing' | 'idle' | 'warning';
  roleDescription: string;
  decisionsMadeToday: number;
  latencyMs: number;
    lastDecisionTime: string;
  inputs?: any;
  outputs?: any;
}

export abstract class BaseAgent {
  protected state: AgentState;
  protected bus = AgentEventBus.getInstance();

  constructor(id: string, name: string, type: string, description: string) {
    this.state = {
      id,
      name,
      type,
      status: 'active',
      roleDescription: description,
      decisionsMadeToday: 0,
      latencyMs: 8 + Math.floor(Math.random() * 8),
            lastDecisionTime: new Date().toLocaleTimeString()
    };
  }

  public getState(): AgentState {
    return this.state;
  }

  protected registerDecision() {
    this.state.decisionsMadeToday++;
    this.state.lastDecisionTime = new Date().toLocaleTimeString();
  }

  public abstract process(): void;
}

// 1. City Coordinator Agent
export class CityCoordinatorAgent extends BaseAgent {
  constructor() {
    super('coordinator', 'City Coordinator Agent', 'city_coordinator', 'Orchestrates city-wide traffic parameters, monitors global congestion limits, and manages emergency routes.');
  }

  public process() {}
}

// 2. Traffic Prediction Agent
export class TrafficPredictionAgent extends BaseAgent {
  constructor() {
    super('prediction', 'Predictive Traffic Agent', 'predictive', 'Leverages spatial-temporal traffic histories and weather data to forecast bottleneck probabilities 15, 30, and 60 minutes out.');
  }

  public process() {}

  public calculateCongestionForecast(node: IntersectionNode, weather: string, incidentActive: boolean) {
    const timeHorizon = [15, 30, 60];
    const baseDensity = node.densityScore;
    const weatherImpact = weather !== 'clear' ? 15 : 0;
    const incidentImpact = incidentActive ? 40 : 0;

    const forecast = timeHorizon.map(horizon => {
      const scale = horizon === 15 ? 1.05 : horizon === 30 ? 1.15 : 1.25;
      const calculatedRisk = Math.min(99, Math.floor((baseDensity * scale) + weatherImpact + incidentImpact));
      const riskLevel: 'low' | 'moderate' | 'high' = calculatedRisk > 70 ? 'high' : calculatedRisk > 40 ? 'moderate' : 'low';
      return {
        horizon,
        probability: calculatedRisk,
        riskLevel
      };
    });

    const primaryForecast = forecast[0];
    this.state.outputs = { forecast };
    this.registerDecision();

    if (primaryForecast.riskLevel === 'high') {
      this.state.status = 'warning';
      this.bus.publish('prediction.created', this.state.id, {
        nodeId: node.id,
        probability: primaryForecast.probability,
        riskLevel: primaryForecast.riskLevel,
        timeHorizon: 15
      });
    } else {
      this.state.status = 'active';
    }

    return forecast;
  }
}

// 3. Intersection Agent
export class IntersectionAgent extends BaseAgent {
  constructor(nodeId: string, name: string) {
    super(nodeId, name, 'intersection', `Manages signal phases, local approach queues, and coordinate boundaries for junction ${name.split(' & ')[0]}.`);
  }

  public process() {}

  public evaluateSignalTiming(inputs: {
    density: number;
    queueLength: number;
    currentPhase: string;
    weather: string;
    emergencyActive: boolean;
    predictedCongestionRisk: string;
  }) {
    this.state.inputs = inputs;
    this.registerDecision();

    let recommendedPhase = inputs.currentPhase;
    let duration = 25;
    let reason = "Maintaining normal phase cycles.";
    let confidence = 0.95;

    if (inputs.emergencyActive) {
      recommendedPhase = "EMERGENCY CORRIDOR GREEN WAVE LOCK";
      duration = 45;
      reason = "Emergency vehicle routing override active.";
      confidence = 1.0;
      this.state.status = 'optimizing';
    } else if (inputs.density > 75) {
      recommendedPhase = inputs.currentPhase.includes('N-S') ? 
        'N-S Straight & Pedestrian Protected (Extended)' : 
        'E-W Straight & Left Turn Phase (Extended)';
      duration = 40;
      reason = `Heavy congestion detected (${inputs.density}% density). Extending green duration for discharge clearance.`;
      confidence = 0.98;
      this.state.status = 'optimizing';
    } else if (inputs.queueLength > 15) {
      recommendedPhase = inputs.currentPhase.includes('N-S') ? 
        'N-S Straight & Left Protected' : 
        'E-W Straight & Left Turn Phase';
      duration = 35;
      reason = `Queue length exceeded threshold (${inputs.queueLength} vehicles waiting). Shifting queue clearing windows.`;
      confidence = 0.92;
      this.state.status = 'optimizing';
    } else {
      this.state.status = 'active';
    }

    this.state.outputs = {
      recommendedPhase,
      duration,
      reason,
      confidence
    };

    this.bus.publish('intersection.decision', this.state.id, {
      nodeId: this.state.id,
      recommendedPhase,
      duration,
      reason,
      confidence
    });

    return this.state.outputs;
  }
}

// 4. Emergency Agent
export class EmergencyAgent extends BaseAgent {
  constructor() {
    super('emergency', 'Emergency Agent dispatcher', 'emergency', 'Triages and locks emergency routes, activates automated priority corridors, and monitors dispatch ETAs.');
  }

  public process() {}
}

// 5. Route Agent
export class RouteAgent extends BaseAgent {
  constructor() {
    super('router', 'Global Routing Engine', 'route', 'Computes real-time dynamic routing on metropolitan connections, incorporating live incident delays.');
  }

  public process() {}
}

// 6. Incident Agent
export class IncidentAgent extends BaseAgent {
  constructor() {
    super('incident', 'Incident Desk Agent', 'incident', 'Registers active traffic incidents, evaluates severity thresholds, and dispatches dynamic re-routing commands.');
  }

  public process() {}
}

// 7. Simulation Agent
export class SimulationAgent extends BaseAgent {
  constructor() {
    super('simulation', 'Simulation Sandbox Coordinator', 'route', 'Handles sandbox updates and synchronizes calculations timing.');
  }
  public process() {}
}

// 8. Weather Agent
export class WeatherAgent extends BaseAgent {
  constructor() {
    super('weather', 'Context Context Agent', 'route', 'Monitors environmental parameters and adjusts velocity friction coefficients.');
  }
  public process() {}
}
