
import { RouteService } from '../ports/RouteService';
import { ComplianceService } from '../ports/ComplianceService';
import { ApiRouteService } from './ApiRouteService';
import { ApiComplianceService } from './ApiComplianceService';

class ServiceFactory {
  private static routeService: RouteService;
  private static complianceService: ComplianceService;

  static getRouteService(): RouteService {
    if (!this.routeService) {
      this.routeService = new ApiRouteService();
    }
    return this.routeService;
  }

  static getComplianceService(): ComplianceService {
    if (!this.complianceService) {
      this.complianceService = new ApiComplianceService();
    }
    return this.complianceService;
  }
}

export const { getRouteService, getComplianceService } = ServiceFactory;