import { TrafficSnapshot, NetworkMetrics } from '../../domain/types';
import { 
  DigitalTwinSnapshot, 
  DigitalTwinScenario, 
  DigitalTwinRun, 
  DigitalTwinRunMetrics,
  DigitalTwinComparison, 
  DigitalTwinRecommendation 
} from '../../intelligence/types';
import { IntelligenceEventBus } from '../../intelligence/events/IntelligenceEventBus';

/**
 * DigitalTwinEngine — Isolated simulation sandbox for strategy comparison.
 * 
 * CRITICAL INVARIANT: Digital Twin operates on deep-copied snapshots.
 * It NEVER mutates the live TrafficStore or live TrafficSnapshot.
 * 
 * Workflow:
 * 1. captureSnapshot(liveState) — deep copy current canonical state
 * 2. runScenario(snapshot, scenario) — simulate N ticks on cloned data
 * 3. compare(baselineRun, strategyRun) — compute actual metric deltas
 */
export class DigitalTwinEngine {
  private snapshots: Map<string, DigitalTwinSnapshot> = new Map();
  private runs: Map<string, DigitalTwinRun> = new Map();
  private lastComparison: DigitalTwinComparison | null = null;
  private eventBus: IntelligenceEventBus;

  private static readonly MAX_SNAPSHOTS = 5;
  private static readonly MAX_RUN_TICKS = 100;

  constructor() {
    this.eventBus = IntelligenceEventBus.getInstance();
  }

  /**
   * Capture a deep copy of the current live state.
   * The snapshot is completely independent of live state.
   */
  public captureSnapshot(liveState: TrafficSnapshot): DigitalTwinSnapshot {
    // CRITICAL: Deep copy to guarantee immutability
    const snapshot: DigitalTwinSnapshot = {
      id: `dtsnapshot-${Date.now()}`,
      createdAt: Date.now(),
      simulationTime: liveState.simulationTime,
      provider: liveState.provider,
      intersections: JSON.parse(JSON.stringify(liveState.intersections)),
      vehicles: JSON.parse(JSON.stringify(liveState.vehicles)),
      incidents: JSON.parse(JSON.stringify(liveState.incidents)),
      emergencies: JSON.parse(JSON.stringify(liveState.emergencies)),
      networkMetrics: JSON.parse(JSON.stringify(liveState.networkMetrics))
    };

    this.snapshots.set(snapshot.id, snapshot);

    // Prune old snapshots
    if (this.snapshots.size > DigitalTwinEngine.MAX_SNAPSHOTS) {
      const oldest = Array.from(this.snapshots.keys())[0];
      this.snapshots.delete(oldest);
    }

    this.eventBus.publish({
      type: 'DIGITAL_TWIN_SNAPSHOT_CAPTURED',
      data: { snapshotId: snapshot.id, simulationTime: snapshot.simulationTime }
    });

    return snapshot;
  }

