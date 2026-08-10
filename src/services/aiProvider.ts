import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export interface TrafficDecisionRecommendation {
  recommendedPhase: string;
  duration: number;
  reason: string;
  confidence: number;
}

export interface AIProvider {
  getRecommendation(inputs: {
    nodeId: string;
    density: number;
    queueLength: number;
    currentPhase: string;
    weather: string;
    emergencyActive: boolean;
  }): Promise<TrafficDecisionRecommendation>;
}

// 1. Deterministic Rule-Based Provider (Deterministic, Explainable, Instant)
export class DeterministicDecisionProvider implements AIProvider {
  public async getRecommendation(inputs: {
    nodeId: string;
    density: number;
    queueLength: number;
    currentPhase: string;
    weather: string;
    emergencyActive: boolean;
  }): Promise<TrafficDecisionRecommendation> {
    
    if (inputs.emergencyActive) {
      return {
        recommendedPhase: "EMERGENCY CORRIDOR GREEN WAVE LOCK",
        duration: 45,
        reason: "Critical Siren Preemption: Automated V2X green wave lock applied for ambulance corridor clearance.",
        confidence: 1.0
      };
    }

    if (inputs.density > 75) {
      const nextPhase = inputs.currentPhase.includes('N-S') 
        ? 'N-S Straight & Pedestrian Protected (Extended)'
        : 'E-W Straight & Left Turn Phase (Extended)';
      return {
        recommendedPhase: nextPhase,
        duration: 40,
        reason: `High Junction Congestion: Density is at ${inputs.density}%. Extending active phase duration by 15s to clear bottleneck queue.`,
        confidence: 0.98
      };
    }

    if (inputs.queueLength > 12) {
      const nextPhase = inputs.currentPhase.includes('N-S')
        ? 'N-S Straight & Left Protected'
        : 'E-W Straight & Left Turn Phase';
      return {
        recommendedPhase: nextPhase,
        duration: 35,
        reason: `Junction Queue Alert: Approach queue exceeds threshold (${inputs.queueLength} vehicles waiting). Adjusting signal green time.`,
        confidence: 0.92
      };
    }

    // Default flow
    return {
      recommendedPhase: inputs.currentPhase,
      duration: 25,
      reason: `Stable Flow State: Node density is ${inputs.density}% and queue is ${inputs.queueLength} vehicles. Maintaining standard phase durations.`,
      confidence: 0.88
    };
  }
}

// 2. Generative Gemini AI Provider (Generative, Deep Context, Heuristics)
export class GeminiProvider implements AIProvider {
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    }
  }

  public async getRecommendation(inputs: {
    nodeId: string;
    density: number;
    queueLength: number;
    currentPhase: string;
    weather: string;
    emergencyActive: boolean;
  }): Promise<TrafficDecisionRecommendation> {
    if (!this.ai) {
      // Fallback to deterministic rules
      const fallback = new DeterministicDecisionProvider();
      return fallback.getRecommendation(inputs);
    }

    try {
      const prompt = `
Analyze the following traffic intersection node metrics and return a JSON object with:
"recommendedPhase" (string): recommended signal phase
"duration" (number): recommended phase duration in seconds
"reason" (string): short, clear, data-driven explainability justification
"confidence" (number): value between 0.0 and 1.0 representing optimization certainty

Intersection Node: ${inputs.nodeId}
Traffic Density: ${inputs.density}%
Queue Length: ${inputs.queueLength} vehicles
Current Phase: ${inputs.currentPhase}
Weather Friction: ${inputs.weather}
Emergency Active: ${inputs.emergencyActive}
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || "";
      const result = JSON.parse(text);
      return {
        recommendedPhase: result.recommendedPhase || inputs.currentPhase,
        duration: Number(result.duration) || 25,
        reason: result.reason || "Generative rebalance calculated successfully.",
        confidence: Number(result.confidence) || 0.9
      };
    } catch (err) {
      console.error("GeminiProvider error, falling back:", err);
      const fallback = new DeterministicDecisionProvider();
      return fallback.getRecommendation(inputs);
    }
  }
}
