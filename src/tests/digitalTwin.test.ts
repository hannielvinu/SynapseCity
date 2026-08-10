import assert from "assert";
import { TrafficEngine } from "../services/trafficEngine";

function runDigitalTwinTests() {
  console.log("=== RUNNING DIGITAL TWIN SIMULATION & ANALYTICS TESTS ===");
  const engine = new TrafficEngine();

  // Test 1: Simulation configuration parameters changes
  console.log("\nTest 1: Adjusting simulation environment configuration...");
  engine.updateConfig({ trafficSurge: 50, weather: 'dense_fog' });
  const state1 = engine.getFullState();
  assert.strictEqual(state1.simConfig.trafficSurge, 50, "Traffic surge config should be 50");
  assert.strictEqual(state1.simConfig.weather, 'dense_fog', "Weather friction should be dense_fog");

  // Test 2: Verify pluggable engine description label
  console.log("\nTest 2: Verifying pluggable engine labeling...");
  assert.ok(state1.simEngineName.includes("Prototype"), "Engine should defaults to Prototype Simulation Engine");
  
  engine.setSumoEnabled(true);
  const state2 = engine.getFullState();
  assert.ok(state2.simEngineName.includes("SUMO"), "Engine name should change to SUMO when enabled");
  engine.setSumoEnabled(false); // revert

  // Test 3: Simulation tick lifecycle and timeline progress
  console.log("\nTest 3: Advancing simulation cycles to test timeline stages...");
  engine.resetSimulation();
  
  // Ticking should advance timeline from start -> congestion
  for (let i = 0; i < 20; i++) {
    engine.tick();
  }
  const state3 = engine.getFullState();
  console.log(`Timeline stage after 20 ticks: ${state3.timelineStage}, surge: ${state3.simConfig.trafficSurge}`);
  assert.strictEqual(state3.timelineStage, 'congestion', "Timeline should advance to congestion");

  // Test 4: Strategy comparison calculations
  console.log("\nTest 4: Checking strategy comparisons...");
  engine.setStrategy('baseline');
  const baselineState = engine.getFullState();
  console.log(`Baseline delay: ${baselineState.comparison.avgDelaySeconds}s, throughput: ${baselineState.comparison.throughput}`);
  
  engine.setStrategy('ai');
  const aiState = engine.getFullState();
  console.log(`AI Strategy delay: ${aiState.comparison.avgDelaySeconds}s, throughput: ${aiState.comparison.throughput}`);
  
  assert.ok(aiState.comparison.throughput >= baselineState.comparison.throughput, "AI strategy should have higher throughput");

  // Test 5: Persisting simulation runs in history
  console.log("\nTest 5: Saving run results in history database...");
  engine.saveCurrentRun();
  const state5 = engine.getFullState();
  console.log(`Saved runs count: ${state5.history.length}`);
  assert.ok(state5.history.length > 0, "History database should record saved runs");

  // Test 6: Simulation reset triggers
  console.log("\nTest 6: Triggering simulation reset...");
  engine.resetSimulation();
  const state6 = engine.getFullState();
  assert.strictEqual(state6.timelineStage, 'start', "Timeline stage should reset back to start");

  console.log("\n=== ALL DIGITAL TWIN SIMULATION TESTS PASSED SUCCESSFULLY ===");
}

try {
  runDigitalTwinTests();
  process.exit(0);
} catch (e: any) {
  console.error("❌ TEST FAILURE:", e.message);
  process.exit(1);
}
