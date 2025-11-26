import { describe, it, expect, vi } from 'vitest';
import { BankSurplus } from '../BankSurplus';

describe('BankSurplus', () => {
  it('throws when balance <= 0', async () => {
    const bankingRepo = { bankSurplus: vi.fn() } as any;
    const complianceRepo = { getAdjustedComplianceBalance: vi.fn(async () => ({ cbGCO2eq: -10 })) } as any;

    const uc = new BankSurplus(bankingRepo, complianceRepo);

    await expect(uc.execute('SHIP001', 2024)).rejects.toThrow();
  });

  it('banks positive balance', async () => {
    const bankingRepo = { bankSurplus: vi.fn(async () => ({ id: 'b1', shipId: 'SHIP003', year: 2024, amountGCO2eq: 100 })) } as any;
    const complianceRepo = { getAdjustedComplianceBalance: vi.fn()
      .mockResolvedValueOnce({ cbGCO2eq: 120 })
      .mockResolvedValueOnce({ cbGCO2eq: 20 })
    } as any;

    const uc = new BankSurplus(bankingRepo, complianceRepo);

    const result = await uc.execute('SHIP003', 2024);
    expect(bankingRepo.bankSurplus).toHaveBeenCalled();
    expect(result.banked).toBe(120);
    expect(result.newBalance).toBe(20);
  });
});
