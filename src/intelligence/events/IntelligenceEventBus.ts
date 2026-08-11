import { EventEmitter } from 'events';
import { IntelligenceEvent } from '../types';

export class IntelligenceEventBus extends EventEmitter {
  private static instance: IntelligenceEventBus;
  private eventHistory: IntelligenceEvent[] = [];

  private constructor() {
    super();
  }

  public static getInstance(): IntelligenceEventBus {
    if (!IntelligenceEventBus.instance) {
      IntelligenceEventBus.instance = new IntelligenceEventBus();
    }
    return IntelligenceEventBus.instance;
  }

  public publish(event: Omit<IntelligenceEvent, 'id' | 'timestamp'>) {
    const fullEvent: IntelligenceEvent = {
      ...event,
      id: `intel-ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now()
    };
    
    this.eventHistory.unshift(fullEvent);
    if (this.eventHistory.length > 100) {
      this.eventHistory.pop();
    }

    this.emit(event.type, fullEvent);
    this.emit('ANY', fullEvent); // Global listener
  }

  public getHistory(): IntelligenceEvent[] {
    return this.eventHistory;
  }
}
