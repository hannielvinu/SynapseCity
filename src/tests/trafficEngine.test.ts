import assert from "assert";
import { TrafficEngine } from "../services/trafficEngine";

function runTests() {
  console.log("=== RUNNING TRAFFIC STATE ENGINE TESTS ===");
  const engine = new TrafficEngine();

  // Test 1: Initial state validation
  console.log("Test 1: Initial State Check...");
  const initialState = engine.getFullState();
  assert.ok(initialState.nodes.length > 0, "Nodes array should not be empty");
  assert.ok(initialState.vehicles.length > 0, "Vehicles array should not be empty");
  assert.strictEqual(initialState.metrics.congestionIndex, 20, "Congestion index starts at 20");
  console.log("✔ Test 1 Passed!");

  // Test 2: Tick state transitions
  console.log("Test 2: Tick Simulation Check...");
  const initialTimeRemaining = initialState.nodes[0].phaseTimeRemaining;
  engine.tick();
  const nextState = engine.getFullState();
  const nextTimeRemaining = nextState.nodes[0].phaseTimeRemaining;
  assert.strictEqual(nextTimeRemaining, initialTimeRemaining - 1, "Remaining time should decrease by 1 per tick");
  console.log("✔ Test 2 Passed!");

  // Test 3: Mathematical interlocking validation
  console.log("Test 3: Calculations Interlocking Check...");
  // Simulate peak surge
  engine.updateConfig({ trafficSurge: 100 });
  for (let i = 0; i < 10; i++) {
    engine.tick();
  }
  const surgedState = engine.getFullState();
  assert.ok(surgedState.metrics.congestionIndex > 20, "Congestion index should increase with traffic surge");
  assert.ok(surgedState.metrics.totalActiveVehicles > initialState.metrics.totalActiveVehicles, "Total vehicles should increase");
  console.log("✔ Test 3 Passed!");

  console.log("=== ALL TRAFFIC ENGINE TESTS PASSED SUCCESSFULLY ===");
}

try {
  runTests();
  process.exit(0);
} catch (e: any) {
  console.error("❌ TEST FAILURE:", e.message);
  process.exit(1);
}
