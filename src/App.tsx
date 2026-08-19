import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { RoleSwitcherModal, UserRole } from './components/RoleSwitcherModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveTrafficPage } from './pages/LiveTrafficPage';
import { TrafficSignalsPage } from './pages/TrafficSignalsPage';
import { IntersectionIntelligencePage } from './pages/IntersectionIntelligencePage';
import { EmergencyCommandPage } from './pages/EmergencyCommandPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { AIAgentsPage } from './pages/AIAgentsPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CitizenReportsPage } from './pages/CitizenReportsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { CitizenPortalPage } from './pages/CitizenPortalPage';
import { AmbulanceDriverPage } from './pages/AmbulanceDriverPage';
import { FireDriverPage } from './pages/FireDriverPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';

import { GeminiAssistantModal } from './components/GeminiAssistantModal';
import { ScenarioSimulationModal } from './components/ScenarioSimulationModal';

function OperatorLayout({ 
  children, 
  currentRole,
  onOpenRoleSwitcher,
  activeIncidentsCount, 
  activeEmergencyCount, 
  onOpenAssistant, 
  onOpenScenario 
}: {
  children: React.ReactNode;
  currentRole: UserRole;
  onOpenRoleSwitcher: () => void;
  activeIncidentsCount: number;
  activeEmergencyCount: number;
  onOpenAssistant: () => void;
  onOpenScenario: () => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-cyan-500 selection:text-white overflow-hidden">
      <Sidebar 
        currentRole={currentRole}
        onOpenRoleSwitcher={onOpenRoleSwitcher}
        activeIncidentsCount={activeIncidentsCount} 
        activeEmergencyCount={activeEmergencyCount} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#f8fafc]">
        <TopHeader 
          currentRole={currentRole}
          onOpenRoleSwitcher={onOpenRoleSwitcher}
          onOpenAssistant={onOpenAssistant}
          onOpenScenario={onOpenScenario}
          activeEmergencyCount={activeEmergencyCount}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[#f8fafc] flex flex-col justify-between">
          <div className="max-w-7xl mx-auto w-full pb-8">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

function OperatorAppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Role perspective state
  const [currentRole, setCurrentRole] = useState<UserRole>('traffic_operator');
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);

  const [nodes, setNodes] = useState<IntersectionNode[]>(INITIAL_INTERSECTIONS);
  const [cameraFeeds, setCameraFeeds] = useState<CameraFeed[]>(INITIAL_CAMERA_FEEDS);
  const [emergencyUnits, setEmergencyUnits] = useState<EmergencyUnit[]>(INITIAL_EMERGENCY_UNITS);
  const [incidents, setIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  const [metrics, setMetrics] = useState<CityMetrics>(INITIAL_CITY_METRICS);
  const [vehicles, setVehicles] = useState<any[]>([]);

  // Digital Twin state hooks
  const [simEngineName, setSimEngineName] = useState<string>("Prototype Simulation Engine");
  const [timelineStage, setTimelineStage] = useState<string>("start");
  const [strategy, setStrategy] = useState<string>("ai");
  const [comparison, setComparison] = useState<any>({ avgDelaySeconds: 15, travelTimeSeconds: 180, queueLength: 4, throughput: 12, emergencyEtaSeconds: 0 });
  const [history, setHistory] = useState<any[]>([]);

  const [citizenReports, setCitizenReports] = useState<any[]>([]);

  // Intelligence State
  const [intelligenceEvents, setIntelligenceEvents] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);

  // Emergency Corridor & Digital Twin State
  const [corridors, setCorridors] = useState<any[]>([]);
  const [digitalTwinComparison, setDigitalTwinComparison] = useState<any>(null);
  const [capturedSnapshotId, setCapturedSnapshotId] = useState<string | null>(null);
  const [digitalTwinStatus, setDigitalTwinStatus] = useState<'idle' | 'capturing' | 'running' | 'completed'>('idle');

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
      const host = window.location.host || `${window.location.hostname}:3000`;
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
              lat: i.lat,
              lng: i.lng,
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
            setCitizenReports(snapshot.citizenReports || []);
            setIsSimulating(status.running && !status.paused);
            setSimEngineName(status.provider + " Simulation Engine");
            
            setCameraFeeds(message.state.cameraFeeds || INITIAL_CAMERA_FEEDS);
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

            if (message.state.corridors) setCorridors(message.state.corridors);
            if (message.state.digitalTwinComparison) {
              setDigitalTwinComparison(message.state.digitalTwinComparison);
              setDigitalTwinStatus('completed');
            }
          } else if (message.type === 'INTELLIGENCE_EVENT') {
            const ev = message.event;
            
            setIntelligenceEvents(prev => {
              const next = [ev, ...prev];
              return next.length > 50 ? next.slice(0, 50) : next;
            });

            if (ev.type === 'PREDICTION_UPDATED') {
              setPredictions(prev => {
                const idx = prev.findIndex(p => p.affectedIntersectionId === ev.data.affectedIntersectionId && p.horizonMinutes === ev.data.horizonMinutes);
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = ev.data;
                  return updated;
                }
                return [...prev, ev.data];
              });
            }

            if (ev.type === 'DIGITAL_TWIN_SNAPSHOT_CAPTURED') {
              setCapturedSnapshotId(ev.data.snapshotId);
              setDigitalTwinStatus('idle');
            }
            if (ev.type === 'DIGITAL_TWIN_RUN_COMPLETED') {
              setDigitalTwinComparison(ev.data);
              setDigitalTwinStatus('completed');
            }

            if (ev.type?.startsWith('EMERGENCY_CORRIDOR_')) {
              if (ev.data?.corridor) {
                setCorridors(prev => {
                  const idx = prev.findIndex((c: any) => c.id === ev.data.corridor.id);
                  if (idx >= 0) {
                    const updated = [...prev];
                    updated[idx] = ev.data.corridor;
                    return updated;
                  }
                  return [...prev, ev.data.corridor];
                });
              }
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

  // Handle Role Switch
  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    switch (role) {
      case 'citizen':
        navigate('/citizen-portal');
        break;
      case 'ambulance_driver':
        navigate('/ambulance-driver');
        break;
      case 'fire_driver':
        navigate('/fire-driver');
        break;
      case 'admin':
      case 'traffic_operator':
      default:
        navigate('/dashboard');
        break;
    }
  };

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

  const handleSubmitCitizenReport = (report: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'SUBMIT_CITIZEN_REPORT', report }));
    }
  };

  const handleVerifyCitizenReport = (reportId: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'VERIFY_CITIZEN_REPORT', reportId }));
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

  const handleUpdateConfigValue = (c: Partial<SimulationConfig> | ((prev: SimulationConfig) => SimulationConfig)) => {
    let nextConfig: Partial<SimulationConfig>;
    if (typeof c === 'function') {
      nextConfig = c(simConfig);
    } else {
      nextConfig = c;
    }
    setSimConfig(prev => ({ ...prev, ...nextConfig }));
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'UPDATE_CONFIG', config: nextConfig }));
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

  const handleCaptureSnapshot = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      setDigitalTwinStatus('capturing');
      socketRef.current.send(JSON.stringify({ type: 'CAPTURE_SNAPSHOT' }));
      const syntheticId = `dtsnapshot-${Date.now()}`;
      setCapturedSnapshotId(syntheticId);
      setTimeout(() => setDigitalTwinStatus('idle'), 1000);
    }
  };

  const handleRunDigitalTwin = (scenarioType: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && capturedSnapshotId) {
      setDigitalTwinStatus('running');
      socketRef.current.send(JSON.stringify({
        type: 'RUN_DIGITAL_TWIN',
        snapshotId: capturedSnapshotId,
        scenario: {
          name: scenarioType,
          description: `${scenarioType} scenario comparison`,
          scenarioType: scenarioType,
          strategy: 'ai',
          durationTicks: 50
        }
      }));
    }
  };

  const handleNavigateTab = (tab: NavigationTab) => {
    switch (tab) {
      case 'overview': navigate('/dashboard'); break;
      case 'signals': navigate('/traffic-signals'); break;
      case 'vision': navigate('/live-traffic'); break;
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
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[3000] bg-amber-500 text-slate-950 font-extrabold px-5 py-2.5 rounded-full shadow-2xl text-[11px] tracking-wider animate-pulse flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-50 animate-ping"></span>
          RECONNECTING TO CORE ENGINE...
        </div>
      )}

      {/* Offline Modal Overlay */}
      {connectionStatus === 'offline' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[3000] flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 text-xl font-bold animate-bounce shadow-lg">
            !
          </div>
          <div className="text-slate-900 font-extrabold text-base uppercase tracking-wider">OFFLINE</div>
          <p className="text-slate-600 text-xs max-w-xs text-center leading-relaxed">
            Lost connection to the SynapseCity AI Autonomous Traffic Command Engine.
          </p>
          <button 
            onClick={connectWebSocket} 
            className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      <Routes>
        {/* Public Showcase Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dedicated Zero-Password Role Selection Login Page */}
        <Route path="/role-selection" element={<RoleSelectionPage onSelectRole={handleSelectRole} />} />
        <Route path="/login" element={<RoleSelectionPage onSelectRole={handleSelectRole} />} />

        {/* Citizen Portal Pages */}
        <Route path="/citizen-portal" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
            <CitizenPortalPage
              nodes={nodes}
              citizenReports={citizenReports}
              incidents={incidents}
              onSubmitReport={handleSubmitCitizenReport}
            />
          </OperatorLayout>
        } />

        {/* Emergency Driver Navigation Cockpits */}
        <Route path="/ambulance-driver" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
            <AmbulanceDriverPage
              nodes={nodes}
              emergencyUnits={emergencyUnits}
              incidents={incidents}
              vehicles={vehicles}
              onDispatchEmergency={handleDispatchEmergency}
              onClearEmergency={handleClearEmergency}
            />
          </OperatorLayout>
        } />

        <Route path="/fire-driver" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
            <FireDriverPage
              nodes={nodes}
              emergencyUnits={emergencyUnits}
              incidents={incidents}
              vehicles={vehicles}
            />
          </OperatorLayout>
        } />

        {/* Operations Overview & Command Center */}
        <Route path="/dashboard" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
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

        <Route path="/live-traffic" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
            <LiveTrafficPage cameraFeeds={cameraFeeds} vehicles={vehicles} />
          </OperatorLayout>
        } />

        <Route path="/traffic-signals" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
            <TrafficSignalsPage nodes={nodes} />
          </OperatorLayout>
        } />

        <Route path="/intersections" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
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
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
            <EmergencyCommandPage
              emergencyUnits={emergencyUnits}
              nodes={nodes}
              onDispatchEmergency={handleDispatchEmergency}
              onClearEmergency={handleClearEmergency}
              corridors={corridors}
            />
          </OperatorLayout>
        } />

        <Route path="/predictions" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
            <PredictionsPage metrics={metrics} predictions={predictions} />
          </OperatorLayout>
        } />

        <Route path="/digital-twin" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
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
              digitalTwinComparison={digitalTwinComparison}
              digitalTwinStatus={digitalTwinStatus}
              capturedSnapshotId={capturedSnapshotId}
              onCaptureSnapshot={handleCaptureSnapshot}
              onRunDigitalTwin={handleRunDigitalTwin}
            />
          </OperatorLayout>
        } />

        <Route path="/ai-agents" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
            <AIAgentsPage 
              emergencyUnits={emergencyUnits} 
              incidents={incidents} 
              nodes={nodes} 
              intelligenceEvents={intelligenceEvents}
            />
          </OperatorLayout>
        } />

        <Route path="/citizen-reports" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
            <CitizenReportsPage 
               citizenReports={citizenReports} 
               onSubmitReport={handleSubmitCitizenReport} 
               onVerifyReport={handleVerifyCitizenReport} 
            />
          </OperatorLayout>
        } />

        <Route path="/incidents" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
            <IncidentsPage incidents={incidents} onResolveIncident={handleResolveIncident} />
          </OperatorLayout>
        } />

        <Route path="/analytics" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
            <AnalyticsPage metrics={metrics} history={history} />
          </OperatorLayout>
        } />

        <Route path="/architecture" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
            <ArchitecturePage />
          </OperatorLayout>
        } />

        <Route path="/sources" element={
          <OperatorLayout 
            currentRole={currentRole}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            activeIncidentsCount={activeIncidentsCount} 
            activeEmergencyCount={activeEmergencyCount} 
            onOpenAssistant={() => setIsAiAssistantOpen(true)} 
            onOpenScenario={() => setIsScenarioModalOpen(true)}
          >
            <DataSourcesPage />
          </OperatorLayout>
        } />
      </Routes>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
      />

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
