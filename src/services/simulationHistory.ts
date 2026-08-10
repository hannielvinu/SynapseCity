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
    // Insert some preloaded synthetic history data if empty so weekly/monthly charts render
    if (this.runs.length === 0) {
      this.initializeSyntheticHistory();
    }
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

  private initializeSyntheticHistory() {
    // Generate 7 days of historical runs for weekly/monthly aggregation
    const strategies: ('baseline' | 'ai')[] = ['baseline', 'ai'];
    const weathers = ['clear', 'heavy_rain', 'dense_fog'];
    
    let index = 1;
    for (let day = 7; day >= 1; day--) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      
      strategies.forEach(strat => {
        const surge = 10 + Math.floor(Math.random() * 40);
        const weather = weathers[Math.floor(Math.random() * weathers.length)];
        
        const isAi = strat === 'ai';
        const delay = isAi ? 180 + Math.floor(Math.random() * 40) : 320 + Math.floor(Math.random() * 80);
        const travel = isAi ? 400 + Math.floor(Math.random() * 60) : 650 + Math.floor(Math.random() * 100);
        const queue = isAi ? 6 + Math.floor(Math.random() * 4) : 18 + Math.floor(Math.random() * 6);
        const throughput = isAi ? 1400 + Math.floor(Math.random() * 300) : 1000 + Math.floor(Math.random() * 200);
        const eta = isAi ? 45 + Math.floor(Math.random() * 15) : 85 + Math.floor(Math.random() * 25);

        this.runs.push({
          id: `sim-hist-${index++}`,
          config: {
            trafficSurge: surge,
            weather,
            speedMultiplier: 1
          },
          strategy: strat,
          results: {
            avgDelaySeconds: delay,
            travelTimeSeconds: travel,
            queueLength: queue,
            throughput,
            emergencyEtaSeconds: eta
          },
          timestamp: date.toLocaleDateString()
        });
      });
    }
    this.saveHistory();
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
