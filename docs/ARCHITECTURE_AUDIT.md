# SynapseCity AI Architecture Audit Report

This document outlines the detailed system architecture audit for SynapseCity AI, identifying the current technology stack, routing, state management, backend, database configuration, mock-data architecture, risks, technical debt, and a proposed production path.

---

## 1. Current Technology Stack

### Frontend Core
- **Framework**: React 19.0.1 & React DOM 19.0.1
- **Routing**: React Router DOM 7.18.2 (configured as a client-side Single Page Application)
- **Styling**: Tailwind CSS v4.1.14 (integrated via `@tailwindcss/vite` and Autoprefixer)
- **Icons & Visuals**: Lucide React 0.546.0
- **Animations**: Motion 12.23.24 (f.k.a. Framer Motion)
- **Language**: TypeScript (configured with `tsconfig.json` targeting ES2022)
- **Build Tool**: Vite 6.2.3

### Backend Core
- **Server Framework**: Express 4.21.2
- **Language**: TypeScript running via `tsx 4.21.0` (development execution engine)
- **Bundling / Production Compiler**: esbuild 0.25.0
- **Environment Management**: Dotenv 17.2.3
- **GenAI Client SDK**: `@google/genai 2.4.0` (initialized in `server.ts` using `gemini-2.5-flash`)

---

## 2. Current Frontend Architecture

