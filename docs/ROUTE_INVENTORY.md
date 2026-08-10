# SynapseCity AI Route Inventory

This inventory documents all client-side routes, their corresponding page components, purposes, layouts, dependencies, and status.

| Route | Page | Purpose | Components | Data Dependencies | API Dependencies | Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `LandingPage.tsx` | Showcase landing page | Hero sections, CSS architecture blueprint, feature grids | None | None | **READY** |
| `/dashboard` | `DashboardPage.tsx` | TOC command center dashboard | `CityMap.tsx`, `OverviewDashboard.tsx`, stats cards, tickers | `nodes`, `selectedNodeId`, `metrics`, `emergencyUnits`, `cameraFeeds`, `isSimulating` | `GET /api/health` | **PARTIAL** (Mocked client state) |
| `/traffic` | `LiveTrafficPage.tsx` | Video feeds & AI perception stats | `ComputerVisionView.tsx`, feed grid, classification panels | `cameraFeeds` | None | **PARTIAL** (Mocked feeds & data) |
| `/intersections` | `IntersectionIntelligencePage.tsx` | Traffic signal optimization control | `SignalControlView.tsx`, phase sliders, mode dials | `nodes`, `selectedNodeId` | None | **PARTIAL** (Local state updates only) |
| `/emergency` | `EmergencyCommandPage.tsx` | Green wave corridor priority dispatch | `EmergencyCorridorView.tsx`, dispatch form, ETA cards | `emergencyUnits`, `nodes` | None | **PARTIAL** (Linear simulation ticks) |
| `/predictions` | `PredictionsPage.tsx` | Congestion heatmaps & forecasts | `PredictiveAnalyticsView.tsx`, risk lists, charts | `metrics` | None | **PARTIAL** (Static trends visualization) |
| `/digital-twin` | `DigitalTwinPage.tsx` | Weather & Peak volume sandbox tuning | `DigitalTwinPage` presets list, sliders | `simulationConfig`, `isSimulating` | None | **PARTIAL** (Local state configuration only) |
| `/agents` | `AIAgentsPage.tsx` | Multi-agent RL network logs & telemetry | `AIAgentsPage` stats, agent negotiations stream | `emergencyUnits`, `incidents`, `nodes` | None | **PARTIAL** (Static log feeds) |
| `/incidents` | `IncidentsPage.tsx` | Incident dispatch control desk | `IncidentsPage` table lists, severity badges | `incidents` | None | **PARTIAL** (Mock resolve clicks) |
| `/analytics` | `AnalyticsPage.tsx` | Historical Level of Service graphs | `AnalyticsPage` chart cards | `metrics` | None | **PARTIAL** (Static mock charts) |
| `/citizen-reports` | `CitizenReportsPage.tsx` | Citizen reports feed and submissions | `CitizenReportsPage` layout, forms, upvote buttons | None (self-contained local state) | None | **PARTIAL** (Local array appends only) |
| `/architecture` | `ArchitecturePage.tsx` | Hardware specs and topology charts | `ArchitecturePage` details cards | None | None | **READY** |
