import React from 'react';
import { EmergencyCorridorView } from '../components/EmergencyCorridorView';
import { PageHeader } from '../components/layout/PageHeader';
import { EmergencyUnit, IntersectionNode } from '../types';

interface EmergencyCommandPageProps {
  emergencyUnits: EmergencyUnit[];
  nodes: IntersectionNode[];
  onDispatchEmergency: (newUnit: Omit<EmergencyUnit, 'id'>) => void;
  onClearEmergency: (unitId: string) => void;
}

export const EmergencyCommandPage: React.FC<EmergencyCommandPageProps> = (props) => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Emergency Corridor Command"
        subtitle="Simulated GPS preemption locking dynamic green waves for ambulances and fire rescue units."
        badgeText={`${props.emergencyUnits.length} ACTIVE DISPATCHES`}
        badgeType={props.emergencyUnits.length > 0 ? 'rose' : 'emerald'}
      />

      <EmergencyCorridorView {...props} />
    </div>
  );
};