  /**
   * Run an isolated simulation scenario on a snapshot.
   * Returns a DigitalTwinRun with measured metrics.
   * 
   * This is a synchronous, bounded computation — no live thread dependency.
   */
  public runScenario(snapshotId: string, scenario: DigitalTwinScenario): DigitalTwinRun {
    const snapshot = this.snapshots.get(snapshotId);
    if (!snapshot) {
      return this.createFailedRun(scenario, 'Snapshot not found');
    }

    const ticks = Math.min(scenario.durationTicks, DigitalTwinEngine.MAX_RUN_TICKS);
    const run: DigitalTwinRun = {
      id: `dtrun-${Date.now()}-${scenario.strategy}`,
      scenario,
      startTime: Date.now(),
      durationTicks: ticks,
      metrics: { averageSpeedKmh: 0, averageQueueLength: 0, maxQueueLength: 0, vehicleThroughput: 0, averageDelaySeconds: 0, activeIncidents: 0 },
      status: 'RUNNING'
    };

    try {
      // Deep copy the snapshot data for this run
      const simIntersections: any[] = JSON.parse(JSON.stringify(snapshot.intersections));
      const simMetrics: NetworkMetrics = JSON.parse(JSON.stringify(snapshot.networkMetrics));

      // Apply scenario modifications
      if (scenario.scenarioType === 'PEAK_HOUR') {
        simIntersections.forEach(i => {
          i.queueLength = Math.min(30, i.queueLength + 8);
          i.density = Math.min(100, i.density + 25);
          i.averageSpeedKmh = Math.max(5, i.averageSpeedKmh - 10);
        });
      } else if (scenario.scenarioType === 'HEAVY_RAIN') {
        simIntersections.forEach(i => {
          i.averageSpeedKmh = Math.max(5, i.averageSpeedKmh * 0.75);
          i.density = Math.min(100, i.density + 10);
        });
      } else if (scenario.scenarioType === 'INCIDENT') {
        if (simIntersections.length > 0) {
          const targetIdx = Math.floor(simIntersections.length / 2);
          simIntersections[targetIdx].queueLength += 20;
          simIntersections[targetIdx].density = Math.min(100, simIntersections[targetIdx].density + 40);
          simIntersections[targetIdx].averageSpeedKmh = 5;
        }
      }

      // Simulate ticks
      let totalSpeed = 0;
      let totalQueue = 0;
      let maxQueue = 0;
      let totalDelay = 0;

      for (let tick = 0; tick < ticks; tick++) {
        // Simple deterministic tick simulation on cloned data
        for (const intersection of simIntersections) {
          if (scenario.strategy === 'ai') {
            // AI strategy: adaptive response to congestion
            if (intersection.queueLength > 10) {
              intersection.queueLength = Math.max(0, intersection.queueLength - 2);
              intersection.averageSpeedKmh = Math.min(60, intersection.averageSpeedKmh + 1);
              intersection.density = Math.max(10, intersection.density - 2);
            } else {
              intersection.queueLength = Math.max(0, intersection.queueLength - 0.5);
              intersection.averageSpeedKmh = Math.min(50, intersection.averageSpeedKmh + 0.3);
            }
          } else {
            // Baseline: fixed cycle — queue may grow or stabilize
            if (intersection.density > 50) {
              intersection.queueLength = Math.min(30, intersection.queueLength + 0.5);
              intersection.averageSpeedKmh = Math.max(10, intersection.averageSpeedKmh - 0.2);
            } else {
              intersection.queueLength = Math.max(0, intersection.queueLength - 0.3);
            }
          }
        }

        // Aggregate per-tick metrics
        const tickAvgSpeed = simIntersections.reduce((acc, i) => acc + i.averageSpeedKmh, 0) / simIntersections.length;
        const tickAvgQueue = simIntersections.reduce((acc, i) => acc + i.queueLength, 0) / simIntersections.length;
        const tickMaxQueue = Math.max(...simIntersections.map(i => i.queueLength));
        const tickDelay = simIntersections.reduce((acc, i) => acc + Math.max(0, i.queueLength * 2), 0) / simIntersections.length;

        totalSpeed += tickAvgSpeed;
        totalQueue += tickAvgQueue;
        maxQueue = Math.max(maxQueue, tickMaxQueue);
        totalDelay += tickDelay;
      }

      run.metrics = {
        averageSpeedKmh: Math.round((totalSpeed / ticks) * 10) / 10,
        averageQueueLength: Math.round((totalQueue / ticks) * 10) / 10,
        maxQueueLength: Math.round(maxQueue * 10) / 10,
        vehicleThroughput: snapshot.networkMetrics.vehicleCount, // Preserved from snapshot
        averageDelaySeconds: Math.round((totalDelay / ticks) * 10) / 10,
        activeIncidents: snapshot.networkMetrics.activeIncidents
      };

      run.endTime = Date.now();
      run.status = 'COMPLETED';

    } catch (e) {
      console.error('[DigitalTwinEngine] Run failed:', e);
      run.status = 'FAILED';
      run.endTime = Date.now();
    }

    this.runs.set(run.id, run);
    return run;
  }

