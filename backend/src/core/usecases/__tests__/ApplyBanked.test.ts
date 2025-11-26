import { describe, it, expect, vi } from 'vitest';
import { ApplyBanked } from '../ApplyBanked';

describe('ApplyBanked', () => {
  it('throws when target has no deficit', async () => {
    const bankingRepo = { applyBanked: vi.fn() } as any;
    const complianceRepo = { getAdjustedComplianceBalance: vi.fn(async () => ({ cbGCO2eq: 10 })) } as any;

    const uc = new ApplyBanked(bankingRepo, complianceRepo);

    await expect(uc.execute('SHIP001', 'SHIP002', 2024, 10)).rejects.toThrow();
  });

  it('applies banked surplus when valid', async () => {
    const bankingRepo = { applyBanked: vi.fn(async () => ({ applied: 25, fromNewBalance: 75, toNewBalance: -5 })) } as any;
    const complianceRepo = {
      getAdjustedComplianceBalance: vi.fn()
        .mockResolvedValueOnce({ cbGCO2eq: -30 }) // target deficit
        .mockResolvedValueOnce({ cbGCO2eq: -5 })
    } as any;

    const uc = new ApplyBanked(bankingRepo, complianceRepo);

    const res = await uc.execute('SHIP001', 'SHIP002', 2024, 25);
    expect(bankingRepo.applyBanked).toHaveBeenCalled();
    expect(res.applied).toBe(25);
  });
});
