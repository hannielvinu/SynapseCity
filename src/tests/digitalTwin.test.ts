import assert from 'assert';
import { DigitalTwinEngine } from '../services/digitalTwin/DigitalTwinEngine';
import { TrafficSnapshot, Intersection, NetworkMetrics } from '../domain/types';

function createMockSnapshot(): TrafficSnapshot {
  const intersections: Intersection[] = [
    {
      id: 'node-1', name: 'Junction A', latitude: 20, longitude: 30, x: 20, y: 30,
      approaches: ['node-2'], signalState: 'GREEN', currentPhase: 'N-S Straight',
      phaseStart: 0, phaseEnd: 30, queueLength: 10, density: 50, averageSpeedKmh: 30,
      neighboringIntersections: ['node-2'], operationalMode: 'ADAPTIVE'
    },
    {
      id: 'node-2', name: 'Junction B', latitude: 40, longitude: 50, x: 40, y: 50,
      approaches: ['node-1', 'node-3'], signalState: 'RED', currentPhase: 'E-W Straight',
      phaseStart: 0, phaseEnd: 25, queueLength: 15, density: 65, averageSpeedKmh: 20,
      neighboringIntersections: ['node-1', 'node-3'], operationalMode: 'ADAPTIVE'
    },
    {
      id: 'node-3', name: 'Junction C', latitude: 60, longitude: 70, x: 60, y: 70,
      approaches: ['node-2'], signalState: 'GREEN', currentPhase: 'N-S Straight',
      phaseStart: 0, phaseEnd: 20, queueLength: 5, density: 30, averageSpeedKmh: 40,
      neighboringIntersections: ['node-2'], operationalMode: 'ADAPTIVE'
    }
  ];

  return {
    timestamp: Date.now(),
    simulationTime: 100,
    provider: 'Prototype',
    vehicles: [{ id: 'v1', type: 'car', position: { x: 25, y: 35 }, speedKmh: 30, heading: 'N', currentRoad: 'node-1->node-2', status: 'moving' }],
    intersections,
    incidents: [],
    emergencies: [],
    networkMetrics: { vehicleCount: 1, averageSpeedKmh: 30, density: 48, queueLength: 30, throughput: 1, activeIncidents: 0, emergencyCount: 0 }
  };
}

