import { describe, it, expect, vi } from 'vitest';
import { CalculateComplianceBalance } from '../CalculateComplianceBalance';

const makeRoute = (routeId: string, year: number, ghg: number) => ({ routeId, vesselType: 'X', fuelType: 'F', year, ghgIntensity: ghg, fuelConsumption: 1000, distance: 100, totalEmissions: 1000, isBaseline: false });

describe('CalculateComplianceBalance', () => {
  it('calculates and saves CB for a ship with surplus', async () => {
    const routes = [makeRoute('R003', 2024, 85), makeRoute('R001', 2024, 95)];

    const routeRepo = { findAll: vi.fn(async () => routes) } as any;
    const saved: any[] = [];
    const complianceRepo = { saveComplianceBalance: vi.fn(async (balance: any) => saved.push(balance)) } as any;

    const usecase = new CalculateComplianceBalance(routeRepo, complianceRepo);

    const balance = await usecase.execute('SHIP003', 2024);

    expect(balance.shipId).toBe('SHIP003');
    expect(balance.year).toBe(2024);
    expect(saved.length).toBe(1);
    expect(balance.cbGCO2eq).toBeDefined();
  });
});
