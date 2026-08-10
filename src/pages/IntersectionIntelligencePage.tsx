import React from 'react';
import { SignalControlView } from '../components/SignalControlView';
import { PageHeader } from '../components/layout/PageHeader';
import { IntersectionNode, SignalMode } from '../types';

interface IntersectionIntelligencePageProps {
  nodes: IntersectionNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onUpdateNodeSignalMode: (nodeId: string, mode: SignalMode) => void;
  onUpdatePhaseDuration: (nodeId: string, phaseTime: number) => void;
  onTriggerAiRebalance: (nodeId: string) => void;
}

export const IntersectionIntelligencePage: React.FC<IntersectionIntelligencePageProps> = (props) => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Intersection Intelligence & Signal Optimization"
        subtitle="Distributed edge reinforcement learning controllers managing dynamic green times, cross-bound queue balance, and pedestrian clearance windows."
        badgeText="100% EDGE SYNC"
        badgeType="emerald"
      />

      <SignalControlView {...props} />
    </div>
  );
};
