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
  vehicles: any[];
  intelligenceEvents?: any[];
  predictions?: any[];
  isSimulating: boolean;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenAiAssistant: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Prototype Traffic Command Center"
        subtitle="Simulated multi-agent signal optimization and prototype edge telemetry."
        badgeText="PROTOTYPE"
        badgeType="emerald"
      />

      <OverviewDashboard {...props} />
    </div>
  );
};
