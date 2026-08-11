import React from 'react';
import { PredictiveAnalyticsView } from '../components/PredictiveAnalyticsView';
import { PageHeader } from '../components/layout/PageHeader';
import { CityMetrics } from '../types';

interface PredictionsPageProps {
  metrics: CityMetrics;
}

export const PredictionsPage: React.FC<PredictionsPageProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Predictive Congestion Forecasting"
        subtitle="Prototype algorithms forecasting bottlenecks in advance to demonstrate proactive mitigation waves."
        badgeText="PROTOTYPE FORECAST"
        badgeType="amber"
      />

      <PredictiveAnalyticsView metrics={metrics} />
    </div>
  );
};
