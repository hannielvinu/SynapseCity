import { EmergencyUnit } from '../types';
import { INITIAL_EMERGENCY_UNITS } from '../data/mockData';

export const emergencyService = {
  async getEmergencyUnits(): Promise<EmergencyUnit[]> {
    return [...INITIAL_EMERGENCY_UNITS];
  },

  toggleGreenWave(units: EmergencyUnit[], unitId: string): EmergencyUnit[] {
    return units.map(u => 
      u.id === unitId 
        ? { ...u, greenWaveActive: !u.greenWaveActive, corridorStatus: !u.greenWaveActive ? 'corridor_active' : 'standby' } 
        : u
    );
  }
};
