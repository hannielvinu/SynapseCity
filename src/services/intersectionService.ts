import { IntersectionNode } from '../types';
import { INITIAL_INTERSECTIONS } from '../data/mockData';

export const intersectionService = {
  async getIntersections(): Promise<IntersectionNode[]> {
    return [...INITIAL_INTERSECTIONS];
  },

  async getIntersectionById(id: string): Promise<IntersectionNode | undefined> {
    return INITIAL_INTERSECTIONS.find(n => n.id === id);
  },

  updateSignalPhase(nodes: IntersectionNode[], nodeId: string, newPhase: string): IntersectionNode[] {
    return nodes.map(n => n.id === nodeId ? { ...n, currentPhase: newPhase } : n);
  }
};
