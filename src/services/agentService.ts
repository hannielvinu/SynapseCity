import { AIAgentNode, AIAgentLog } from '../types';
import { INITIAL_AGENTS, INITIAL_AGENT_LOGS } from '../data/mockData';

export const agentService = {
  async getAgents(): Promise<AIAgentNode[]> {
    return [...INITIAL_AGENTS];
  },

  async getAgentLogs(): Promise<AIAgentLog[]> {
    return [...INITIAL_AGENT_LOGS];
  }
};
