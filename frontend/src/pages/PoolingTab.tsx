
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { EmptyState } from '../components/EmptyState';

export const PoolingTab: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pooling Management</h2>
        <p className="text-gray-600 mt-1">
          Create and manage compliance pools according to FuelEU Article 21 regulations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Pools</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon="🤝"
            title="Pool Management"
            description="Create compliance pools to optimize surplus and deficit allocation between vessels."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export {};