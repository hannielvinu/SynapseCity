# QA Baseline Report
## SynapseCity AI — Current Quality Assessment

---

## 1. Test Inventory

### 1.1 Existing Tests

| Test File | Runner | Tests | Assertions | Status |
|:---|:---|:---|:---|:---|
| `src/tests/trafficEngine.test.ts` | tsx + assert | 3 | 5 | ✅ ALL PASS |
| `src/tests/agentSystem.test.ts` | tsx + assert | 5 (steps) | 8 | ✅ ALL PASS |
| `src/tests/digitalTwin.test.ts` | tsx + assert | 6 | 8 | ✅ ALL PASS |
| **Total** | | **14** | **21** | ✅ |

### 1.2 Test Framework

- **No test framework** — Uses Node.js built-in `assert` module
- Tests are TypeScript scripts run via `tsx` (esbuild-based runner)
- Test command: `npm run test` → runs all 3 test files sequentially via `tsx`
- No test configuration file (no jest.config, vitest.config, etc.)
- No code coverage measurement
- No watch mode

---

## 2. Test Coverage Assessment

### 2.1 Backend Coverage (Estimated)

| Module | Lines | Tested | Est. Coverage | Critical Gaps |
|:---|:---|:---|:---|:---|
| `trafficEngine.ts` | 505 | Partially | ~40% | Missing: emergency multi-vehicle conflict, config edge cases, vehicle lifecycle |
| `agentSystem.ts` | 359 | Partially | ~30% | Missing: individual agent process() methods (all empty), bus subscription edge cases |
| `simulationEngine.ts` | 249 | Indirectly | ~25% | Missing: weather impact verification, signal cycling edge cases, SUMO fallback |
| `aiProvider.ts` | 142 | Not tested | 0% | Missing: DeterministicDecisionProvider decision paths, GeminiProvider error handling |
| `routingEngine.ts` | 115 | Indirectly | ~15% | Missing: no-path scenarios, incident blocking, weather ETA adjustment |
| `simulationHistory.ts` | 68 | Indirectly | ~20% | Missing: file I/O errors, corrupt data handling |
| `server.ts` | 161 | Not tested | 0% | Missing: WebSocket message handling, Gemini endpoint, error responses |

### 2.2 Frontend Coverage

| Component | Tests | Coverage |
|:---|:---|:---|
| All 12 page components | 0 | 0% |
| All 8 feature components | 0 | 0% |
| All 4 layout components | 0 | 0% |
| 2 modal components | 0 | 0% |
| CityMap.tsx | 0 | 0% |
| **Total Frontend** | **0** | **0%** |

---

## 3. Test Quality Assessment

### 3.1 Traffic Engine Tests

**Test 1: Initial State Check**
```typescript
assert.ok(initialState.nodes.length > 0);           // ✅ Valid
assert.ok(initialState.vehicles.length > 0);         // ✅ Valid
assert.strictEqual(initialState.metrics.congestionIndex, 20); // ⚠️ Magic number
```
- Assessment: Basic smoke test. Validates initialization but doesn't test edge cases.

**Test 2: Tick Simulation Check**
```typescript
assert.strictEqual(nextTimeRemaining, initialTimeRemaining - 1);
```
- Assessment: Valid behavioral test. Verifies tick decrements phase timer.

**Test 3: Calculations Interlocking Check**
```typescript
engine.updateConfig({ trafficSurge: 100 });
// 10 ticks
assert.ok(surgedState.metrics.congestionIndex > 20);
assert.ok(surgedState.metrics.totalActiveVehicles > initialState.metrics.totalActiveVehicles);
```
- Assessment: Good integration test. Verifies surge affects metrics. But doesn't test specific value boundaries.

### 3.2 Agent System Tests (E2E)

