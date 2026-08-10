import React from 'react';
import { ComputerVisionView } from '../components/ComputerVisionView';
import { PageHeader } from '../components/layout/PageHeader';
import { CameraFeed } from '../types';

interface LiveTrafficPageProps {
  cameraFeeds: CameraFeed[];
}

export const LiveTrafficPage: React.FC<LiveTrafficPageProps> = ({ cameraFeeds }) => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Traffic & Computer Vision Feeds"
        subtitle="4K edge AI perception pipeline performing multi-class vehicle detection, velocity radar scanning, and license plate optical character recognition."
        badgeText="4K VISION (60 FPS)"
        badgeType="cyan"
      />

      <ComputerVisionView cameraFeeds={cameraFeeds} />
    </div>
  );
};
