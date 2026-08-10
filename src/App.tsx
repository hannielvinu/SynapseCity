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

function OperatorAppContent() {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<IntersectionNode[]>(INITIAL_INTERSECTIONS);
  const [cameraFeeds, setCameraFeeds] = useState<CameraFeed[]>(INITIAL_CAMERA_FEEDS);
  const [emergencyUnits, setEmergencyUnits] = useState<EmergencyUnit[]>(INITIAL_EMERGENCY_UNITS);
  const [incidents, setIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  const [metrics, setMetrics] = useState<CityMetrics>(INITIAL_CITY_METRICS);

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

  // Live Simulation Engine Loop
  useEffect(() => {
    if (!isSimulating) return;

    const intervalTime = Math.max(200, 1500 / simConfig.speedMultiplier);

    const interval = setInterval(() => {
      // 1. Update Intersection Nodes
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          let newRemaining = node.phaseTimeRemaining - 1;
          let newPhase = node.currentPhase;
          let newSignalState = node.signalState;

          if (newRemaining <= 0) {
            newRemaining = Math.floor(Math.random() * 20) + 15;
            if (node.currentPhase.includes('N-S')) {
              newPhase = 'E-W Straight & Left Turn Phase';
              newSignalState = 'green';
            } else {
              newPhase = 'N-S Straight & Pedestrian Protected';
              newSignalState = 'green';
            }
          } else if (newRemaining <= 4 && node.signalState !== 'emergency_override') {
            newSignalState = 'yellow';
          }

          // Fluctuate density slightly based on surge
          const surgeFactor = 1 + simConfig.trafficSurge / 100;
          const randomDelta = Math.floor((Math.random() - 0.48) * 4 * surgeFactor);
          const newDensity = Math.max(10, Math.min(98, node.densityScore + randomDelta));

          return {
            ...node,
            phaseTimeRemaining: newRemaining,
            currentPhase: newPhase,
            signalState: newSignalState,
            densityScore: newDensity
          };
        })
      );

      // 2. Update Emergency Unit progress along corridor
      setEmergencyUnits((prevUnits) =>
        prevUnits.map((unit) => {
          if (unit.status !== 'en_route') return unit;

          const newProgress = unit.currentProgress + 2 * simConfig.speedMultiplier;
          if (newProgress >= 100) {
            return {
              ...unit,
              currentProgress: 100,
              status: 'arrived',
              greenWaveActive: false
            };
          }

          return {
            ...unit,
            currentProgress: newProgress,
            etaSeconds: Math.max(0, Math.floor((100 - newProgress) * 2.2))
          };
        })
      );

      // 3. Update Overall City Metrics
      setMetrics((prev) => {
        const activeCorridors = emergencyUnits.filter(u => u.greenWaveActive).length;
        return {
          ...prev,
          emergencyCorridorsActive: activeCorridors,
          totalActiveVehicles: Math.floor(14800 + Math.random() * 100 + simConfig.trafficSurge * 20)
        };
      });

    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSimulating, simConfig, emergencyUnits]);

  // Handlers
  const handleUpdateNodeSignalMode = (nodeId: string, mode: SignalMode) => {
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, signalMode: mode } : n)));
  };

  const handleUpdatePhaseDuration = (nodeId: string, phaseTime: number) => {
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, phaseTimeRemaining: phaseTime } : n)));
  };

  const handleTriggerAiRebalance = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        densityScore: Math.max(15, n.densityScore - 18),
        aiConfidence: Math.min(99.8, n.aiConfidence + 1.5)
      }))
    );
    setMetrics((prev) => ({
      ...prev,
      signalOptimizationEfficiency: Math.min(99.4, prev.signalOptimizationEfficiency + 1.2),
      congestionIndex: Math.max(12, prev.congestionIndex - 4)
    }));
  };

  const handleDispatchEmergency = (newUnitData: Omit<EmergencyUnit, 'id'>) => {
    const newId = `em-${Date.now()}`;
    const newUnit: EmergencyUnit = { ...newUnitData, id: newId };
    setEmergencyUnits((prev) => [newUnit, ...prev]);

    setNodes((prev) =>
      prev.map((n) => {
        if (newUnit.pathNodeIds.includes(n.id)) {
          return {
            ...n,
            signalState: 'emergency_override',
            signalMode: 'emergency_corridor',
            incidentAlert: `${newUnit.callsign} Priority Corridor Green Lock`
          };
        }
        return n;
      })
    );
  };

  const handleClearEmergency = (unitId: string) => {
    const unitToClear = emergencyUnits.find(u => u.id === unitId);
    setEmergencyUnits((prev) => prev.filter((u) => u.id !== unitId));

    if (unitToClear) {
      setNodes((prev) =>
        prev.map((n) => {
          if (unitToClear.pathNodeIds.includes(n.id)) {
            return {
              ...n,
              signalState: 'green',
              signalMode: 'autonomous_ai',
              incidentAlert: undefined
            };
          }
          return n;
        })
      );
    }
  };

  const handleResolveIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, status: 'resolved' } : inc))
    );
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
              isSimulating={isSimulating}
              onNavigateTab={handleNavigateTab}
              onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            />
          </OperatorLayout>
        } />

        <Route path="/traffic" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <LiveTrafficPage cameraFeeds={cameraFeeds} />
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
            <PredictionsPage metrics={metrics} />
          </OperatorLayout>
        } />

        <Route path="/digital-twin" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <DigitalTwinPage
              simulationConfig={simConfig}
              onUpdateSimulationConfig={(c) => setSimConfig(prev => ({ ...prev, ...c }))}
              isSimulating={isSimulating}
              onToggleSimulation={() => setIsSimulating(!isSimulating)}
            />
          </OperatorLayout>
        } />

        <Route path="/agents" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <AIAgentsPage emergencyUnits={emergencyUnits} incidents={incidents} nodes={nodes} />
          </OperatorLayout>
        } />

        <Route path="/incidents" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <IncidentsPage incidents={incidents} onResolveIncident={handleResolveIncident} />
          </OperatorLayout>
        } />

        <Route path="/analytics" element={
          <OperatorLayout activeIncidentsCount={activeIncidentsCount} activeEmergencyCount={activeEmergencyCount} onOpenAssistant={() => setIsAiAssistantOpen(true)} onOpenScenario={() => setIsScenarioModalOpen(true)}>
            <AnalyticsPage metrics={metrics} />
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
        setSimConfig={setSimConfig}
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