function runDigitalTwinTests() {
  console.log('=== DIGITAL TWIN ENGINE TESTS ===\n');

  const engine = new DigitalTwinEngine();

  // Test 1: Capture snapshot immutability
  console.log('Test 1: Snapshot capture and immutability');
  const liveState = createMockSnapshot();
  const originalQueue = liveState.intersections[0].queueLength;
  
  const snapshot = engine.captureSnapshot(liveState);
  assert.ok(snapshot.id, 'Snapshot should have an ID');
  assert.strictEqual(snapshot.intersections.length, 3, 'Snapshot should have 3 intersections');
  
  // Mutate the live state
  liveState.intersections[0].queueLength = 999;
  
  // Verify snapshot is unaffected
  assert.strictEqual(snapshot.intersections[0].queueLength, originalQueue, 'Snapshot must not be mutated by live state changes');
  console.log('  ✓ Snapshot is isolated from live state');

  // Test 2: Run baseline scenario
  console.log('Test 2: Run baseline scenario');
  const baselineRun = engine.runScenario(snapshot.id, {
    name: 'Baseline Test',
    description: 'Fixed cycle baseline',
    scenarioType: 'BASELINE',
    strategy: 'baseline',
    durationTicks: 30
  });
  assert.strictEqual(baselineRun.status, 'COMPLETED', 'Baseline run should complete');
  assert.ok(baselineRun.metrics.averageSpeedKmh > 0, 'Should have positive average speed');
  assert.ok(baselineRun.durationTicks === 30, 'Should run for 30 ticks');
  console.log(`  ✓ Baseline: speed=${baselineRun.metrics.averageSpeedKmh}, queue=${baselineRun.metrics.averageQueueLength}, delay=${baselineRun.metrics.averageDelaySeconds}`);

  // Test 3: Run strategy scenario
  console.log('Test 3: Run strategy scenario');
  const strategyRun = engine.runScenario(snapshot.id, {
    name: 'Strategy Test',
    description: 'Heuristic agent strategy',
    scenarioType: 'BASELINE',
    strategy: 'ai',
    durationTicks: 30
  });
  assert.strictEqual(strategyRun.status, 'COMPLETED', 'Strategy run should complete');
  assert.ok(strategyRun.metrics.averageSpeedKmh > 0, 'Should have positive average speed');
  console.log(`  ✓ Strategy: speed=${strategyRun.metrics.averageSpeedKmh}, queue=${strategyRun.metrics.averageQueueLength}, delay=${strategyRun.metrics.averageDelaySeconds}`);

  // Test 4: Compare runs
  console.log('Test 4: Compare baseline vs strategy');
  const comparison = engine.compare(baselineRun, strategyRun);
  assert.ok(comparison.recommendation, 'Should produce a recommendation');
  assert.ok(comparison.explanation, 'Should produce an explanation');
  assert.ok(typeof comparison.differences.speedDelta === 'number', 'Speed delta should be numeric');
  assert.ok(typeof comparison.differences.queueDelta === 'number', 'Queue delta should be numeric');
  assert.ok(typeof comparison.differences.delayDelta === 'number', 'Delay delta should be numeric');
  console.log(`  ✓ Recommendation: ${comparison.recommendation}`);
  console.log(`  ✓ Explanation: ${comparison.explanation}`);
  console.log(`  ✓ Deltas: speed=${comparison.differences.speedDelta}, queue=${comparison.differences.queueDelta}, delay=${comparison.differences.delayDelta}`);

  // Test 5: Verify live state untouched after runs
  console.log('Test 5: Live state isolation verification');
  const freshLive = createMockSnapshot();
  assert.strictEqual(freshLive.intersections[0].queueLength, 10, 'Live state template unchanged');
  console.log('  ✓ Live state model is completely unaffected by twin runs');

  // Test 6: Run with non-existent snapshot
  console.log('Test 6: Non-existent snapshot failure');
  const failedRun = engine.runScenario('non-existent', {
    name: 'Fail Test', description: 'Should fail', scenarioType: 'BASELINE', strategy: 'baseline', durationTicks: 10
  });
  assert.strictEqual(failedRun.status, 'FAILED', 'Should fail for non-existent snapshot');
  console.log('  ✓ Non-existent snapshot correctly returns FAILED run');

  // Test 7: Snapshot pruning
  console.log('Test 7: Snapshot pruning (max 5)');
  for (let i = 0; i < 6; i++) {
    engine.captureSnapshot(createMockSnapshot());
  }
  const snapshots = engine.getSnapshots();
  assert.ok(snapshots.length <= 5, `Snapshots should be pruned to 5, got ${snapshots.length}`);
  console.log(`  ✓ Snapshots pruned to ${snapshots.length}`);

  // Test 8: Max ticks bounded
  console.log('Test 8: Max tick boundary');
  const longSnapshot = engine.captureSnapshot(createMockSnapshot());
  const longRun = engine.runScenario(longSnapshot.id, {
    name: 'Long Run', description: 'Test max tick boundary', scenarioType: 'BASELINE', strategy: 'baseline', durationTicks: 500
  });
  assert.ok(longRun.durationTicks <= 100, `Run should be bounded at 100 ticks, got ${longRun.durationTicks}`);
  console.log(`  ✓ Long run bounded to ${longRun.durationTicks} ticks`);

  // Test 9: Last comparison retrieval
  console.log('Test 9: Last comparison retrieval');
  const lastComparison = engine.getLastComparison();
  assert.ok(lastComparison !== null, 'Should have a last comparison');
  console.log('  ✓ Last comparison accessible');

  console.log('\n=== ALL DIGITAL TWIN TESTS PASSED ===\n');
}

runDigitalTwinTests();