**Step 1: Traffic surge at J12** → Verifies prediction agent fires `prediction.created` ✅  
**Step 2: AI rebalance** → Verifies density decreases after rebalance ✅  
**Step 3: Emergency dispatch** → Verifies BFS routing with multi-node path ✅  
**Step 4: Emergency progress** → Verifies ambulance advances over 15 ticks ✅  
**Step 5: Citizen report** → Verifies report creates incident ✅  

- Assessment: **This is the strongest test.** It covers the full lifecycle from congestion → prediction → rebalance → emergency → citizen report. Good integration coverage.

### 3.3 Digital Twin Tests

**Tests 1-6** cover: config changes, engine labeling, timeline progression, strategy comparison, history persistence, simulation reset.

- Assessment: Good coverage of Digital Twin control flow. The strategy comparison test (`assert.ok(aiState.comparison.throughput >= baselineState.comparison.throughput)`) validates the current (fake) comparison, which means it will need updating when we implement genuine comparison.

---

## 4. Missing Test Categories

### 4.1 Critical Missing Tests (P0)

| Category | What's Missing | Risk |
|:---|:---|:---|
| **Signal Safety** | No test for conflicting green phases | Safety-critical |
| **Signal Constraints** | No test for min/max green enforcement | Safety-critical |
| **WebSocket Security** | No test for unauthenticated commands | Security |
| **WebSocket Message Validation** | No test for malformed messages | Crash risk |
| **Emergency Conflict** | No test for two ambulances at same intersection | Logic error |
| **Vehicle Lifecycle** | No test for vehicle creation/destruction boundaries | Memory leak |

### 4.2 Important Missing Tests (P1)

| Category | What's Missing | Risk |
|:---|:---|:---|
| **API Endpoint Tests** | Gemini endpoint, health endpoint | Integration regression |
| **AI Decision Provider** | DeterministicDecisionProvider decision paths | Logic correctness |
| **Weather Edge Cases** | Extreme weather combinations | Unexpected behavior |
| **Routing Edge Cases** | No-path scenarios, single-node routes | Crash risk |
| **State Consistency** | Concurrent WebSocket updates | Race conditions |

### 4.3 Frontend Tests (P2)

| Category | What's Missing | Risk |
|:---|:---|:---|
| **Component Rendering** | All page components render without crash | Regression |
| **User Interactions** | Button clicks, form submissions | Functional regression |
| **WebSocket Connection** | Reconnection, offline state | UX degradation |
| **Accessibility** | Keyboard navigation, screen reader | Compliance |
| **Responsive Layout** | Mobile breakpoints | Layout breaks |

---

## 5. Build & Lint Quality

### 5.1 TypeScript Compilation

```
$ npm run lint
> tsc --noEmit
(zero errors)
```

✅ **CLEAN** — No type errors. Full strict mode TypeScript.

### 5.2 Lint Rules

- **ESLint:** Not configured (no `.eslintrc`, no eslint dependency)
- **Prettier:** Not configured (no `.prettierrc`)
- **Stylelint:** Not configured

### 5.3 Code Quality Observations

| Area | Finding | Severity |
|:---|:---|:---|
| `any` type usage | 8 instances in App.tsx (`useState<any>`) | MEDIUM |
| Magic numbers | Density formulas, speed calculations | LOW |
| Console.log | Production console.log in trafficEngine | LOW |
| Error handling | WebSocket message parsing in try/catch | MEDIUM |
| Memory management | Agent event bus capped at 50 logs | OK |
| Type assertions | `as any` in DigitalTwinPage | LOW |

---

## 6. Performance Baseline

### 6.1 Bundle Size (Estimated)

| Component | Size |
|:---|:---|
| React + React DOM | ~45 KB (gzip) |
| React Router | ~15 KB |
| Lucide Icons | ~20-30 KB (tree-shakeable) |
| Tailwind CSS | ~8-15 KB (JIT) |
| Application code | ~80-120 KB |
| **Estimated Total** | **~170-230 KB (gzip)** |

### 6.2 Runtime Performance

