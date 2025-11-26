
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { EmptyState } from '../components/EmptyState';

export const CompareTab: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">GHG Comparison</h2>
        <p className="text-gray-600 mt-1">
          Compare baseline routes with others and analyze compliance with FuelEU targets.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon="📊"
            title="Comparison Analytics"
            description="Interactive charts and tables showing GHG intensity comparisons and compliance status."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export {};