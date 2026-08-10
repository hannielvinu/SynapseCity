import { PRESET_SCENARIOS } from '../data/mockData';

export const simulationService = {
  getPresetScenarios() {
    return [...PRESET_SCENARIOS];
  }
};
