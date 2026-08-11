import dotenv from 'dotenv';
dotenv.config();

export const SimulationConfiguration = {
  SUMO_HOME: process.env.SUMO_HOME || '',
  SUMO_BINARY: process.env.SUMO_BINARY || 'sumo',
  SUMO_CONFIG: process.env.SUMO_CONFIG || './sumo_network/vellore.sumocfg',
  SUMO_NETWORK: process.env.SUMO_NETWORK || './sumo_network/vellore.net.xml',
  FALLBACK_TO_PROTOTYPE: true
};
