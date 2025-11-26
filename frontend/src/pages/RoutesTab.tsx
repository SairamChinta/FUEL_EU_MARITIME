
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { RoutesTable } from '../components/Routes/RoutesTable';
import { RouteFilters } from '../components/Routes/RouteFilters';
import { useRoutes, useSetBaseline } from '../hooks/useRoutes';
import { RouteFilters as Filters } from '../core/entities/Route';

export const RoutesTab: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({});
  const [settingBaseline, setSettingBaseline] = useState<string | null>(null);

  const { data: routes = [], isLoading, error } = useRoutes(filters);
  const setBaselineMutation = useSetBaseline();

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
            <div className="text-center py-8 text-red-600">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium mb-2">Failed to load routes</h3>
              <p>Please check if the backend server is running.</p>
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
            <div className="text-sm font-normal text-gray-500">
              {routes.find(r => r.isBaseline) ? 'Baseline set' : 'No baseline set'}
            </div>
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

      {/* Stats Summary */}
      {routes.length > 0 && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-maritime-600">{routes.length}</div>
              <div className="text-sm text-gray-600">Total Routes</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {routes.filter(r => r.isBaseline).length}
              </div>
              <div className="text-sm text-gray-600">Baseline Routes</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                {new Set(routes.map(r => r.vesselType)).size}
              </div>
              <div className="text-sm text-gray-600">Vessel Types</div>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(routes.map(r => r.year)).size}
              </div>
              <div className="text-sm text-gray-600">Years</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
export {}