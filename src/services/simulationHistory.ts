import fs from 'fs';
import path from 'path';

export interface SimulationResult {
  avgDelaySeconds: number;
  travelTimeSeconds: number;
  queueLength: number;
  throughput: number;
  emergencyEtaSeconds: number;
}

export interface SimulationRun {
  id: string;
  config: {
    trafficSurge: number;
    weather: string;
    speedMultiplier: number;
  };
  strategy: 'baseline' | 'ai';
  results: SimulationResult;
  timestamp: string;
}

export class SimulationHistory {
  private runs: SimulationRun[] = [];
  private filePath = path.join(process.cwd(), 'simulation_history.json');

  constructor() {
    this.loadHistory();
    // Fabricated synthetic history generation removed to ensure analytics source of truth.
  }

  private loadHistory() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        this.runs = JSON.parse(data);
      }
    } catch (e) {
      console.error("Failed to load simulation history:", e);
    }
  }

  private saveHistory() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.runs, null, 2), 'utf-8');
    } catch (e) {
      console.error("Failed to save simulation history:", e);
    }
  }

  public addRun(run: Omit<SimulationRun, 'id' | 'timestamp'>) {
    const newRun: SimulationRun = {
      ...run,
      id: `sim-${Date.now()}`,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    };
    this.runs.unshift(newRun);
    this.saveHistory();
    return newRun;
  }

  public getHistory(): SimulationRun[] {
    return this.runs;
  }
}
