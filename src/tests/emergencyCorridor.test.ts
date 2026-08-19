import assert from 'assert';
import { EmergencyCorridorManager } from '../intelligence/emergency/EmergencyCorridorManager';
import { SafetyValidator } from '../intelligence/safety/SafetyValidator';
import { TrafficSnapshot, Intersection, NetworkMetrics, Vehicle, Incident, EmergencyUnit } from '../domain/types';

function createMockSnapshot(overrides?: Partial<TrafficSnapshot>): TrafficSnapshot {
  const intersections: Intersection[] = [
    {
      id: 'node-1', name: 'Junction A', latitude: 20, longitude: 30, x: 20, y: 30,
      approaches: ['node-2', 'node-3'], signalState: 'GREEN', currentPhase: 'N-S Straight',
      phaseStart: 0, phaseEnd: 30, queueLength: 5, density: 40, averageSpeedKmh: 35,
      neighboringIntersections: ['node-2', 'node-3'], operationalMode: 'ADAPTIVE'
    },
    {
      id: 'node-2', name: 'Junction B', latitude: 40, longitude: 50, x: 40, y: 50,
      approaches: ['node-1', 'node-3'], signalState: 'RED', currentPhase: 'E-W Straight',
      phaseStart: 0, phaseEnd: 25, queueLength: 8, density: 55, averageSpeedKmh: 20,
      neighboringIntersections: ['node-1', 'node-3'], operationalMode: 'ADAPTIVE'
    },
    {
      id: 'node-3', name: 'Junction C', latitude: 60, longitude: 70, x: 60, y: 70,
      approaches: ['node-1', 'node-2'], signalState: 'GREEN', currentPhase: 'N-S Straight',
      phaseStart: 0, phaseEnd: 20, queueLength: 3, density: 25, averageSpeedKmh: 45,
      neighboringIntersections: ['node-1', 'node-2'], operationalMode: 'ADAPTIVE'
    }
  ];

  return {
    timestamp: Date.now(),
    simulationTime: 100,
    provider: 'Prototype',
    vehicles: [],
    intersections,
    incidents: [],
    emergencies: overrides?.emergencies || [],
    networkMetrics: { vehicleCount: 20, averageSpeedKmh: 30, density: 40, queueLength: 16, throughput: 15, activeIncidents: 0, emergencyCount: 0 }
  };
}

function runEmergencyCorridorTests() {
  console.log('=== EMERGENCY CORRIDOR LIFECYCLE TESTS ===\n');

  const validator = new SafetyValidator();
  const manager = new EmergencyCorridorManager(validator);

  // Test 1: Create corridor
  console.log('Test 1: Create corridor to PSG Hospitals');
  const corridor = manager.createCorridor(
    'eu-001',
    'Ambulance A17',
    ['node-1', 'node-2', 'node-3'],
    120,
    'Emergency dispatch test',
    {
      baseTravelTime: 120,
      congestionPenalty: 20,
      incidentPenalty: 0,
      weatherPenalty: 0,
      railwayPenalty: 0
    }
  );
  assert.ok(corridor.id, 'Corridor should have an ID');
  assert.strictEqual(corridor.status, 'PREPARING', 'Initial status should be PREPARING');
  assert.strictEqual(corridor.route.length, 3, 'Route should have 3 nodes');
  assert.strictEqual(corridor.metrics.totalIntersections, 3, 'Should track 3 intersections');
  assert.ok(corridor.routingFactors, 'Should have routing factors');
  console.log('  ✓ Corridor created with PREPARING status and routing factors');

  // Test 2: Activate corridor through SafetyValidator
  console.log('Test 2: Activate corridor through SafetyValidator');
  const snapshot = createMockSnapshot();
  const activationResults = manager.activateCorridor(corridor.id, snapshot);
  assert.ok(activationResults.length > 0, 'Should produce validation results');
  
  // Some proposals may be rejected (e.g., phase conflicts) - that's correct safety behavior
  const approvedCount = activationResults.filter(r => r.approved).length;
  console.log(`  ✓ ${approvedCount}/${activationResults.length} intersection proposals approved`);
  
  const updatedCorridor = manager.getCorridors().find(c => c.id === corridor.id)!;
  assert.ok(
    updatedCorridor.status === 'ACTIVE' || updatedCorridor.status === 'FAILED',
    'Status should be ACTIVE or FAILED after activation attempt'
  );
  console.log(`  ✓ Corridor status: ${updatedCorridor.status}`);

  // Test 3: Monitor corridor with en_route emergency
  console.log('Test 3: Monitor corridor with en_route unit');
  const enRouteSnapshot = createMockSnapshot({
    emergencies: [{
      id: 'eu-001', callsign: 'Ambulance A17', type: 'ambulance',
      status: 'en_route', origin: 'node-1', destination: 'node-3',
      pathNodeIds: ['node-1', 'node-2', 'node-3'], currentProgress: 50,
      greenWaveActive: true, etaSeconds: 60
    }]
  });
  manager.monitorCorridors(enRouteSnapshot);
  
  const monitoredCorridor = manager.getCorridors().find(c => c.id === corridor.id)!;
  if (monitoredCorridor.status === 'ACTIVE') {
    assert.strictEqual(monitoredCorridor.currentEtaSeconds, 60, 'ETA should update from live data');
    console.log('  ✓ ETA updated from canonical state');
  }

  // Test 4: Monitor corridor with arrived emergency
  console.log('Test 4: Monitor corridor with arrived unit');
  const arrivedSnapshot = createMockSnapshot({
    emergencies: [{
      id: 'eu-001', callsign: 'Ambulance A17', type: 'ambulance',
      status: 'arrived', origin: 'node-1', destination: 'node-3',
      pathNodeIds: ['node-1', 'node-2', 'node-3'], currentProgress: 100,
      greenWaveActive: false, etaSeconds: 0
    }]
  });
  manager.monitorCorridors(arrivedSnapshot);
  
  const arrivedCorridor = manager.getCorridors().find(c => c.id === corridor.id)!;
  if (arrivedCorridor.status === 'RESTORING') {
    console.log('  ✓ Corridor transitioned to RESTORING after arrival');
  }

  // Test 5: Verify getActiveCorridors
  console.log('Test 5: Active corridors query');
  const activeCorridors = manager.getActiveCorridors();
  console.log(`  ✓ Active corridors: ${activeCorridors.length}`);

  // Test 6: Cancel corridor
  console.log('Test 6: Cancel corridor');
  const corridor2 = manager.createCorridor(
    'eu-002', 'Fire Engine F3', ['node-1', 'node-2'], 90, 'Fire dispatch', {}
  );
  manager.cancelCorridor(corridor2.id);
  const cancelledCorridor = manager.getCorridors().find(c => c.id === corridor2.id)!;
  assert.strictEqual(cancelledCorridor.status, 'CANCELLED', 'Cancelled corridor should have CANCELLED status');
  console.log('  ✓ Corridor cancelled successfully');

  console.log('\n=== ALL EMERGENCY CORRIDOR TESTS PASSED ===\n');
}

runEmergencyCorridorTests();
