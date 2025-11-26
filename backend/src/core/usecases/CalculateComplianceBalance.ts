
import { ComplianceBalance } from '../entities/ComplianceBalance';
import { RouteRepository } from '../../ports/RouteRepository';
import { ComplianceRepository } from '../../ports/ComplianceRepository';

export class CalculateComplianceBalance {
  constructor(
    private routeRepository: RouteRepository,
    private complianceRepository: ComplianceRepository
  ) {}

  async execute(shipId: string, year: number): Promise<ComplianceBalance> {
    const routes = await this.routeRepository.findAll();
    const filteredRoutes = routes.filter(route => route.year === year);
    
    if (filteredRoutes.length === 0) {
      throw new Error(`No routes found for year ${year}`);
    }

    const balance = ComplianceBalance.calculate(shipId, year, filteredRoutes);
    await this.complianceRepository.saveComplianceBalance(balance);

    return balance;
  }
}