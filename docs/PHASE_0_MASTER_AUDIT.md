# PHASE 0 — MASTER FORENSIC AUDIT
## SynapseCity AI — Autonomous Urban Mobility Network

**Audit Date:** 2026-08-11  
**Auditor Role:** Senior Principal Software Engineer / Full-Stack Architect  
**Status:** AUDIT COMPLETE — DO NOT IMPLEMENT

---

## 1. PROJECT IDENTITY

| Field | Value |
|:---|:---|
| Repository Name | `react-example` (should be `synapse-city-ai`) |
| Package Version | `0.0.0` |
| Runtime | Node.js 18+ / Vite 6 / React 19 / TypeScript 5.8 |
| CSS Framework | Tailwind CSS v4 |
| Backend | Express.js (single `server.ts`) |
| Real-time | WebSocket (ws library) |
| AI Provider | Google Gemini (`@google/genai`) |
| Deployment | Docker (Cloud Run ready) |
| Database | **NONE** |
| Authentication | **NONE** |

---

## 2. BUILD & RUN AUDIT

| Command | Result | Notes |
|:---|:---|:---|
| `npm install` | ✅ PASS | 220 packages, 0 vulnerabilities |
| `npm run lint` (tsc --noEmit) | ✅ PASS | Zero type errors |
| `npm run test` | ✅ PASS | 3 test suites: trafficEngine, agentSystem, digitalTwin |
| `npm run dev` | ✅ PASS | Server starts on port 3000, WebSocket binds |
| `npm run build` | NOT TESTED | Should work per Dockerfile config |
| E2E / Browser Tests | ❌ NONE | No Playwright/Cypress tests exist |

---

## 3. ARCHITECTURE AUDIT

### 3.1 Server Architecture (server.ts)

The server is a **monolithic Express + WebSocket** file (161 lines):

- **Express** serves Vite middleware (dev) or static dist (prod)
- **WebSocket** broadcasts full engine state to all clients every 1 second via `setInterval`
- **TrafficEngine** class is instantiated once server-side and runs the authoritative simulation tick
- **Gemini endpoint** (`POST /api/gemini/analyze`) exists for chat copilot but is NOT used for traffic decisions
- **Health endpoint** (`GET /api/health`) returns `{ status: "ok" }`

**Critical Finding:** The traffic engine is the only source of truth. There is no database, no REST API for data, no persistence layer. All state lives in server memory.

### 3.2 Frontend Architecture (App.tsx)

- **React Router v7** with BrowserRouter
- **12 routes** mapped to page components
- **WebSocket client** connects to `ws://localhost:3000`, receives INIT + UPDATE messages
- **All state** is managed in a single `OperatorAppContent` component using 15+ `useState` hooks
- **No context/store** — pure prop drilling from App to pages to components
- **Modals** for Gemini Assistant and Scenario Simulation

**Critical Finding:** The WebSocket broadcasts the ENTIRE engine state (~50KB) on every tick (1 second). This is functional for prototype but unscalable.

### 3.3 Data Flow

```
TrafficEngine (server) → tick() every 1s → getFullState() → WebSocket broadcast
     ↕
WebSocket messages from client (REBALANCE, DISPATCH_EMERGENCY, etc.)
     ↕
React App → useState hooks → prop drill → Page Components
```

---

## 4. TRAFFIC ENGINE AUDIT

### 4.1 How Traffic Currently Works

The `TrafficEngine` class (505 lines) is the **authoritative server-side simulation**:

1. **Initialization**: Deep-clones mock data for 8 intersections, 4 cameras, 2 emergency units, 3 incidents
2. **Vehicle Generation**: Creates ~40-70 simulated vehicles on connected edges between nodes
3. **tick()**: Called every 1 second by `setInterval`
   - Advances timeline stages (start → congestion → prediction → intervention → recovery) based on tick count
   - Delegates physics to `PrototypeSimulationEngine.tick()`
   - Updates emergency vehicle progress
   - Triggers agent evaluations on nodes (randomly, `Math.random() > 0.6`)