  /**
   * Compare baseline vs strategy runs.
   * Recommendation is derived from ACTUAL measured metrics.
   */
  public compare(baselineRun: DigitalTwinRun, strategyRun: DigitalTwinRun): DigitalTwinComparison {
    if (baselineRun.status !== 'COMPLETED' || strategyRun.status !== 'COMPLETED') {
      return {
        baselineRun,
        strategyRun,
        differences: { speedDelta: 0, queueDelta: 0, throughputDelta: 0, delayDelta: 0 },
        recommendation: 'INCONCLUSIVE',
        explanation: 'One or both runs did not complete successfully.'
      };
    }

    const bm = baselineRun.metrics;
    const sm = strategyRun.metrics;

    const speedDelta = Math.round((sm.averageSpeedKmh - bm.averageSpeedKmh) * 10) / 10;
    const queueDelta = Math.round((sm.averageQueueLength - bm.averageQueueLength) * 10) / 10;
    const throughputDelta = sm.vehicleThroughput - bm.vehicleThroughput;
    const delayDelta = Math.round((sm.averageDelaySeconds - bm.averageDelaySeconds) * 10) / 10;

    // Determine recommendation from actual data
    let recommendation: DigitalTwinRecommendation;
    let explanation: string;

    const speedImprovement = speedDelta > 0;
    const queueImprovement = queueDelta < 0;
    const delayImprovement = delayDelta < 0;

    const improvementCount = [speedImprovement, queueImprovement, delayImprovement].filter(Boolean).length;
    const regressionCount = [!speedImprovement, !queueImprovement, !delayImprovement].filter(Boolean).length;

    if (improvementCount >= 2) {
      recommendation = 'STRATEGY_FAVORED';
      const parts: string[] = [];
      if (speedImprovement) parts.push(`improved average speed by ${Math.abs(speedDelta).toFixed(1)} km/h`);
      if (queueImprovement) parts.push(`reduced average queue by ${Math.abs(queueDelta).toFixed(1)} vehicles`);
      if (delayImprovement) parts.push(`reduced average delay by ${Math.abs(delayDelta).toFixed(1)}s`);
      explanation = `Coordinated strategy ${parts.join(', ')} in this simulation scenario.`;
    } else if (regressionCount >= 2) {
      recommendation = 'BASELINE_FAVORED';
      const parts: string[] = [];
      if (!speedImprovement && speedDelta !== 0) parts.push(`speed decreased by ${Math.abs(speedDelta).toFixed(1)} km/h`);
      if (!queueImprovement && queueDelta !== 0) parts.push(`queue increased by ${Math.abs(queueDelta).toFixed(1)} vehicles`);
      if (!delayImprovement && delayDelta !== 0) parts.push(`delay increased by ${Math.abs(delayDelta).toFixed(1)}s`);
      explanation = `Baseline performed better: ${parts.join(', ')}.`;
    } else if (Math.abs(speedDelta) < 1 && Math.abs(queueDelta) < 1 && Math.abs(delayDelta) < 2) {
      recommendation = 'NO_MATERIAL_DIFFERENCE';
      explanation = 'Both strategies produced similar results in this scenario.';
    } else {
      recommendation = 'INCONCLUSIVE';
      explanation = 'Mixed results — strategy improved some metrics but worsened others.';
    }

    const comparison: DigitalTwinComparison = {
      baselineRun,
      strategyRun,
      differences: { speedDelta, queueDelta, throughputDelta, delayDelta },
      recommendation,
      explanation
    };

    this.lastComparison = comparison;

    this.eventBus.publish({
      type: 'DIGITAL_TWIN_RUN_COMPLETED',
      data: {
        recommendation,
        explanation,
        differences: comparison.differences,
        baselineMetrics: bm,
        strategyMetrics: sm
      }
    });

    return comparison;
  }

  public getSnapshots(): DigitalTwinSnapshot[] {
    return Array.from(this.snapshots.values());
  }

  public getLastComparison(): DigitalTwinComparison | null {
    return this.lastComparison;
  }

  private createFailedRun(scenario: DigitalTwinScenario, reason: string): DigitalTwinRun {
    return {
      id: `dtrun-failed-${Date.now()}`,
      scenario,
      startTime: Date.now(),
      endTime: Date.now(),
      durationTicks: 0,
      metrics: { averageSpeedKmh: 0, averageQueueLength: 0, maxQueueLength: 0, vehicleThroughput: 0, averageDelaySeconds: 0, activeIncidents: 0 },
      status: 'FAILED'
    };
  }
}
