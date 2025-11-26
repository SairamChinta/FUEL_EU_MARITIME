
import { RouteService } from '../ports/RouteService';
import { Route, ComparisonData } from '../core/entities/Route';
import { httpClient } from '../infrastructure/http-client';

export class ApiRouteService implements RouteService {
  async getRoutes(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]> {
    const response = await httpClient.get<Route[]>('/routes', { params: filters });
    return response.data;
  }

  async setBaseline(routeId: string): Promise<Route> {
    const response = await httpClient.post<Route>(`/routes/${routeId}/baseline`);
    return response.data;
  }

  async getComparisonData(): Promise<ComparisonData> {
    const response = await httpClient.get<ComparisonData>('/routes/comparison');
    return response.data;
  }
}