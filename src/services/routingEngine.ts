import { IntersectionNode, IncidentItem } from '../types';

export interface RouteResult {
  pathNodeIds: string[];
  etaSeconds: number;
  distanceMeters: number;
  affectedIntersections: string[];
}

export class RoutingEngine {
  private nodes: IntersectionNode[];
  private incidents: IncidentItem[];

  constructor(nodes: IntersectionNode[], incidents: IncidentItem[]) {
    this.nodes = nodes;
    this.incidents = incidents;
  }

  // A basic BFS or Dijkstra search on the intersection network
  public calculateRoute(
    originId: string, 
    destinationId: string, 
    roadConditions: string = 'clear'
  ): RouteResult {
    const queue: string[][] = [[originId]];
    const visited = new Set<string>();
    let shortestPath: string[] | null = null;

    while (queue.length > 0) {
      const path = queue.shift()!;
      const node = path[path.length - 1];

      if (node === destinationId) {
        shortestPath = path;
        break;
      }

      if (!visited.has(node)) {
        visited.add(node);
        const nodeObj = this.nodes.find(n => n.id === node);
        if (nodeObj) {
          for (const neighbor of nodeObj.connectedNodes) {
            // Check if neighbor has incident. If so, we can penalize it, but still allow pathing if no other exists
            const neighborIncident = this.incidents.find(i => i.intersectionId === neighbor && i.status !== 'resolved');
            
            // To simulate detour re-routing: if neighbor has incident, we avoid it unless necessary
            if (neighborIncident && neighbor !== destinationId && Math.random() > 0.3) {
              continue; // detour logic
            }
            queue.push([...path, neighbor]);
          }
        }
      }
    }

    // Fallback if detour blocked all paths
    if (!shortestPath) {
      const fallbackQueue: string[][] = [[originId]];
      const fallbackVisited = new Set<string>();
      while (fallbackQueue.length > 0) {
        const path = fallbackQueue.shift()!;
        const node = path[path.length - 1];
        if (node === destinationId) {
          shortestPath = path;
          break;
        }
        if (!fallbackVisited.has(node)) {
          fallbackVisited.add(node);
          const nodeObj = this.nodes.find(n => n.id === node);
          if (nodeObj) {
            for (const neighbor of nodeObj.connectedNodes) {
              fallbackQueue.push([...path, neighbor]);
            }
          }
        }
      }
    }

    const path = shortestPath || [originId, destinationId];
    
    // Calculate distance and ETA based on path nodes congestion
    let distance = 0;
    let totalDelay = 0;

    for (let i = 0; i < path.length; i++) {
      const nodeId = path[i];
      const node = this.nodes.find(n => n.id === nodeId);
      if (node) {
        distance += 800; // Assume 800m between nodes
        totalDelay += (node.densityScore * 0.4); // Add delay for congestion
        
        const activeIncident = this.incidents.find(inc => inc.intersectionId === nodeId && inc.status !== 'resolved');
        if (activeIncident) {
          totalDelay += (activeIncident.impactDelayMinutes * 60); // Incident delay
        }
      }
    }

    // Weather impact
    if (roadConditions !== 'clear') {
      totalDelay += 30; // Rain/fog delay
    }

    const baseSpeedMps = 15; // ~34mph
    const travelTime = (distance / baseSpeedMps) + totalDelay;

    return {
      pathNodeIds: path,
      etaSeconds: Math.floor(travelTime),
      distanceMeters: distance,
      affectedIntersections: path
    };
  }
}
