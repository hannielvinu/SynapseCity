import { CongestionRiskZone } from '../types';
import { INITIAL_CONGESTION_ZONES } from '../data/mockData';

export const predictionService = {
  async getCongestionZones(): Promise<CongestionRiskZone[]> {
    return [...INITIAL_CONGESTION_ZONES];
  }
};
