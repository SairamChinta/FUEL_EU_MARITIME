
export interface Route {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export interface ComparisonRoute extends Route {
  percentDiff: number;
  compliant: boolean;
}

export interface ComparisonData {
  baseline: Route;
  comparisons: ComparisonRoute[];
}
export interface RouteFilters {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}