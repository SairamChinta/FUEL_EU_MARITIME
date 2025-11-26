
import { BankingRepository } from '../../ports/BankingRepository';
import { ComplianceRepository } from '../../ports/ComplianceRepository';

export class BankSurplus {
  constructor(
    private bankingRepository: BankingRepository,
    private complianceRepository: ComplianceRepository
  ) {}

  async execute(shipId: string, year: number): Promise<{ banked: number; newBalance: number }> {
    const balance = await this.complianceRepository.getAdjustedComplianceBalance(shipId, year);
    
    if (balance.cbGCO2eq <= 0) {
      throw new Error('Cannot bank deficit compliance balance');
    }

    await this.bankingRepository.bankSurplus(shipId, year, balance.cbGCO2eq);

    const newBalance = await this.complianceRepository.getAdjustedComplianceBalance(shipId, year);

    return {
      banked: balance.cbGCO2eq,
      newBalance: newBalance.cbGCO2eq
    };
  }
}