
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../Table';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { LoadingSpinner } from '../LoadingSpinner';
import { Route } from '../../core/entities/Route';
import { formatNumber } from '../../utils/formatters';

interface RoutesTableProps {
  routes: Route[];
  loading: boolean;
  onSetBaseline: (routeId: string) => void;
  settingBaseline?: string;
}

export const RoutesTable: React.FC<RoutesTableProps> = ({
  routes,
  loading,
  onSetBaseline,
  settingBaseline,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading routes...</span>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No routes found. Please check your filters.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Route ID</TableHead>
          <TableHead>Vessel Type</TableHead>
          <TableHead>Fuel Type</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>GHG Intensity (gCO₂e/MJ)</TableHead>
          <TableHead>Fuel Consumption (t)</TableHead>
          <TableHead>Distance (km)</TableHead>
          <TableHead>Total Emissions (t)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {routes.map((route) => (
          <TableRow key={route.routeId}>
            <TableCell className="font-medium text-gray-900">
              {route.routeId}
            </TableCell>
            <TableCell>
              <Badge variant="info">{route.vesselType}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="default">{route.fuelType}</Badge>
            </TableCell>
            <TableCell>{route.year}</TableCell>
            <TableCell className="font-medium">
              {formatNumber(route.ghgIntensity)}
            </TableCell>
            <TableCell>{formatNumber(route.fuelConsumption)}</TableCell>
            <TableCell>{formatNumber(route.distance)}</TableCell>
            <TableCell>{formatNumber(route.totalEmissions)}</TableCell>
            <TableCell>
              {route.isBaseline ? (
                <Badge variant="success">Baseline</Badge>
              ) : (
                <Badge variant="default">Comparison</Badge>
              )}
            </TableCell>
            <TableCell>
              {!route.isBaseline && (
                <Button
                  size="sm"
                  variant="outline"
                  loading={settingBaseline === route.routeId}
                  onClick={() => onSetBaseline(route.routeId)}
                >
                  Set Baseline
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};