### 4.2 PrototypeSimulationEngine (249 lines)

This is the ACTUAL physics engine:

- **Signal phases**: Counts down phase timers, cycles between N-S and E-W phases, yellow at ≤4s remaining
- **Vehicle movement**: Vehicles progress along road segments, blocked by red/yellow signals, affected by density penalty and weather factor
- **Density calculation**: `Math.min(99, (vehicleCount * 8) + (queuedCount * 4) + (surge * 0.2))`
- **Speed calculation**: `Math.max(12, 35 - (density * 0.22) - weatherPenalty)`
- **CO2 metric**: Incrementally calculated each tick, not from real data

**Positive Findings:**
- ✅ Density IS correlated with vehicle count and queue
- ✅ Speed IS inversely correlated with density
- ✅ Weather DOES affect vehicle speed (rain: 0.75x, fog: 0.6x, snow: 0.5x)
- ✅ Red signals DO block vehicles
- ✅ Emergency vehicles CAN bypass blocked intersections
- ✅ Vehicles are routed through the graph topology

**Negative Findings:**
- ❌ No yellow clearance interval enforcement
- ❌ No all-red clearance phase
- ❌ No minimum/maximum green constraints
- ❌ No pedestrian phase management
- ❌ Signal cycling is random duration (25 + random * 15)
- ❌ Phase names don't actually control different movements
- ❌ No real traffic signal safety logic

### 4.3 Strategy Comparison (Baseline vs AI)

**CRITICAL FINDING:** The "AI" vs "Baseline" comparison is **not genuine**:

```typescript
const delay = isAi ? Math.max(12, 45 - avgSpeedMph) : Math.max(25, 78 - avgSpeedMph);
const throughput = vehicles.length + (isAi ? 150 : 0);
```

The AI strategy simply gets a **hardcoded advantage** — lower delay formula and +150 throughput. Both strategies share the same simulation state. There is NO separate simulation running in parallel.

---

## 5. MULTI-AGENT SYSTEM AUDIT

### 5.1 Agent Classes

| Agent | Class Exists | process() Implemented | Decision Logic | Events Published |
|:---|:---|:---|:---|:---|
| CityCoordinatorAgent | ✅ | ❌ Empty | ❌ None | Via bus only |
| TrafficPredictionAgent | ✅ | ❌ Empty | ✅ `calculateCongestionForecast()` | prediction.created |
| IntersectionAgent | ✅ (per node) | ❌ Empty | ✅ `evaluateSignalTiming()` | intersection.decision |
| EmergencyAgent | ✅ | ❌ Empty | ❌ None | None |
| RouteAgent | ✅ | ❌ Empty | ❌ None | None |
| IncidentAgent | ✅ | ❌ Empty | ❌ None | None |
| SimulationAgent | ✅ | ❌ Empty | ❌ None | None |
| WeatherAgent | ✅ | ❌ Empty | ❌ None | None |

### 5.2 AgentEventBus

The event bus is **functional** — it's a singleton pub/sub system that:
- Receives events from the traffic engine
- Auto-generates log entries
- Caps at 50 logs
- Broadcasts to WebSocket clients

**Critical Finding:** Only 2 of 8 agents have real decision logic. The rest are structural scaffolding with empty `process()` methods. The agent descriptions in the UI claim "PPO RL", "game-theoretic equilibrium", "reinforcement learning" — none of which exist.

### 5.3 Prediction Logic

The `TrafficPredictionAgent.calculateCongestionForecast()` uses a **deterministic heuristic**:

```typescript
const calculatedRisk = Math.min(99, (baseDensity * scale) + weatherImpact + incidentImpact);
```

This is a **simple linear formula**, not LSTM, not GCN, not any ML model. The UI labels it "LSTM FORECAST (96.4% ACC)" — this is an **UNSUPPORTED CLAIM**.

---

## 6. AI PROVIDER AUDIT

### 6.1 DeterministicDecisionProvider (Active)

