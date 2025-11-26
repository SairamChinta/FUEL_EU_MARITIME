
import { Route, ComparisonData } from '../core/entities/Route';

export interface RouteService {
  getRoutes(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparisonData(): Promise<ComparisonData>;
}