import { TrafficSnapshot } from '../../domain/types';
import { PredictionResult } from '../types';

export interface PredictionProvider {
  /**
   * Generates congestion and traffic predictions based on the current authoritative state.
   */
  generatePredictions(state: TrafficSnapshot): PredictionResult[];
}
