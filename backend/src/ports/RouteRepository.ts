import { Route } from '../core/entities/Route';
export interface ComparisonRoute {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
  percentDiff: number;
  compliant: boolean;
}

export interface RouteRepository {
  findAll(): Promise<Route[]>;
  findById(routeId: string): Promise<Route | null>;
  setBaseline(routeId: string): Promise<Route>;
  getComparisonData(): Promise<{
    baseline: Route;
    comparisons: ComparisonRoute[];
  }>;
}