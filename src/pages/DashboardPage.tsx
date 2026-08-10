import React from 'react';
import { OverviewDashboard } from '../components/OverviewDashboard';
import { PageHeader } from '../components/layout/PageHeader';
import { IntersectionNode, CityMetrics, EmergencyUnit, CameraFeed, NavigationTab } from '../types';

interface DashboardPageProps {
  nodes: IntersectionNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  metrics: CityMetrics;
  emergencyUnits: EmergencyUnit[];
  cameraFeeds: CameraFeed[];
  isSimulating: boolean;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenAiAssistant: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Autonomous Traffic Command Center"
        subtitle="Real-time multi-agent signal optimization, edge computer vision telemetry, and active emergency corridors."
        badgeText="SYSTEM OPTIMAL (94.2%)"
        badgeType="emerald"
      />

      <OverviewDashboard {...props} />
    </div>
  );
};
