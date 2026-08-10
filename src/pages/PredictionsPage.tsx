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
        subtitle="Graph neural networks & spatial-temporal LSTM engines forecasting bottlenecks 15, 30, and 60 minutes in advance to apply proactive mitigation waves."
        badgeText="LSTM FORECAST (96.4% ACC)"
        badgeType="amber"
      />

      <PredictiveAnalyticsView metrics={metrics} />
    </div>
  );
};