The active AI provider is a **rule-based decision tree**:
- Emergency → green wave lock (confidence: 1.0)
- Density > 75% → extended green (confidence: 0.98)
- Queue > 12 → adjusted green (confidence: 0.92)
- Default → maintain phase (confidence: 0.88)

This is **not AI**. It is traditional signal control logic.

### 6.2 GeminiProvider (Available but UNUSED)

A `GeminiProvider` class exists that:
- Connects to Gemini 2.5 Flash
- Sends intersection metrics as prompt
- Requests JSON response with phase recommendation
- Falls back to deterministic provider on error

**Critical Finding:** The `GeminiProvider` is **never instantiated** in the traffic engine. The engine uses `DeterministicDecisionProvider` exclusively. The Gemini API is only used in the chat copilot modal.

### 6.3 Gemini Chat Copilot

The `/api/gemini/analyze` endpoint:
- Accepts prompt, scenario, gridState
- Uses Gemini 2.5 Flash for text generation
- Returns natural language analysis
- Falls back to hardcoded text if no API key

**Status:** FUNCTIONAL when API key is configured, but cosmetic — responses don't affect traffic state.

---

## 7. EMERGENCY SYSTEM AUDIT

### 7.1 Emergency Dispatch Flow

```
dispatchEmergency() → RoutingEngine.calculateRoute() → BFS pathfinding
→ First path node gets emergency_override
→ Green wave events published to bus
→ tick() advances progress by 2.5% per second
→ Upcoming nodes get emergency_override
→ Passed nodes restored to autonomous_ai
→ At 100% progress → arrived, all nodes restored
```

**Working:**
- ✅ BFS routing through intersection graph
- ✅ Incident-aware detour routing (probabilistic)
- ✅ Emergency vehicle progress tracking
- ✅ Green wave signal override on upcoming nodes
- ✅ Signal restoration after vehicle passes
- ✅ ETA calculation

**Missing:**
- ❌ No safety validation before signal changes
- ❌ No conflict detection between multiple emergency vehicles
- ❌ No pedestrian safety check before override
- ❌ No coordinated signal restoration timing
- ❌ Green wave restoration is immediate (no all-red phase)

### 7.2 Supported Vehicle Types

| Type | Supported | In Mock Data |
|:---|:---|:---|
| Ambulance | ✅ | ✅ |
| Fire Engine | ✅ | ✅ |
| Police | ✅ (type exists) | ❌ |

---

## 8. ROUTING ENGINE AUDIT

The `RoutingEngine` (115 lines) implements:
- **BFS shortest path** on the intersection graph
- **Incident avoidance**: Skips incident nodes with 70% probability (random)
- **Fallback**: Pure BFS without avoidance if detour blocks all paths
- **Distance**: Fixed 800m between all nodes
- **ETA**: distance/speed + density delays + incident delays + weather penalty

**Critical Finding:** The routing is functional but uses non-deterministic detour logic (`Math.random() > 0.3`), making test reproducibility impossible.

---

## 9. DIGITAL TWIN AUDIT

### 9.1 Is it a Real Simulation?

**No.** The Digital Twin is the **same simulation engine** that powers the entire app. It is not a separate sandbox.

- START = set speedMultiplier to 1
- PAUSE = set speedMultiplier to 0
- RESET = deep-clone initial mock data, reset tick count
- Timeline advances automatically via tick count thresholds

### 9.2 Baseline vs AI Comparison

**NOT GENUINE.** Both strategies run on the same simulation instance. The "comparison" metrics are computed using different formulas with hardcoded advantages for AI mode.

### 9.3 SUMO Integration

`SUMOSimulationEngine` exists as a **placeholder**:
- `isAvailable()` returns `false`
- `tick()` logs a warning and falls back to PrototypeSimulationEngine
- No TraCI connection code exists

### 9.4 Simulation History

`SimulationHistory` class:
- Persists runs to `simulation_history.json` file
- Generates synthetic 7-day history on first run
- Loaded on server start
- ✅ Actually persists to disk (survives restart)

---

## 10. MAP AUDIT

### 10.1 Map Type

