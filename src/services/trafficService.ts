import { CameraFeed, TransitRoute } from '../types';
import { INITIAL_CAMERA_FEEDS, INITIAL_TRANSIT_ROUTES } from '../data/mockData';

export const trafficService = {
  async getCameraFeeds(): Promise<CameraFeed[]> {
    return [...INITIAL_CAMERA_FEEDS];
  },

  async getTransitRoutes(): Promise<TransitRoute[]> {
    return [...INITIAL_TRANSIT_ROUTES];
  }
};
