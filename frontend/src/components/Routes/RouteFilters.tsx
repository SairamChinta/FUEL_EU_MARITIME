
import React from 'react';
import { Button } from '../Button';
import { Badge } from '../Badge';

interface RouteFilters {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}

interface RouteFiltersProps {
  filters: RouteFilters;
  onFiltersChange: (filters: RouteFilters) => void;
  onClearFilters: () => void;
}

const vesselTypes = ['Container', 'BulkCarrier', 'Tanker', 'RoRo'];
const fuelTypes = ['HFO', 'LNG', 'MGO'];
const years = [2024, 2025];

export const RouteFilters: React.FC<RouteFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  const handleFilterChange = (key: keyof RouteFilters, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Vessel Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vessel Type
          </label>
          <select
            value={filters.vesselType || ''}
            onChange={(e) => handleFilterChange('vesselType', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-maritime-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {vesselTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Type
          </label>
          <select
            value={filters.fuelType || ''}
            onChange={(e) => handleFilterChange('fuelType', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-maritime-500 focus:border-transparent"
          >
            <option value="">All Fuels</option>
            {fuelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            value={filters.year || ''}
            onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-maritime-500 focus:border-transparent"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Active Filters
          </label>
          <div className="flex flex-wrap gap-2">
            {filters.vesselType && (
              <Badge variant="info" className="text-xs">
                Vessel: {filters.vesselType}
              </Badge>
            )}
            {filters.fuelType && (
              <Badge variant="default" className="text-xs">
                Fuel: {filters.fuelType}
              </Badge>
            )}
            {filters.year && (
              <Badge variant="warning" className="text-xs">
                Year: {filters.year}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};