The map is a **synthetic SVG visualization** (`CityMap.tsx`, 16,722 bytes):
- SVG canvas with grid roads drawn between node positions
- Nodes positioned by x/y percentages (0-100)
- No real geography
- No real road network
- Vehicle dots animated along edges

### 10.2 Road Names

All road names are **fictional Western-style**:
- "5th Ave & Grand Blvd" → Downtown Financial Core
- "Bayfront Pkwy & Harbor Dr" → Bayfront Maritime Sector
- "Innovation Way & Tech Corridor" → Silicon Quarter
- "Metro Central & Station Plaza" → Transit Hub District

**None of these are real locations.**

### 10.3 Future Map Compatibility

The x/y percentage-based positioning system is **not compatible** with:
- OpenStreetMap (requires lat/lng)
- Mapbox (requires GeoJSON)
- MapLibre (requires vector tiles)
- SUMO (requires .net.xml)

Switching to a real map provider will require **complete rewrite** of CityMap.tsx.

---

## 11. DESIGN SYSTEM AUDIT

### 11.1 Font

| Aspect | Finding |
|:---|:---|
| Font Declared | Satoshi |
| Font Loading | CDN via Fontshare (`api.fontshare.com`) |
| Local Font Files | ❌ **NOT PRESENT** |
| CSS Declaration | `@theme { --font-sans: 'Satoshi', ... }` |
| index.html Link | ✅ `<link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,300,400,800&display=swap">` |

**FONT CLAIM = PARTIAL** — Font loads via CDN, but no local fallback files exist. Offline or CDN failure = font fallback to system fonts.

### 11.2 Color System