| Metric | Current | Concern |
|:---|:---|:---|
| WebSocket message size | ~50KB full state | HIGH — Should be delta updates |
| Message frequency | 1 per second | OK for prototype |
| State updates per second | 15+ setState calls | MEDIUM — Should batch |
| Vehicle simulation entities | ~50-70 | OK |
| DOM nodes (estimated) | ~2000-4000 | OK |

### 6.3 Memory

| Area | Observation |
|:---|:---|
| Agent logs | Capped at 50 entries ✅ |
| Vehicle array | Recreated each tick ⚠️ (garbage collection pressure) |
| WebSocket connections | No connection limit ⚠️ |
| Simulation history | Loaded entirely in memory ⚠️ |

---

## 7. Accessibility Baseline

| Criteria | Status | Details |
|:---|:---|:---|
| Semantic HTML | ⚠️ PARTIAL | Some sections use `div` where `section`, `nav`, `main` would be better |
| ARIA labels | ❌ MISSING | Most interactive elements lack aria-label |
| Keyboard navigation | ❌ MISSING | No visible focus indicators on custom buttons |
| Color contrast | ⚠️ PARTIAL | Very small text (10px, 11px) may fail WCAG AA |
| Screen reader | ❌ MISSING | No screen reader testing, no alt text on map |
| Focus management | ❌ MISSING | Modal doesn't trap focus |
| Skip navigation | ❌ MISSING | No skip-to-content link |

---

## 8. Recommended QA Strategy (Target)

### 8.1 Test Framework Migration

```
Current: assert module (bare scripts)
Target:  Vitest (unit/component) + Playwright (E2E)
```

### 8.2 Coverage Targets

| Category | Current | Phase 1 Target | Phase 4 Target |
|:---|:---|:---|:---|
| Backend services | ~20% | 60% | 85% |
| Frontend components | 0% | 30% | 70% |
| E2E critical paths | 0% | 3 flows | 10 flows |
| API endpoints | 0% | 80% | 95% |
| Accessibility | 0% | WCAG AA audit | WCAG AA compliant |

### 8.3 CI/CD Quality Gates

```yaml
# Target GitHub Actions workflow
quality_gates:
  - tsc --noEmit            # Type safety
  - vitest run              # Unit + component tests
  - vitest run --coverage   # Coverage ≥ target
  - playwright test         # E2E critical flows
  - lighthouse ci           # Core Web Vitals
  - eslint .                # Code quality
```

---

## 9. Known Bugs & Issues

| # | Issue | Severity | Location | Description |
|:---|:---|:---|:---|:---|
| BUG-01 | Package name mismatch | LOW | `package.json` | Name is `react-example`, should be `synapse-city-ai` |
| BUG-02 | Footer dead link | LOW | `Footer.tsx:43` | `/status` route doesn't exist |
| BUG-03 | Prediction event spam | LOW | `agentSystem.ts` | `prediction.created` fires every tick during surge, flooding log with 100+ events |
| BUG-04 | Non-deterministic detour | MEDIUM | `routingEngine.ts:60` | `Math.random() > 0.3` makes routing non-reproducible |
| BUG-05 | `any` type in App.tsx | MEDIUM | `App.tsx:88-90` | `vehicles`, `agents`, `agentLogs` all typed as `any[]` |
| BUG-06 | No min/max green validation | HIGH | `simulationEngine.ts` | Phase duration has no safety bounds |
| BUG-07 | Emergency signal restore is instant | HIGH | `trafficEngine.ts:285` | Passed nodes immediately restored, no all-red interval |
| BUG-08 | WebSocket unauthenticated | HIGH | `server.ts:89` | Any client can send any command |
| BUG-09 | Full state broadcast | MEDIUM | `server.ts:107` | ~50KB sent every second to every client |
| BUG-10 | Sidebar active state bug | LOW | `Sidebar.tsx:118` | Dashboard incorrectly highlighted when on `/` (landing page) |
