
import { Route } from './Route';

export class ComplianceBalance {
  constructor(
    public readonly shipId: string,
    public readonly year: number,
    public readonly cbGCO2eq: number
  ) {}

  static calculate(shipId: string, year: number, routes: Route[]): ComplianceBalance {
    const TARGET_2025 = 89.3368;
    const ENERGY_CONVERSION = 41000;

    const totalEnergy = routes.reduce((sum, route) => 
      sum + (route.fuelConsumption * ENERGY_CONVERSION), 0
    );

    const weightedIntensity = routes.reduce((sum, route) => 
      sum + (route.ghgIntensity * route.fuelConsumption * ENERGY_CONVERSION), 0
    ) / totalEnergy;

    const cb = (TARGET_2025 - weightedIntensity) * totalEnergy;

    return new ComplianceBalance(shipId, year, cb);
  }

  get isSurplus() { return this.cbGCO2eq > 0; }
  get isDeficit() { return this.cbGCO2eq < 0; }
}