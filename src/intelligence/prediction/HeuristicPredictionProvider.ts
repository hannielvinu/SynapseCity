import { PredictionProvider } from './PredictionProvider';
import { TrafficSnapshot, Intersection } from '../../domain/types';
import { PredictionResult } from '../types';
import { DefaultIntelligenceConfig } from '../config';

export class HeuristicPredictionProvider implements PredictionProvider {
  
  public generatePredictions(state: TrafficSnapshot): PredictionResult[] {
    const predictions: PredictionResult[] = [];
    const now = Date.now();
    
    // Evaluate each intersection based on canonical state
    for (const intersection of state.intersections) {
      // Find incidents affecting this intersection
      const localIncidents = state.incidents.filter(i => 
        i.intersectionId === intersection.id && i.status !== 'resolved'
      );
      
      const isIncidentActive = localIncidents.length > 0;
      
      // Calculate growth factors
      const currentDensity = intersection.density;
      const currentQueue = intersection.queueLength;
      const currentSpeed = intersection.averageSpeedKmh;
      
      for (const horizon of DefaultIntelligenceConfig.predictionHorizons) {
        // Simple heuristic model
        let projectedQueue = currentQueue;
        let projectedDensity = currentDensity;
        let projectedSpeed = currentSpeed;
        
        let reason = "Normal traffic progression.";
        let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
        let action = "Continue baseline signal timings.";
        let confidence = 0.85;

        // Apply heuristic rules based on horizon length
        const timeFactor = horizon / 15; // 1x for 15m, 2x for 30m, 4x for 60m
        
        if (isIncidentActive) {
          projectedQueue += 15 * timeFactor;
          projectedDensity = Math.min(100, currentDensity + 20 * timeFactor);
          projectedSpeed = Math.max(5, currentSpeed - 10 * timeFactor);
          riskLevel = 'CRITICAL';
          reason = `Active incident detected. Expected compounding delays over ${horizon} minutes.`;
          action = "Activate emergency detour phases and extend clearing green.";
          confidence = 0.95; // Highly certain incidents cause issues
        } else if (currentQueue > DefaultIntelligenceConfig.queueThresholdHigh && currentSpeed < DefaultIntelligenceConfig.speedThresholdLow) {
          // Congestion is forming
          projectedQueue += 10 * timeFactor;
          projectedDensity = Math.min(100, currentDensity + 15 * timeFactor);
          projectedSpeed = Math.max(2, currentSpeed - 5 * timeFactor);
          riskLevel = horizon > 30 ? 'CRITICAL' : 'HIGH';
          reason = `Increasing demand + falling speed observed. Queue expected to grow over ${horizon} minutes.`;
          action = "Shift to queue-flushing phase ratio.";
          confidence = 0.88;
        } else if (currentDensity > 60) {
          projectedQueue += 5 * timeFactor;
          projectedDensity = Math.min(90, currentDensity + 5 * timeFactor);
          riskLevel = 'MODERATE';
          reason = `Sustained high density. Approaching saturation in ${horizon} minutes.`;
          action = "Monitor approach volumes. Ready adaptive mode.";
          confidence = 0.75; // Less certain on medium density
        } else {
          // Flow is free, likely to remain free or stabilize
          projectedQueue = Math.max(0, currentQueue - 2 * timeFactor);
          projectedDensity = Math.max(10, currentDensity - 5 * timeFactor);
        }

        // Only emit predictions if risk is MODERATE or higher to avoid noise,
        // or if we specifically want to track it.
        if (riskLevel !== 'LOW') {
          predictions.push({
            timestamp: now,
            horizonMinutes: horizon,
            affectedIntersectionId: intersection.id,
            currentState: {
              density: currentDensity,
              queueLength: currentQueue,
              averageSpeedKmh: currentSpeed
            },
            predictedState: {
              density: Math.round(projectedDensity),
              queueLength: Math.round(projectedQueue),
              averageSpeedKmh: Math.round(projectedSpeed)
            },
            riskLevel,
            confidence,
            reason,
            recommendedAction: action
          });
        }
      }
    }

    return predictions;
  }
}
