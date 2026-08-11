import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  IntersectionNode, 
  SignalMode, 
  CameraFeed, 
  EmergencyUnit, 
  CityMetrics, 
  SimulationConfig,
  IncidentItem,
  NavigationTab
} from './types';
import { 
  INITIAL_CITY_METRICS, 
  INITIAL_INTERSECTIONS, 
  INITIAL_CAMERA_FEEDS, 
  INITIAL_EMERGENCY_UNITS,
  INITIAL_INCIDENTS
} from './data/mockData';

import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { Footer } from './components/layout/Footer';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveTrafficPage } from './pages/LiveTrafficPage';
import { IntersectionIntelligencePage } from './pages/IntersectionIntelligencePage';
import { EmergencyCommandPage } from './pages/EmergencyCommandPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { AIAgentsPage } from './pages/AIAgentsPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CitizenReportsPage } from './pages/CitizenReportsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';

import { GeminiAssistantModal } from './components/GeminiAssistantModal';
import { ScenarioSimulationModal } from './components/ScenarioSimulationModal';

function OperatorLayout({ children, activeIncidentsCount, activeEmergencyCount, onOpenAssistant, onOpenScenario }: {
  children: React.ReactNode;
  activeIncidentsCount: number;
  activeEmergencyCount: number;
  onOpenAssistant: () => void;
  onOpenScenario: () => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#070B12] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-hidden">
      <Sidebar 
        activeIncidentsCount={activeIncidentsCount} 
        activeEmergencyCount={activeEmergencyCount} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopHeader 
          onOpenAssistant={onOpenAssistant}
          onOpenScenario={onOpenScenario}
          activeEmergencyCount={activeEmergencyCount}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[#070B12] flex flex-col justify-between">
          <div className="max-w-7xl mx-auto w-full pb-8">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

import { useRef, useCallback } from 'react';

function OperatorAppContent() {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<IntersectionNode[]>(INITIAL_INTERSECTIONS);
  const [cameraFeeds, setCameraFeeds] = useState<CameraFeed[]>(INITIAL_CAMERA_FEEDS);
  const [emergencyUnits, setEmergencyUnits] = useState<EmergencyUnit[]>(INITIAL_EMERGENCY_UNITS);
  const [incidents, setIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  const [metrics, setMetrics] = useState<CityMetrics>(INITIAL_CITY_METRICS);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);

  // Digital Twin state hooks
  const [simEngineName, setSimEngineName] = useState<string>("Prototype Simulation Engine");
  const [timelineStage, setTimelineStage] = useState<string>("start");
  const [strategy, setStrategy] = useState<string>("ai");
  const [comparison, setComparison] = useState<any>({ avgDelaySeconds: 15, travelTimeSeconds: 180, queueLength: 4, throughput: 12, emergencyEtaSeconds: 0 });
  const [history, setHistory] = useState<any[]>([]);

  // Phase 3 Intelligence State
  const [intelligenceEvents, setIntelligenceEvents] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-1');
  const [isSimulating, setIsSimulating] = useState(true);

  const [simConfig, setSimConfig] = useState<SimulationConfig>({
    speedMultiplier: 1,
    weather: 'clear',
    trafficSurge: 0,
    activeIncidentNodeId: null,
    evPriorityMode: true,
    transitPriorityMode: true
  });

  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);

  // WebSocket Connection State
  const socketRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'reconnecting' | 'offline'>('connecting');

  const connectWebSocket = useCallback(() => {
    let attempts = 0;
    const maxAttempts = 5;

    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = `${window.location.hostname}:3000`;
      const wsUrl = `${protocol}//${host}`;

      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        attempts = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'INIT' || message.type === 'UPDATE') {
            const { snapshot, status } = message.state;
            
            // Map canonical intersections to frontend legacy nodes
            const mappedNodes = snapshot.intersections.map((i: any) => ({
              id: i.id,
              name: i.name,
              district: "Central",
              x: i.x,
              y: i.y,
              signalState: i.signalState.toLowerCase() === 'all_red' ? 'red' : i.signalState.toLowerCase(),
              signalMode: i.operationalMode.toLowerCase() === 'adaptive' ? 'autonomous_ai' : 'fixed_timer',
              queueLength: i.queueLength,
              vehicleCount: Math.floor(i.density / 2),
              avgSpeedKmh: i.averageSpeedKmh,
              densityScore: i.density,
              currentPhase: i.currentPhase,
              phaseTimeRemaining: i.phaseEnd,
              aiConfidence: 98,
              connectedNodes: i.neighboringIntersections || i.approaches,
              northSouthDensity: Math.floor(i.density / 2),
              eastWestDensity: Math.floor(i.density / 2),
              pedestrianWaiting: 0,
              incidentAlert: i.incidentAlert
            }));

            const mappedMetrics = {
              totalActiveVehicles: snapshot.networkMetrics.vehicleCount,
              avgSpeedKmh: snapshot.networkMetrics.averageSpeedKmh,
              congestionIndex: snapshot.networkMetrics.density,
              co2SavedTonsToday: 42,
              activeAiAgents: 8,
              emergencyCorridorsActive: snapshot.networkMetrics.emergencyCount,
              signalOptimizationEfficiency: 94,
              pedestrianSafetyScore: 91
            };

            setNodes(mappedNodes);
            setMetrics(mappedMetrics);
            setVehicles(snapshot.vehicles || []);
            setIncidents(snapshot.incidents || []);
            setEmergencyUnits(snapshot.emergencies || []);
            setIsSimulating(status.running && !status.paused);
            setSimEngineName(status.provider + " Simulation Engine");
            
            // For now, these legacy fields are gracefully mocked to prevent UI crashes 
            // since they are not part of the core canonical traffic state yet.
            setCameraFeeds(message.state.cameraFeeds || []);
            setAgents(message.state.agents || []);
            setAgentLogs(message.state.agentLogs || []);
            if (message.state.simConfig) setSimConfig(message.state.simConfig);
            setTimelineStage(message.state.timelineStage || "start");
            setStrategy(message.state.strategy || "ai");
            setComparison(message.state.comparison || {
              avgDelaySeconds: 40,
              travelTimeSeconds: 480,
              queueLength: mappedNodes.reduce((acc: number, n: any) => acc + n.queueLength, 0),
              throughput: snapshot.networkMetrics.vehicleCount,
              emergencyEtaSeconds: 0
            });
            setHistory(message.state.history || []);
          } else if (message.type === 'INTELLIGENCE_EVENT') {
            const ev = message.event;
            
            setIntelligenceEvents(prev => {
              const next = [ev, ...prev];
              return next.length > 50 ? next.slice(0, 50) : next;
            });

            if (ev.type === 'PREDICTION_UPDATED') {
              setPredictions(prev => {
                // Upsert based on intersection and horizon
                const idx = prev.findIndex(p => p.affectedIntersectionId === ev.data.affectedIntersectionId && p.horizonMinutes === ev.data.horizonMinutes);
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = ev.data;
                  return updated;
                }
                return [...prev, ev.data];
              });
            }
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message', e);
        }
      };

      ws.onclose = () => {
        if (attempts < maxAttempts) {
          setConnectionStatus('reconnecting');
          attempts++;
          setTimeout(connect, 3000);
        } else {
          setConnectionStatus('offline');
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // Command handlers sending messages over WebSockets
  const handleUpdateNodeSignalMode = (nodeId: string, mode: SignalMode) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'UPDATE_SIGNAL_MODE', nodeId, mode }));
    }
  };

  const handleUpdatePhaseDuration = (nodeId: string, phaseTime: number) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'UPDATE_PHASE_DURATION', nodeId, duration: phaseTime }));
    }
  };

  const handleTriggerAiRebalance = (nodeId: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'REBALANCE', nodeId }));
    }
  };

  const handleDispatchEmergency = (newUnitData: Omit<EmergencyUnit, 'id'>) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'DISPATCH_EMERGENCY', unit: newUnitData }));
    }
  };

  const handleClearEmergency = (unitId: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'CLEAR_EMERGENCY', unitId }));
    }
  };

  const handleResolveIncident = (incidentId: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'RESOLVE_INCIDENT', incidentId }));
    }
  };

  const handleToggleSimulation = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const nextMultiplier = isSimulating ? 0 : 1;
      socketRef.current.send(JSON.stringify({ 
        type: 'UPDATE_CONFIG', 
        config: { ...simConfig, speedMultiplier: nextMultiplier } 
      }));
    }
  };

  const handleUpdateConfigValue = (c: Partial<SimulationConfig>) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'UPDATE_CONFIG', config: c }));
    }
  };

  const handleResetSimulation = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'RESET_SIMULATION' }));
    }
  };

  const handleSetStrategy = (s: 'baseline' | 'ai') => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'SET_STRATEGY', strategy: s }));
    }
  };

  const handleSaveRun = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'SAVE_RUN' }));
    }
  };

  const handleSetSumoEnabled = (enabled: boolean) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'SET_SUMO_ENABLED', enabled }));
    }
  };

  const handleNavigateTab = (tab: NavigationTab) => {
    switch (tab) {
      case 'overview': navigate('/dashboard'); break;
      case 'signals': navigate('/intersections'); break;
      case 'vision': navigate('/traffic'); break;
      case 'emergency': navigate('/emergency'); break;
      case 'transit': navigate('/digital-twin'); break;
      case 'predictive': navigate('/predictions'); break;
      default: navigate('/dashboard'); break;
    }
  };

  const activeEmergencyCount = emergencyUnits.filter(u => u.greenWaveActive).length;
  const activeIncidentsCount = incidents.filter(i => i.status !== 'resolved').length;

  return (
    <>
      {/* Reconnecting Toast banner */}
      {connectionStatus === 'reconnecting' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-extrabold px-5 py-2.5 rounded-full shadow-2xl text-[11px] tracking-wider animate-pulse flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
          RECONNECTING TO CORE ENGINE...
        </div>
      )}

      {/* Offline Modal Overlay */}
      {connectionStatus === 'offline' && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 text-xl font-bold animate-bounce">
            !
          </div>
          <div className="text-white font-extrabold text-base uppercase tracking-wider">OFFLINE</div>
          <p className="text-slate-400 text-xs max-w-xs text-center leading-relaxed">
            Lost connection to the SynapseCity AI Autonomous Traffic Command Engine.
          </p>
          <button 
            onClick={connectWebSocket} 
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg"
          >
            Retry Connection
          </button>
        </div>
      )}

      <Routes>
        {/* Public Showcase Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Operator App Pages */}
        <Route path="/dashboard" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <DashboardPage
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              metrics={metrics}
              emergencyUnits={emergencyUnits}
              cameraFeeds={cameraFeeds}
              vehicles={vehicles}
              intelligenceEvents={intelligenceEvents}
              predictions={predictions}
              isSimulating={isSimulating}
              onNavigateTab={handleNavigateTab}
              onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            />
          </OperatorLayout>
        } />

        <Route path="/traffic" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <LiveTrafficPage cameraFeeds={cameraFeeds} vehicles={vehicles} />
          </OperatorLayout>
        } />

        <Route path="/intersections" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <IntersectionIntelligencePage
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              onUpdateNodeSignalMode={handleUpdateNodeSignalMode}
              onUpdatePhaseDuration={handleUpdatePhaseDuration}
              onTriggerAiRebalance={handleTriggerAiRebalance}
            />
          </OperatorLayout>
        } />

        <Route path="/emergency" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <EmergencyCommandPage
              emergencyUnits={emergencyUnits}
              nodes={nodes}
              onDispatchEmergency={handleDispatchEmergency}
              onClearEmergency={handleClearEmergency}
            />
          </OperatorLayout>
        } />

        <Route path="/predictions" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <PredictionsPage metrics={metrics} predictions={predictions} />
          </OperatorLayout>
        } />

        <Route path="/digital-twin" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <DigitalTwinPage
              simulationConfig={simConfig}
              onUpdateSimulationConfig={handleUpdateConfigValue}
              isSimulating={isSimulating}
              onToggleSimulation={handleToggleSimulation}
              simEngineName={simEngineName}
              timelineStage={timelineStage}
              strategy={strategy}
              comparison={comparison}
              history={history}
              onResetSimulation={handleResetSimulation}
              onSetStrategy={handleSetStrategy}
              onSaveRun={handleSaveRun}
              onSetSumoEnabled={handleSetSumoEnabled}
            />
          </OperatorLayout>
        } />

        <Route path="/agents" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <AIAgentsPage 
              emergencyUnits={emergencyUnits} 
              incidents={incidents} 
              nodes={nodes} 
              intelligenceEvents={intelligenceEvents}
            />
          </OperatorLayout>
        } />

        <Route path="/incidents" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <IncidentsPage incidents={incidents} onResolveIncident={handleResolveIncident} />
          </OperatorLayout>
        } />

        <Route path="/analytics" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <AnalyticsPage metrics={metrics} history={history} />
          </OperatorLayout>
        } />

        <Route path="/citizen-reports" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <CitizenReportsPage />
          </OperatorLayout>
        } />

        <Route path="/architecture" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <ArchitecturePage />
          </OperatorLayout>
        } />
      </Routes>

      {/* Gemini AI Co-Pilot Modal */}
      <GeminiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        metrics={metrics}
      />

      {/* Scenario Simulation Sandbox Modal */}
      <ScenarioSimulationModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        simConfig={simConfig}
        setSimConfig={handleUpdateConfigValue}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <OperatorAppContent />
    </BrowserRouter>
  );
}
