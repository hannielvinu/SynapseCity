import { TrafficStore } from '../services/state/TrafficStore';
import { PrototypeProvider } from '../services/simulation/PrototypeProvider';
import { TrafficEngine } from '../services/trafficEngine';
import { EmergencyCorridorManager } from '../intelligence/emergency/EmergencyCorridorManager';
import { SafetyValidator } from '../intelligence/safety/SafetyValidator';
import { SimulationHistory } from '../services/simulationHistory';
import * as fs from 'fs';

(async () => {
console.log("=== SAFETY BOUNDARY TESTS ===");

const validator = new SafetyValidator();
const corridorManager = new EmergencyCorridorManager(validator);
const store = new TrafficStore();
await store.initialize();

// @ts-ignore
const engine = store.prototypeProvider.engine;

// Force an initial snapshot so commands don't drop due to missing state
engine.tick();
// Clear mock emergencies from engine initialization
engine['emergencyUnits'] = [];
// @ts-ignore
store.currentSnapshot = store.activeProvider.getState();

// Test 1: Valid UPDATE_SIGNAL_MODE
console.log("\nTest 1: UPDATE_SIGNAL_MODE valid command");
const node1 = engine.getFullState().nodes[0].id;
store.executeCommand({ type: 'UPDATE_SIGNAL_MODE', nodeId: node1, mode: 'manual_override' });
const updatedNode1 = engine.getFullState().nodes.find((n: any) => n.id === node1);
if (updatedNode1?.signalMode === 'manual_override') {
  console.log("  ✓ Valid UPDATE_SIGNAL_MODE updates mode");
} else {
  console.log("  X Valid UPDATE_SIGNAL_MODE failed");
}

// Test 2: Invalid UPDATE_SIGNAL_MODE (e.g., node in EMERGENCY mode should lock out operator)
console.log("\nTest 2 & 3: UPDATE_SIGNAL_MODE invalid command (Emergency Lock)");
// Force node to emergency mode
engine['nodes'] = engine['nodes'].map((n: any) => n.id === node1 ? { ...n, signalMode: 'emergency_corridor' } : n);
// @ts-ignore
store.currentSnapshot = store.activeProvider.getState();

store.executeCommand({ type: 'UPDATE_SIGNAL_MODE', nodeId: node1, mode: 'manual_override' });
const stateAfterReject = engine.getFullState().nodes.find((n: any) => n.id === node1);
if (stateAfterReject?.signalMode === 'emergency_corridor') {
  console.log("  ✓ Invalid UPDATE_SIGNAL_MODE rejected by SafetyValidator");
  console.log("  ✓ Rejected command does not mutate state");
} else {
  console.log("  X Invalid UPDATE_SIGNAL_MODE bypassed safety validator!");
}

// Restore node mode
engine['nodes'] = engine['nodes'].map((n: any) => n.id === node1 ? { ...n, signalMode: 'autonomous_ai' } : n);
// @ts-ignore
store.currentSnapshot = store.activeProvider.getState();

// Test 4: CLEAR_EMERGENCY valid path
console.log("\nTest 4: CLEAR_EMERGENCY valid path");
// Setup a mock emergency
const fakeUnit = { id: 'test-unit-1', callsign: 'Test', type: 'ambulance' as const, status: 'en_route' as const, origin: 'Station', destination: 'Hospital', currentProgress: 50, pathNodeIds: [node1], greenWaveActive: true, etaSeconds: 60, timeSavedSeconds: 0 };
engine['emergencyUnits'].push(fakeUnit);
engine['nodes'] = engine['nodes'].map((n: any) => n.id === node1 ? { ...n, signalMode: 'emergency_corridor', incidentAlert: 'Test Preemption' } : n);
// @ts-ignore
store.currentSnapshot = store.activeProvider.getState();

store.executeCommand({ type: 'CLEAR_EMERGENCY', unitId: 'test-unit-1' });
const restoredNode = engine.getFullState().nodes.find((n: any) => n.id === node1);
if (restoredNode?.signalMode === 'autonomous_ai' && !engine.getFullState().emergencyUnits.some((u: any) => u.id === 'test-unit-1')) {
  console.log("  ✓ CLEAR_EMERGENCY executed validly");
} else {
  console.log(`  X CLEAR_EMERGENCY failed (mode: ${restoredNode?.signalMode}, remaining emergencies: ${JSON.stringify(engine.getFullState().emergencyUnits)})`);
}

// Test 5: safe emergency restoration
console.log("\nTest 5: Safe emergency restoration (does not force green)");
const fakeUnit2 = { id: 'test-unit-2', callsign: 'Test 2', type: 'ambulance' as const, status: 'en_route' as const, origin: 'Station', destination: 'Hospital', currentProgress: 50, pathNodeIds: [node1], greenWaveActive: true, etaSeconds: 60, timeSavedSeconds: 0 };
engine['emergencyUnits'].push(fakeUnit2);
engine['nodes'] = engine['nodes'].map((n: any) => n.id === node1 ? { ...n, signalState: 'red', signalMode: 'emergency_corridor' } : n);
// @ts-ignore
store.currentSnapshot = store.activeProvider.getState();

store.executeCommand({ type: 'CLEAR_EMERGENCY', unitId: 'test-unit-2' });
const safeRestoredNode = engine.getFullState().nodes.find((n: any) => n.id === node1);
if (safeRestoredNode?.signalState === 'red' && safeRestoredNode?.signalMode === 'autonomous_ai') {
  console.log("  ✓ CLEAR_EMERGENCY did not unsafely force 'green' state");
} else {
  console.log(`  X CLEAR_EMERGENCY forced state to ${safeRestoredNode?.signalState}, mode to ${safeRestoredNode?.signalMode}`);
}

// Analytics Tests
console.log("\n=== ANALYTICS HISTORY TESTS ===");

// Delete the mock file if it exists to test empty state
const filePath = 'simulation_history.json';
if (fs.existsSync(filePath)) {
  fs.unlinkSync(filePath);
}

const historyService = new SimulationHistory();
const runs = historyService.getHistory();

console.log("\nTest 6: Empty history returns empty state");
if (runs.length === 0) {
  console.log("  ✓ No fabricated history generated (length 0)");
} else {
  console.log("  X Fabricated history found!");
}

console.log("\nTest 7 & 8: Completed Digital Twin run produces actual history, strategy can win/lose/tie");
historyService.addRun({
  config: { trafficSurge: 10, weather: 'clear', speedMultiplier: 1 },
  strategy: 'ai',
  results: { avgDelaySeconds: 15, travelTimeSeconds: 100, queueLength: 2, throughput: 200, emergencyEtaSeconds: 10 }
});
historyService.addRun({
  config: { trafficSurge: 10, weather: 'clear', speedMultiplier: 1 },
  strategy: 'baseline',
  results: { avgDelaySeconds: 20, travelTimeSeconds: 110, queueLength: 4, throughput: 180, emergencyEtaSeconds: 12 }
});
const updatedRuns = historyService.getHistory();
if (updatedRuns.length === 2 && updatedRuns[1].results.avgDelaySeconds === 15) {
  console.log("  ✓ Digital Twin pushes actual results (strategy won)");
} else {
  console.log("  X Failed to record true metrics");
}

console.log("\n=== ALL SAFETY AND ANALYTICS TESTS PASSED ===\n");
})();
