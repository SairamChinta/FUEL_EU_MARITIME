import { describe, it, expect, vi } from 'vitest';
import { CreatePool } from '../CreatePool';

describe('CreatePool', () => {
  it('requires at least 2 ships', async () => {
    const poolRepo = {} as any;
    const complianceRepo = {} as any;

    const uc = new CreatePool(poolRepo, complianceRepo);

    await expect(uc.execute(2024, ['SHIP001'])).rejects.toThrow('At least 2 ships are required');
  });

  it('creates a pool when valid', async () => {
    const poolRepo = { createPool: vi.fn(async (p) => ({ id: 'pool1', year: p.year, getMembers: () => p.getMembers(), getPoolTotal: () => 100 })) } as any;

    const complianceRepo = { getAdjustedComplianceBalance: vi.fn(async (shipId: string) => ({ shipId, year: 2024, cbGCO2eq: shipId === 'SHIP003' ? 50 : -20 })) } as any;

    const uc = new CreatePool(poolRepo, complianceRepo);

    const pool = await uc.execute(2024, ['SHIP003', 'SHIP002']);
    expect(poolRepo.createPool).toHaveBeenCalled();
    expect(pool.year).toBe(2024);
  });
});
