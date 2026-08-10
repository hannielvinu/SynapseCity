import { IncidentItem, CitizenReport } from '../types';
import { INITIAL_INCIDENTS, INITIAL_CITIZEN_REPORTS } from '../data/mockData';

export const incidentService = {
  async getIncidents(): Promise<IncidentItem[]> {
    return [...INITIAL_INCIDENTS];
  },

  async getCitizenReports(): Promise<CitizenReport[]> {
    return [...INITIAL_CITIZEN_REPORTS];
  },

  resolveIncident(incidents: IncidentItem[], incidentId: string): IncidentItem[] {
    return incidents.map(inc => inc.id === incidentId ? { ...inc, status: 'resolved' } : inc);
  }
};
