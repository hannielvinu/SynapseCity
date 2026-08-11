import { IntelligenceConfig } from './types';

export const DefaultIntelligenceConfig: IntelligenceConfig = {
  decisionIntervalTicks: 10, // Run intelligence every 10 ticks
  predictionHorizons: [15, 30, 60],
  queueThresholdHigh: 20, // Vehicles queued
  speedThresholdLow: 15, // km/h
  minGreenSeconds: 12,
  maxGreenSeconds: 60,
  yellowClearanceSeconds: 4,
  allRedClearanceSeconds: 2,
  emergencyPriorityWeight: 100, // Override value
  proposalExpirySeconds: 30
};
