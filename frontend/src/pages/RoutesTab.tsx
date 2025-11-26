// src/pages/RoutesTab.tsx - FIXED error handling
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { RoutesTable } from '../components/Routes/RoutesTable';
import { RouteFilters } from '../components/Routes/RouteFilters';
import { useRoutes, useSetBaseline } from '../hooks/useRoutes';
import { RouteFilters as Filters } from '../core/entities/Route';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const RoutesTab: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({});
  const [settingBaseline, setSettingBaseline] = useState<string | null>(null);

  const { data: routes = [], isLoading, error, refetch } = useRoutes(filters);
  const setBaselineMutation = useSetBaseline();

  // Log the exact error details
  useEffect(() => {
    if (error) {
      console.error('❌ Routes Error Details:', error);
    }
  }, [error]);

  const handleSetBaseline = async (routeId: string) => {
    setSettingBaseline(routeId);
    try {
      await setBaselineMutation.mutateAsync(routeId);
    } finally {
      setSettingBaseline(null);
    }
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  if (error) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Routes Management</h2>
          <p className="text-gray-600 mt-1">
            View and manage vessel routes, set baselines, and analyze GHG intensity data.
          </p>
        </div>

        <Card>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Failed to Load Routes
              </h3>
              <p className="text-gray-600 mb-4">
                {error.message}
              </p>
              <Button onClick={() => refetch()} variant="primary">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Routes Management</h2>
        <p className="text-gray-600 mt-1">
          View and manage vessel routes, set baselines, and analyze GHG intensity data.
        </p>
      </div>

      <RouteFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vessel Routes ({routes.length})</span>
            {isLoading && <LoadingSpinner size="sm" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <RoutesTable
            routes={routes}
            loading={isLoading}
            onSetBaseline={handleSetBaseline}
            settingBaseline={settingBaseline || undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export {};