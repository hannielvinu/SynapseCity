import assert from "assert";
import { TrafficEngine } from "../services/trafficEngine";
import { AgentEventBus } from "../services/agentSystem";

function runAgentSystemTests() {
  console.log("=== RUNNING E2E MULTI-AGENT & EMERGENCY CORRIDOR INTEGRATION TESTS ===");
  const engine = new TrafficEngine();
  const bus = AgentEventBus.getInstance();

  let predictionReceived = false;
  let signalOptimizationReceived = false;
  let corridorActivatedReceived = false;

  // Subscribe to Event Bus to track workflow
  bus.subscribe('prediction.created', (ev) => {
    console.log(`[Event Received] ${ev.type} from ${ev.sender}`);
    predictionReceived = true;
  });

  bus.subscribe('signal.optimization', (ev) => {
    console.log(`[Event Received] ${ev.type} from ${ev.sender} for Node ${ev.data.nodeId}`);
    signalOptimizationReceived = true;
  });

  bus.subscribe('corridor.activated', (ev) => {
    console.log(`[Event Received] ${ev.type} for Node ${ev.data.nodeId} (Ambulance A17)`);
    corridorActivatedReceived = true;
  });

  // Step 1: Simulate traffic surge at Node 5 (J12)
  console.log("\nStep 1: Simulating traffic surge at J12...");
  engine.updateConfig({ trafficSurge: 100 });
  
  // Tick a few times to let density accumulate and trigger prediction risk warnings
  for (let i = 0; i < 5; i++) {
    engine.tick();
  }

  const state1 = engine.getFullState();
  const node5 = state1.nodes.find(n => n.id === 'node-5')!;
  console.log(`J12 density score: ${node5.densityScore}%, vehicle count: ${node5.vehicleCount}`);
  assert.ok(node5.densityScore > 30, "J12 density should spike");
  assert.ok(predictionReceived, "Prediction Agent should emit prediction.created on high risk threshold");

  // Step 2: Force AI signal timing rebalance recommendation
  console.log("\nStep 2: Intersection Agent recommending signal timing change...");
  engine.rebalanceNode('node-5');
  const state2 = engine.getFullState();
  const node5Rebalanced = state2.nodes.find(n => n.id === 'node-5')!;
  console.log(`J12 rebalanced density score: ${node5Rebalanced.densityScore}%`);
  assert.ok(node5Rebalanced.densityScore < node5.densityScore, "Density score should decrease after rebalance");
  assert.ok(signalOptimizationReceived, "Signal optimization event should trigger");

  // Step 3: Dispatch Ambulance A17
  console.log("\nStep 3: Dispatching Ambulance A17 green wave preemption...");
  engine.dispatchEmergency({
    callsign: 'Ambulance A17',
    type: 'ambulance',
    origin: 'node-2',
    destination: 'node-8',
    currentProgress: 0,
    pathNodeIds: [],
    status: 'en_route',
    etaSeconds: 0,
    timeSavedSeconds: 0,
    greenWaveActive: true
  });

  const state3 = engine.getFullState();
  const ambulance = state3.emergencyUnits.find(u => u.callsign === 'Ambulance A17')!;
  console.log(`Ambulance route path: ${ambulance.pathNodeIds.join(' → ')}`);
  assert.ok(ambulance.pathNodeIds.length > 1, "Route path should contain multiple nodes");
  assert.ok(corridorActivatedReceived, "Green Wave lock preemption corridor should be activated on start nodes");

  // Step 4: Advance ambulance progress along corridor segments
  console.log("\nStep 4: Advancing emergency vehicle progress...");
  // Simulate ticks to move ambulance and verify signal restorations
  for (let i = 0; i < 15; i++) {
    engine.tick();
  }

  const state4 = engine.getFullState();
  const finishedAmbulance = state4.emergencyUnits.find(u => u.callsign === 'Ambulance A17');
  
  if (finishedAmbulance) {
    console.log(`Ambulance progress: ${finishedAmbulance.currentProgress}%, status: ${finishedAmbulance.status}`);
  } else {
    console.log("Ambulance dispatch cleared successfully.");
  }

  // Step 5: Submit citizen report and assess incident conversion
  console.log("\nStep 5: Submitting Citizen Report...");
  engine.addCitizenReport({
    category: 'accident',
    locationName: 'Bayfront Pkwy',
    description: 'Minor collision blocking right approach lane.',
    citizenName: 'Citizen-A1'
  });

  const state5 = engine.getFullState();
  const citizenReport = state5.citizenReports[0];
  const newIncident = state5.incidents[0];
  console.log(`Report created: ${citizenReport.reportNumber} (${citizenReport.description})`);
  console.log(`Spawned Incident: ${newIncident.title} @ ${newIncident.location}`);
  
  assert.strictEqual(citizenReport.status, 'ai_verified', "Citizen report status should be verified");
  assert.ok(newIncident.title.includes('Minor collision'), "Report should convert to active incident");

  console.log("\n=== ALL E2E AGENT SYSTEM INTEGRATION TESTS PASSED SUCCESSFULLY ===");
}

try {
  runAgentSystemTests();
  process.exit(0);
} catch (e: any) {
  console.error("❌ TEST FAILURE:", e.message);
  process.exit(1);
}