The frontend follows a typical Single Page Application (SPA) structure:
1. **Entrypoint**: [index.html](file:///c:/Users/dragn/OneDrive/Desktop/Resume%20Projects/SnapseCity/index.html) mounts [src/main.tsx](file:///c:/Users/dragn/OneDrive/Desktop/Resume%20Projects/SnapseCity/src/main.tsx) which imports [src/index.css](file:///c:/Users/dragn/OneDrive/Desktop/Resume%20Projects/SnapseCity/src/index.css).
2. **Main Layout Shell**: [src/App.tsx](file:///c:/Users/dragn/OneDrive/Desktop/Resume%20Projects/SnapseCity/src/App.tsx) handles global layout routing using `BrowserRouter`. 
   - Public view: `/` renders `LandingPage.tsx`.
   - Operator Console views: Covered by `OperatorLayout` wrapper that houses `Sidebar.tsx`, `TopHeader.tsx`, and `Footer.tsx` enclosing the main route components.
3. **Responsive Design**: Standard Tailwind breakpoints (`sm`, `md`, `lg`, `xl`). The sidebar collapses to a mobile drawer toggleable via header triggers.
4. **Visual Elements**: Uses SVG overlays for the main city grid map, high-res photography cards (with backdrop blurs, glow filters, border-slate-800, and CSS pulse indicators), and CSS layouts for simulated video feeds.

---

## 3. Current Backend Architecture & API Configuration

The backend is a single Node.js script located at [server.ts](file:///c:/Users/dragn/OneDrive/Desktop/Resume%20Projects/SnapseCity/server.ts).

### Functions:
1. **Static File Hosting**: In production mode (`NODE_ENV === 'production'`), it serves the bundled frontend files from the `dist` directory.
2. **Vite Middleware Integration**: In development mode, it initializes Vite in middleware mode (`appType: "spa"`) so that the express server serves both the APIs and the Hot Module Replacement (HMR) assets on port 3000.
3. **Health Check Endpoint**: `GET /api/health` returns status metadata.
4. **Generative AI Endpoint**: `POST /api/gemini/analyze`
   - Checks for `GEMINI_API_KEY` in environment variables.
   - Instantiates `GoogleGenAI` client.
   - Prompts `gemini-2.5-flash` using a tailored system instruction defining the AI operator role and sends the grid scenario metrics.
   - Returns JSON response. If missing API Key, falls back gracefully to local pre-computed response message strings.

---

## 4. Current State Management

The application manages state exclusively via React's local component state.
- **Location**: All core dynamic variables are kept in the `OperatorAppContent` component inside [src/App.tsx](file:///c:/Users/dragn/OneDrive/Desktop/Resume%20Projects/SnapseCity/src/App.tsx).
- **Lifting State Up**: Intersections, camera feeds, emergency vehicles, incidents, metrics, and simulation settings are defined using standard `useState` hooks at the shell level.
- **Friction-less Simulation Loop**: A client-side `useEffect` running on `setInterval` acts as the "Simulation Engine," ticking down phase timers, moving emergency vehicles, updating city metrics, and adding minor random noise.

---

## 5. Current Data Model & Mock-Data Architecture

### Core Types (`src/types.ts`)
- **IntersectionNode**: Represents an intersection agent including grid coordinates (`x`, `y`), signal state (`green`, `yellow`, `red`, `emergency_override`), signal mode (`autonomous_ai`, `manual_override`, `emergency_corridor`, `fixed_timer`), congestion metrics, average speeds, queue lengths, and adjacent nodes.
- **CameraFeed**: Edge AI perception stats including vehicle class detections, velocity scans, and speed violations.
- **EmergencyUnit**: Active dispatches tracking Origin/Destination, GPS path nodes, green wave preemption statuses, and ETA.
- **IncidentItem**: Accident & breakdown events, including severity levels, category types, delays, and resolution statuses.
- **AIAgentNode**: Reinforcement learning nodes details (status, latency, accuracy, count of daily decisions).
- **CitizenReport**: Infrastructure issues submitted by citizens.

### Initial Mock Values (`src/data/mockData.ts`)
Initialized with full grid structures representing downtown financial cores, transit hubs, and hospital corridors.

---

## 6. Current Database & Authentication Status
- **Database**: None. All state resets on browser refresh.
- **Authentication**: None. The operator console is publicly accessible at `/dashboard`.

---

## 7. Current Simulation & AI Implementation
- **Simulation**: Completely local setInterval timer tick in the client browser.
- **AI Implementation**:
  1. Frontend Copilot Chatbot: Sends queries to `POST /api/gemini/analyze` using the Gemini 2.5 Flash API.
  2. Local agent logic: Pure mock indicators (`aiConfidence`, "Autonomous AI" labels) with static logic loops.

---

## 8. Technical Debt & Risks

### Technical Debt:
1. **Monolithic state management**: Global state is stored entirely inside a single `App.tsx` file, leading to prop drilling to sub-components.
2. **Client-side simulation drift**: Grid states are calculated directly inside React re-render cycles using `setInterval`, which can drift or lag when browser tabs lose focus.
3. **No Service Abstraction**: The service files in `src/services/` simply wrap direct synchronous imports from `mockData.ts`. They do not make actual HTTP fetches.

### Risks:
1. **API Key exposure**: If the API key is not configured, the system uses mock fallbacks.
2. **Tailwind v4 Native Binding Error**: `@tailwindcss/oxide` fails to load automatically on Node 18 in certain environments due to binary installation differences.

---

## 9. Recommended Production Architecture

To transition SynapseCity AI from a mockup dashboard to a robust, scaleable smart city controller:

```
[IoT Edge Cameras & V2X GPS] -> [MQTT Broker / Apache Kafka]
                                        ↓
[SUMO Traffic Simulator / Real Junctions] ↔ [Go/Python Control Services]
                                                    ↓ (WebSockets / REST APIs)
[React Frontend (Zustand State)] ↔ [Express Backend Proxy] ↔ [PostgreSQL / Redis]
                                        ↓
                               [Gemini Live API]
```

1. **State Management**: Introduce **Zustand** or **Redux Toolkit** to clean up the monolithic `App.tsx` state and remove prop drilling.
2. **Real-time Pipeline**: Migrate the client-side `setInterval` loop to a **WebSocket** or **Server-Sent Events (SSE)** connection powered by a backend simulator (e.g., SUMO - Simulation of Urban MObility).
3. **Persistent Layer**: Connect a **PostgreSQL** database for incidents, citizen reports, and audit logs.
4. **V2X Telemetry Integration**: Integrate a message broker (e.g., **Mosquitto MQTT** or **Kafka**) to digest emergency vehicle coordinates in real-time.

---

## 10. Migration Plan
- **Phase 1**: Restructure services to perform asynchronous fetches from local backend routes.
- **Phase 2**: Add a persistent database (PostgreSQL) for Citizen Reports and Incidents, integrating simple REST endpoints.
- **Phase 3**: Move simulation ticks to the Express backend using WebSockets to ensure multi-client synchronization.
- **Phase 4**: Connect to live telemetry feeds and replace mock camera assets with RTSP streams.
