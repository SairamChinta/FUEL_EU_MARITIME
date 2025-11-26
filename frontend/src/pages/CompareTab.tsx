
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { FaChartBar } from 'react-icons/fa';
import { FiAlertCircle } from 'react-icons/fi';
import { useComparisonData } from '../hooks/useRoutes';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/Table';
import { Badge } from '../components/Badge';
import { formatNumber, formatPercentage } from '../utils/formatters';

const TARGET = 89.3368;

export const CompareTab: React.FC = () => {
  const { data, isLoading, error, refetch } = useComparisonData();

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
          <CardTitle className="flex items-center justify-between">
            <span>Route Comparison</span>
            {isLoading && <LoadingSpinner size="sm" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4 text-red-500"><FiAlertCircle /></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load comparison data</h3>
              <p className="text-gray-600 mb-4">{error.message}</p>
              <div className="flex justify-center">
                <button className="btn-primary" onClick={() => refetch()}>Try again</button>
              </div>
            </div>
          ) : !data ? (
            <EmptyState
              icon={<FaChartBar />}
              title="Comparison Analytics"
              description="Interactive charts and tables showing GHG intensity comparisons and compliance status."
            />
          ) : (
            <div className="space-y-6">
              {/* Baseline summary */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Baseline Route</div>
                    <div className="text-lg font-semibold text-gray-900">{data.baseline.routeId}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {data.baseline.vesselType} • {data.baseline.fuelType} • {data.baseline.year}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">GHG Intensity</div>
                    <div className="text-xl font-semibold text-gray-900">{formatNumber(data.baseline.ghgIntensity)}</div>
                    <div className="text-xs text-gray-500">gCO₂e / MJ</div>
                  </div>
                </div>
              </div>

              {/* Small comparison chart */}
              <div className="p-4 bg-white rounded-lg border mb-4">
                <div className="text-sm text-gray-500 mb-2">GHG Intensity comparison (gCO₂e/MJ)</div>
                <div className="space-y-2">
                  {(() => {
                    const items = [{ id: data.baseline.routeId, label: 'Baseline', ghg: data.baseline.ghgIntensity, base: true as const },
                      ...data.comparisons.map(c => ({ id: c.routeId, label: c.routeId, ghg: c.ghgIntensity, base: false as const }))];

                    return items.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-24 text-xs text-gray-600">{item.label}</div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-100 h-4 rounded relative">
                            <div
                              style={{ width: `${Math.min(100, (item.ghg / Math.max(TARGET, data.baseline.ghgIntensity, ...data.comparisons.map(x => x.ghgIntensity))) * 100)}%` }}
                              className={`h-4 rounded ${item.base ? 'bg-maritime-600' : 'bg-maritime-300'}`}
                            />
                            <div style={{ left: `${Math.min(100, (TARGET / Math.max(TARGET, data.baseline.ghgIntensity, ...data.comparisons.map(x => x.ghgIntensity))) * 100)}%` }} className="absolute top-0 h-4 w-0.5 bg-red-500" />
                          </div>
                        </div>
                        <div className="w-24 text-right text-sm font-medium">{formatNumber(item.ghg)}</div>
                      </div>
                    ));
                  })()}
                </div>
                <div className="text-xs text-gray-500 mt-2">Target (89.3368 gCO₂e/MJ) — red marker on the chart</div>
              </div>

              {/* Comparisons table */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Comparisons</h4>
                {data.comparisons.length === 0 ? (
                  <div className="text-sm text-gray-500">No comparisons available.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route</TableHead>
                        <TableHead>Vessel</TableHead>
                        <TableHead>Fuel</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>GHG Intensity</TableHead>
                        <TableHead>Diff</TableHead>
                        <TableHead>Compliant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.comparisons.map((c) => (
                        <TableRow key={c.routeId}>
                          <TableCell className="font-medium text-gray-900">{c.routeId}</TableCell>
                          <TableCell><Badge variant="info" className="text-xs">{c.vesselType}</Badge></TableCell>
                          <TableCell><Badge variant="default" className="text-xs">{c.fuelType}</Badge></TableCell>
                          <TableCell>{c.year}</TableCell>
                          <TableCell className="font-medium">{formatNumber(c.ghgIntensity)}</TableCell>
                          <TableCell>{formatPercentage(c.percentDiff)}</TableCell>
                          <TableCell>{c.compliant ? <Badge variant="success">Yes</Badge> : <Badge>No</Badge>}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export {};