- Background: `#070B12` (near-black)
- Text: `slate-100` (#f1f5f9)
- Accent: Cyan/Blue gradient (cyan-500 → blue-600 → indigo-600)
- Emergency: Rose-500
- Warning: Amber-500
- Success: Emerald-500

**Consistent across the application.**

### 11.3 Component Consistency

- ✅ Cards use consistent `bg-slate-900/90 rounded-2xl border border-slate-800`
- ✅ Badges use consistent pill styling with color-coded backgrounds
- ✅ PageHeader component is shared across all pages
- ✅ Sidebar navigation is consistent
- ✅ Font sizes are consistently small (xs, 10px, 11px)
- ⚠️ Extremely dense UI — very small text throughout
- ⚠️ Landing page has its own navigation bar (different from operator layout)

---

## 12. UI CLAIMS vs IMPLEMENTATION

| Claim | Location | Evidence | Verdict |
|:---|:---|:---|:---|
| "LSTM FORECAST (96.4% ACC)" | PredictionsPage badge | Linear heuristic formula | **UNSUPPORTED CLAIM** |
| "4K VISION (60 FPS)" | LiveTrafficPage badge | Unsplash placeholder images | **UNSUPPORTED CLAIM** |
| "Graph neural networks" | PredictionsPage subtitle | No GNN code | **UNSUPPORTED CLAIM** |
| "PPO RL agent" | ArchitecturePage | No RL code | **UNSUPPORTED CLAIM** |
| "Distributed edge reinforcement learning" | IntersectionIntelligencePage | Rule-based decisions | **UNSUPPORTED CLAIM** |
| "Game-theoretic equilibrium" | AIAgentsPage | No game theory code | **UNSUPPORTED CLAIM** |
| "Computer vision edge feeds" | Multiple pages | Static Unsplash images | **UNSUPPORTED CLAIM** |
| "V2X siren triangulation" | EmergencyPage | Manual dispatch button | **UNSUPPORTED CLAIM** |
| "License plate OCR" | LiveTrafficPage | Hardcoded counter | **UNSUPPORTED CLAIM** |
| "142 Edge AI Nodes" | Landing, Sidebar | 8 intersection nodes + hardcoded | **UNSUPPORTED CLAIM** |
| "14,850+ Autonomous Vehicles" | Landing page | ~50-70 simulated basic vehicles | **UNSUPPORTED CLAIM** |
| "18.4 Tons CO2 Saved" | Landing, Dashboard | Incrementing counter from formula | **SIMULATED** |
| "94.2% Signal Optimization" | Dashboard badge | Hardcoded in mock data | **STATIC** |
| "98.6% Pedestrian Safety" | Analytics | Hardcoded in mock data | **STATIC** |
| Signal phase optimization | Intersections | ✅ Rule-based phase switching | **IMPLEMENTED (PROTOTYPE)** |
| Emergency green wave | Emergency | ✅ Working corridor progression | **IMPLEMENTED (PROTOTYPE)** |
| Real-time WebSocket sync | All pages | ✅ Working 1s broadcast | **IMPLEMENTED** |
| BFS routing with detours | Emergency dispatch | ✅ Functional pathfinding | **IMPLEMENTED (PROTOTYPE)** |
| Citizen report submission | Citizen Reports | ✅ Creates incident from report | **IMPLEMENTED (NO PERSISTENCE)** |
| Weather simulation effects | Digital Twin | ✅ Affects vehicle speed | **IMPLEMENTED** |
| Incident resolution | Incidents | ✅ Marks resolved via WebSocket | **IMPLEMENTED (NO PERSISTENCE)** |

---

## 13. PERSISTENCE AUDIT

| Data | Persists? | Mechanism |
|:---|:---|:---|
| Intersections | ❌ | In-memory, resets on restart |
| Traffic state | ❌ | In-memory, 1s ephemeral |
| Incidents | ❌ | In-memory |
| Emergency events | ❌ | In-memory |
| Citizen reports | ❌ | In-memory |
| Agent decisions | ❌ | Capped at 50 logs in memory |
| Simulation history | ✅ | `simulation_history.json` file |
| Predictions | ❌ | Computed per-tick |
| Analytics | ❌ | Derived from current state |
| User sessions | ❌ | No auth |

---

## 14. AUTHENTICATION & AUTHORIZATION AUDIT

- **Authentication:** NONE
- **Authorization:** NONE
- **Roles:** NONE
- **Session management:** NONE
- **API key protection:** Gemini key in `.env` only
- **WebSocket authentication:** NONE — any client can connect and send commands

**CRITICAL:** Anyone can send `DISPATCH_EMERGENCY`, `REBALANCE`, `RESET_SIMULATION` via WebSocket.

---

## 15. SECURITY AUDIT

| Issue | Severity | Details |
|:---|:---|:---|
| No WebSocket authentication | HIGH | Any client can control traffic signals |
| No input validation on WebSocket | HIGH | Malformed messages caught by try/catch only |
| API key in .env only | MEDIUM | .env.example has placeholder, no secret management |
| No CORS configuration | LOW | Express default (open) |
| No rate limiting | MEDIUM | Gemini API or WebSocket floods possible |
| No HTTPS enforcement | MEDIUM | HTTP in development, Cloud Run handles TLS |
| package name is `react-example` | LOW | Identity issue |

---

## 16. TESTING AUDIT

### 16.1 Existing Tests

| Test File | Type | Tests | Status |
|:---|:---|:---|:---|
| `trafficEngine.test.ts` | Unit/Integration | 3 tests: init state, tick, surge | ✅ PASS |
| `agentSystem.test.ts` | Integration/E2E | 5 steps: surge, rebalance, dispatch, progress, citizen report | ✅ PASS |
| `digitalTwin.test.ts` | Integration | 6 tests: config, engine label, timeline, strategy, history, reset | ✅ PASS |

### 16.2 Test Framework

Tests use Node.js `assert` module directly — **no test framework** (no Jest, Vitest, Mocha). Tests are scripts run via `tsx`.

### 16.3 Missing Tests

- ❌ No frontend component tests
- ❌ No E2E browser tests
- ❌ No WebSocket integration tests
- ❌ No API endpoint tests
- ❌ No security tests
- ❌ No performance tests
- ❌ No accessibility tests

---

## 17. DEPLOYMENT AUDIT

### 17.1 Docker

- Multi-stage Dockerfile (builder + runner)
- Node.js 18 Alpine
- Builds frontend (vite) and server (esbuild)
- Copies `simulation_history.json`
- Exposes port 3000
- Cloud Run ready

### 17.2 Missing Deployment Concerns

- ❌ No health check in Docker (no HEALTHCHECK instruction)
- ❌ No database in container
- ❌ WebSocket behind Cloud Run may have timeout issues
- ❌ No environment variable validation
- ❌ No logging infrastructure
- ❌ No monitoring

---

## 18. SOUTH INDIA / VELLORE FEASIBILITY AUDIT

### 18.1 Western-City Assumptions Found

| Issue | Location | Impact |
|:---|:---|:---|
| All speeds in **mph** | types.ts, mockData, UI components | Must be km/h for India |
| US-style road names | mockData.ts ("5th Ave & Grand Blvd") | Must use Vellore names |
| "Downtown Financial Core" districts | mockData.ts | Must use Vellore districts |
| Autonomous shuttles, AV platoons | Types, mock data | Not realistic for Vellore |
| Light rail | Transit routes | Not present in Vellore |
| "BRT" Bus Rapid Transit | Mock data | Limited in Vellore |
| Toll metering | Mock data (node-7) | Not standard in Vellore |
| "Tons CO2 Saved" metric | Multiple pages | Needs Indian context |
| 4-way intersection model | Map topology | Indian intersections are often irregular |

### 18.2 Missing Indian Vehicle Types

| Vehicle Type | In System | Required |
|:---|:---|:---|
| Car | ✅ | ✅ |
| Truck | ✅ | ✅ |
| Bus | ✅ | ✅ |
| Ambulance | ✅ | ✅ |
| Fire Engine | ✅ | ✅ |
| Police | ⚠️ (type only) | ✅ |
| Motorcycle/Scooter | ❌ | ✅ **CRITICAL** |
| Auto-Rickshaw | ❌ | ✅ **CRITICAL** |
| Bicycle | ❌ (in detection only) | ✅ |
| Pedestrian | ⚠️ (counter only) | ✅ |

### 18.3 Missing Indian Traffic Behaviors

- ❌ Lane filtering by two-wheelers
- ❌ Mixed traffic (heterogeneous vehicle sizes)
- ❌ Auto-rickshaw stopping behavior
- ❌ Bus stopping at unmarked locations
- ❌ Roadside parking/stopping
- ❌ Peak-hour school traffic patterns
- ❌ Hospital zone traffic patterns
- ❌ Rain/monsoon effects on Indian roads
- ❌ Pedestrian jaywalking
- ❌ Signal violation behavior

---

## 19. ROUTE INVENTORY

| Route | Page | Purpose | Data Source | WebSocket | Status |
|:---|:---|:---|:---|:---|:---|
| `/` | LandingPage | Public showcase | Static + mockData metrics | ❌ | ✅ Working |
| `/dashboard` | DashboardPage → OverviewDashboard | Command center with map, KPIs | WebSocket state | ✅ | ✅ Working |
| `/traffic` | LiveTrafficPage | Camera feeds + vehicle table | WebSocket state | ✅ | ⚠️ Unsplash images |
| `/intersections` | IntersectionIntelligencePage → SignalControlView | Signal phase control | WebSocket state | ✅ | ✅ Working |
| `/emergency` | EmergencyCommandPage → EmergencyCorridorView | Emergency dispatch | WebSocket state | ✅ | ✅ Working |
| `/predictions` | PredictionsPage → PredictiveAnalyticsView | Congestion forecasts | Static mock zones | ❌ | ⚠️ Static data |
| `/digital-twin` | DigitalTwinPage | Simulation sandbox | WebSocket state | ✅ | ⚠️ Fake comparison |
| `/agents` | AIAgentsPage | Agent telemetry | WebSocket agents/logs | ✅ | ✅ Working |
| `/incidents` | IncidentsPage | Incident management | WebSocket incidents | ✅ | ✅ Working |
| `/analytics` | AnalyticsPage | Historical analytics | WebSocket history | ✅ | ⚠️ Synthetic history |
| `/citizen-reports` | CitizenReportsPage | Citizen reporting | Local state only | ❌ | ⚠️ No persistence |
| `/architecture` | ArchitecturePage | System architecture | Static content | ❌ | ✅ Working |

---

## 20. EXECUTIVE SUMMARY SCORES

| Dimension | Score / 100 | Justification |
|:---|:---|:---|
| **CURRENT PRODUCT** | **42** | Impressive UI shell with functional WebSocket-driven simulation, but core AI claims are unsupported |
| **PPT COVERAGE** | **35** | Many concepts represented in UI, few actually implemented beyond prototype |
| **UI QUALITY** | **72** | Professional dark-theme design, consistent components, good typography (via CDN font), but extremely dense text, no accessibility |
| **FUNCTIONALITY** | **48** | WebSocket real-time loop works, emergency dispatch works, agent event bus works, but no persistence, no real AI, no real data |
| **REAL-TIME** | **65** | WebSocket 1s broadcast is genuinely real-time, vehicle movement is server-authoritative |
| **AI** | **15** | Only Gemini chat copilot works (cosmetic). Traffic decisions are deterministic rules. No ML models exist |
| **DIGITAL TWIN** | **25** | Timeline progression works, but baseline vs AI comparison is fake, SUMO is placeholder |
| **SOUTH INDIA FEASIBILITY** | **12** | All data is Western-city, mph units, no Indian vehicle types, no Vellore geography |
| **PRODUCTION READINESS** | **8** | No database, no auth, no security, no input validation, no monitoring |

---

## 21. TOP 10 CRITICAL GAPS

1. **Fake AI claims** — LSTM, GCN, PPO, reinforcement learning are claimed but none exist
2. **No database** — All data is ephemeral (lost on server restart)
3. **No authentication** — Anyone can control traffic signals via WebSocket
4. **Western-city data model** — Cannot represent Vellore without complete data rewrite
5. **Fake strategy comparison** — AI vs Baseline uses hardcoded advantages, not real parallel simulation
6. **No computer vision** — "4K 60fps" badge with Unsplash stock photos
7. **No signal safety logic** — No minimum green, no all-red clearance, no conflict prevention
8. **Agent system mostly empty** — 6 of 8 agents have empty `process()` methods
9. **No map integration** — SVG synthetic grid cannot display real geography
10. **mph throughout** — All speeds in imperial units, must be metric for India

---

## 22. TOP 10 THINGS WORTH KEEPING

1. **Server-authoritative traffic engine** — Clean architecture with pluggable simulation engines
2. **WebSocket real-time infrastructure** — Working bidirectional communication
3. **Agent event bus** — Proper pub/sub pattern ready for real agent logic
4. **Emergency corridor progression** — Green wave propagation works correctly
5. **BFS routing engine** — Incident-aware pathfinding through intersection graph
6. **Consistent design system** — Professional dark-theme UI with reusable components
7. **Simulation history persistence** — File-based run storage with synthetic data generation
8. **TypeScript throughout** — Strong type definitions for all domain models
9. **Test suite foundation** — 14 meaningful tests that verify engine behavior
10. **Docker deployment** — Multi-stage Cloud Run-ready Dockerfile

---

## 23. TOP 10 IMPLEMENTATION PRIORITIES

1. **P0:** Remove or relabel all unsupported AI/ML claims (LSTM, GCN, PPO, 4K, 60fps)
2. **P0:** Add signal safety constraints (min green, max green, all-red clearance)
3. **P1:** Replace Western data with Vellore intersections, km/h, Indian vehicle types
4. **P1:** Implement genuine baseline vs AI strategy comparison in Digital Twin
5. **P1:** Add Indian vehicle types (motorcycle, auto-rickshaw, scooter) to simulation
6. **P1:** Add database (SQLite or PostgreSQL) for persistence
7. **P2:** Implement real prediction heuristics labeled honestly as "heuristic model"
8. **P2:** Fill out agent `process()` methods with meaningful decision logic
9. **P2:** Replace SVG map with MapLibre + OpenStreetMap for real Vellore geography
10. **P3:** Add authentication, WebSocket auth, input validation
