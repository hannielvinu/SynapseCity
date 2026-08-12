# Phase 4 Implementation Plan — Final Integration & Production Hardening

## 1. Current Architecture

```
TrafficEngine (legacy sim) → PrototypeProvider (adapter) → TrafficStore (authoritative state)
                                                               │
                                                    CityCoordinator (intelligence)
                                                    ├── HeuristicPredictionProvider
                                                    ├── IntersectionAgent (per-node)
                                                    ├── SafetyValidator
                                                    └── ConflictResolver
                                                               │
                                                    IntelligenceEventBus (singleton)
                                                               │
                                                    WebSocket → App.tsx → All pages
```

## 2. Scope

Fix ONLY the remaining Phase 4 deliverables:
1. Smart Emergency Corridor lifecycle
2. Digital Twin snapshot isolation and comparison
3. Page consistency and truthfulness sweep
4. End-to-end integration tests
5. Final QA and documentation

## 3. Non-Negotiable Principles

1. Canonical Traffic State remains authoritative
2. SimulationProvider abstraction preserved
3. PrototypeProvider remains functional
4. SUMO remains optional
5. Agents propose → Safety validates → Simulation executes
6. UI never directly mutates safety-sensitive state
7. Digital Twin does not create independent second reality
8. Emergency priority never bypasses safety validation
9. No page creates fake intelligence data
10. No unsupported AI claims

## 4. Implementation Order

1. Domain types (EmergencyCorridor, DigitalTwin types)
2. EmergencyCorridorManager
3. DigitalTwinEngine
4. TrafficStore integration
5. Server WebSocket commands
6. App.tsx state + handlers
7. UI page updates
8. Integration tests
9. Truthfulness sweep
10. Documentation
