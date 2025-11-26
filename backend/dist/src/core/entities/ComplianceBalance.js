"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceBalance = void 0;
class ComplianceBalance {
    shipId;
    year;
    cbGCO2eq;
    constructor(shipId, year, cbGCO2eq) {
        this.shipId = shipId;
        this.year = year;
        this.cbGCO2eq = cbGCO2eq;
    }
    static calculate(shipId, year, routes) {
        const TARGET_2025 = 89.3368;
        const ENERGY_CONVERSION = 41000;
        const totalEnergy = routes.reduce((sum, route) => sum + (route.fuelConsumption * ENERGY_CONVERSION), 0);
        const weightedIntensity = routes.reduce((sum, route) => sum + (route.ghgIntensity * route.fuelConsumption * ENERGY_CONVERSION), 0) / totalEnergy;
        const cb = (TARGET_2025 - weightedIntensity) * totalEnergy;
        return new ComplianceBalance(shipId, year, cb);
    }
    get isSurplus() { return this.cbGCO2eq > 0; }
    get isDeficit() { return this.cbGCO2eq < 0; }
}
exports.ComplianceBalance = ComplianceBalance;
