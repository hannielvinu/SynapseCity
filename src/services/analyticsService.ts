import { CityMetrics } from '../types';
import { INITIAL_CITY_METRICS } from '../data/mockData';

export const analyticsService = {
  async getCityMetrics(): Promise<CityMetrics> {
    return { ...INITIAL_CITY_METRICS };
  }
};
