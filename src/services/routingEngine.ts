import { IntersectionNode, IncidentItem } from '../types';

export interface RouteResult {
  pathNodeIds: string[];
  etaSeconds: number;
  distanceMeters: number;
  affectedIntersections: string[];
  scoringFactors: {
    baseTravelTime: number;
    congestionPenalty: number;
    incidentPenalty: number;
    weatherPenalty: number;
    railwayPenalty: number;
  };
}

export class RoutingEngine {
  private nodes: IntersectionNode[];
  private incidents: IncidentItem[];

  constructor(nodes: IntersectionNode[], incidents: IncidentItem[]) {
    this.nodes = nodes;
    this.incidents = incidents;
  }

  public calculateRoute(
    originId: string, 
    destinationId: string, 
    weatherStatus: string = 'clear'
  ): RouteResult {
    // Collect all possible simple paths (up to a certain depth to prevent infinite loops)
    const candidates: string[][] = [];
    const queue: { path: string[], visited: Set<string> }[] = [{ path: [originId], visited: new Set([originId]) }];

    while (queue.length > 0 && candidates.length < 5) {
      const current = queue.shift()!;
      const node = current.path[current.path.length - 1];

      if (node === destinationId) {
        candidates.push(current.path);
        continue;
      }

      const nodeObj = this.nodes.find(n => n.id === node);
      if (nodeObj) {
        for (const neighbor of nodeObj.connectedNodes) {
          if (!current.visited.has(neighbor)) {
            const newVisited = new Set(current.visited);
            newVisited.add(neighbor);
            queue.push({ path: [...current.path, neighbor], visited: newVisited });
          }
        }
      }
    }

    // Fallback if no path found
    if (candidates.length === 0) {
      candidates.push([originId, destinationId]);
    }

    // Score all candidates
    const scoredCandidates = candidates.map(path => {
      let distance = 0;
      let congestionPenalty = 0;
      let incidentPenalty = 0;
      let weatherPenalty = 0;
      let railwayPenalty = 0;

      for (let i = 0; i < path.length; i++) {
        const nodeId = path[i];
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
          distance += 800; // Assume 800m between nodes
          congestionPenalty += (node.densityScore * 0.4);
          
          const activeIncident = this.incidents.find(inc => inc.intersectionId === nodeId && inc.status !== 'resolved');
          if (activeIncident) {
            incidentPenalty += (activeIncident.impactDelayMinutes * 60);
          }

          // Mock simulated railway crossing penalty on certain nodes (e.g. Hopes)
          if (node.name.toLowerCase().includes('hopes')) {
             // 20% chance of train schedule penalty blocking it for 5 mins
             const trainBlocking = Math.random() > 0.8;
             if (trainBlocking) {
                railwayPenalty += 300;
             }
          }
        }
      }

      if (weatherStatus !== 'clear') {
        weatherPenalty += (path.length * 10); // 10s per segment for bad weather
      }

      const baseSpeedMps = 15; // ~54kmh
      const baseTravelTime = (distance / baseSpeedMps);
      const totalEta = baseTravelTime + congestionPenalty + incidentPenalty + weatherPenalty + railwayPenalty;

      return {
        path,
        totalEta,
        scoringFactors: {
          baseTravelTime,
          congestionPenalty,
          incidentPenalty,
          weatherPenalty,
          railwayPenalty
        },
        distance
      };
    });

    // Pick best route (lowest ETA)
    scoredCandidates.sort((a, b) => a.totalEta - b.totalEta);
    const bestRoute = scoredCandidates[0];

    return {
      pathNodeIds: bestRoute.path,
      etaSeconds: Math.floor(bestRoute.totalEta),
      distanceMeters: bestRoute.distance,
      affectedIntersections: bestRoute.path,
      scoringFactors: bestRoute.scoringFactors
    };
  }
}
