import { Route } from '../core/entities/Route';

export interface RouteRepository {
  findAll(): Promise<Route[]>;
  findById(routeId: string): Promise<Route | null>;
  setBaseline(routeId: string): Promise<Route>;
}