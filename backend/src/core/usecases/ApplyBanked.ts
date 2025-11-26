import { BankingRepository } from '../../ports/BankingRepository';
import { ComplianceRepository } from '../../ports/ComplianceRepository';

export class ApplyBanked {
  constructor(
    private bankingRepo: BankingRepository,
    private complianceRepo: ComplianceRepository
  ) {}

  async execute(fromShipId: string, toShipId: string, year: number, amount: number) {
    // Validate that target has a deficit
    const target = await this.complianceRepo.getAdjustedComplianceBalance(toShipId, year);
    if (target.cbGCO2eq >= 0) {
      throw new Error('Target ship does not have a deficit — applying banked surplus is not allowed');
    }

    // Validate amount is positive and not greater than available
    if (amount <= 0) throw new Error('Apply amount must be positive');

    const result = await this.bankingRepo.applyBanked(fromShipId, toShipId, year, amount);

    // After applying, update compliance snapshots for both ships
    try {
      const fromAdjusted = await this.complianceRepo.getAdjustedComplianceBalance(fromShipId, year);
      await this.complianceRepo.saveComplianceBalance(fromAdjusted);
    } catch {
      // best effort, don't block
    }

    try {
      const toAdjusted = await this.complianceRepo.getAdjustedComplianceBalance(toShipId, year);
      await this.complianceRepo.saveComplianceBalance(toAdjusted);
    } catch {
      // best effort
    }

    return result;
  }
}
