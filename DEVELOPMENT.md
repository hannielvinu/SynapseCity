# SynapseCity AI — Urban Mobility OS Engineering Handoff

## 1. Project Purpose
**SynapseCity AI** is an Autonomous Metropolitan Traffic Management Platform designed for Smart City Traffic Operations Centers (TOC), Transit Authorities, and Emergency First Responders.
It unifies computer vision edge feeds, V2X emergency preemption green wave corridors, multi-agent reinforcement learning (RL) signal optimization, predictive congestion LSTM modeling, and citizen reporting.

---

## 2. Page & Route Registry

| Route | Page Component | Purpose |
| :--- | :--- | :--- |
| `/` | `LandingPage.tsx` | Showcase landing & system architecture landing |
| `/dashboard` | `DashboardPage.tsx` | Operator Command Center Overview (Map + KPIs + Live Alerts) |
| `/traffic` | `LiveTrafficPage.tsx` | Computer Vision Edge Camera Feeds & AI Detection |
| `/intersections` | `IntersectionIntelligencePage.tsx` | Junction Signal Optimization & Phase Timing Control |
| `/emergency` | `EmergencyCommandPage.tsx` | V2X Green Wave Priority Corridor Management |
| `/predictions` | `PredictionsPage.tsx` | Congestion Heatmaps, Trend Forecasting & CO2 Reduction |
| `/digital-twin` | `DigitalTwinPage.tsx` | Simulation Sandbox (Weather, Peak Multipliers, Signal Speed) |
| `/agents` | `AIAgentsPage.tsx` | Multi-Agent Reinforcement Learning Telemetry & Decision Logs |
| `/incidents` | `IncidentsPage.tsx` | Incident Response Center & Active Dispatch Control |
| `/analytics` | `AnalyticsPage.tsx` | Historical Performance, Level of Service (LOS) & Carbon Metrics |
| `/citizen-reports` | `CitizenReportsPage.tsx` | Citizen Reporting Portal & Community Incident Feed |
| `/architecture` | `ArchitecturePage.tsx` | System Architecture Blueprint & Hardware Specifications |

---

## 3. Design System Summary
- **Typography**: Satoshi (Sans display & body font) paired with monospace for telemetry/latencies.
- **Theme**: Dark Slate Canvas (`#070B12`, `bg-slate-950`) with high-contrast accent colors:
  - **Cyan / Blue**: System operations, AI signals, edge feeds.
  - **Emerald**: Optimal status, green waves, carbon savings.
  - **Amber**: Heavy density, warning states, simulation sandbox.
  - **Rose / Red**: Active emergency corridors, critical incidents.
- **Card Styling**: 1px hairline borders (`border-slate-800`), smooth backdrop blurs (`backdrop-blur-md`), pill badges with light pulses.

---

## 4. Main Shared Components
Located in `src/components/`:
- `AppShell` (`App.tsx` layout shell)
- `Sidebar.tsx` — Left vertical navigation with active incident/emergency badges and mobile drawer toggle.
- `TopHeader.tsx` — Real-time ticker banner, AI Copilot toggle, and quick simulation status.
- `PageHeader.tsx` — Uniform top section header for all sub-views with badge metadata.
- `CityMap.tsx` — Interactive SVG Map with intersection nodes, emergency vehicles, and camera hotspots.
- `OverviewDashboard.tsx` — Core dashboard layout component.
- `SignalControlView.tsx` — Intersection signal phase controls.
- `EmergencyCorridorView.tsx` — V2X emergency green wave preemption controls.
- `ComputerVisionView.tsx` — Live edge video feed grid & vehicle detection panel.
- `PredictiveAnalyticsView.tsx` — LSTM congestion prediction and CO2 metrics.
- `TransitAVView.tsx` — Transit and autonomous vehicle priority lane view.
- `GeminiAssistantModal.tsx` — Gemini 2.5 AI Traffic Operator Assistant modal.
- `ScenarioSimulationModal.tsx` — Weather, peak multiplier, and scenario simulator modal.
- `Footer.tsx` — System footer with quick links and compliance standards.

---

## 5. Data Layer & Services Architecture
Located in `src/data/` and `src/services/`:

- **Mock Data Source**: `src/data/mockData.ts`
  - `INITIAL_INTERSECTIONS` (`IntersectionNode[]`)
  - `INITIAL_CAMERA_FEEDS` (`CameraFeed[]`)
  - `INITIAL_EMERGENCY_UNITS` (`EmergencyUnit[]`)
  - `INITIAL_INCIDENTS` (`IncidentItem[]`)
  - `INITIAL_AGENTS` & `INITIAL_AGENT_LOGS`
  - `INITIAL_CITY_METRICS` & `PRESET_SCENARIOS`

- **Service Layer Abstractions**: `src/services/`
  - `intersectionService.ts` — Query/update intersection signals & phases.
  - `trafficService.ts` — Query edge camera feeds and transit routes.
  - `emergencyService.ts` — Manage emergency preemption green waves.
  - `incidentService.ts` — Fetch and resolve active traffic incidents.
  - `predictionService.ts` — Fetch congestion risk zones & AI predictions.
  - `agentService.ts` — Multi-agent RL telemetry and decision logs.
  - `analyticsService.ts` — City-wide efficiency, LOS scores, and carbon savings.
  - `simulationService.ts` — Preset scenario management.

---

## 6. Current Limitations & Known TODOs
- **Live Traffic Simulation**: Currently powered by client-side timer ticks in `App.tsx`.
- **Gemini Copilot**: Backend API route handles Gemini text generation; real-time streaming WebSocket can be added.
- **Video Feeds**: Uses high-res imagery placeholders; ready for RTSP / WebRTC stream binding.

---

## 7. Future Backend Integration Points (Antigravity Handoff)
1. **WebSocket / MQTT Live Feed**: Replace `setInterval` simulation loop in `App.tsx` with a WebSocket connection to the traffic engine (e.g., SUMO / TraCI or Kafka pipeline).
2. **REST / gRPC API**: Replace `src/services/*` implementations with actual API client calls (`fetch` or Axios) pointing to microservices.
3. **Database Integration**: Connect Firestore or PostgreSQL database for persistent citizen reports and incident logging.
4. **V2X Telemetry Engine**: Connect real-time GPS telemetry from emergency fleet vehicles (Ambulance, Fire, Police) for automated green wave activation.
