
import { Pool } from '../entities/Pool';
import { PoolRepository } from '../../ports/PoolRepository';
import { ComplianceRepository } from '../../ports/ComplianceRepository';

export class CreatePool {
  constructor(
    private poolRepository: PoolRepository,
    private complianceRepository: ComplianceRepository
  ) {}

  async execute(year: number, shipIds: string[]): Promise<Pool> {
    if (shipIds.length < 2) {
      throw new Error('At least 2 ships are required to create a pool');
    }

    const members = await Promise.all(
      shipIds.map(async shipId => {
        const balance = await this.complianceRepository.getAdjustedComplianceBalance(shipId, year);
        return {
          shipId,
          cbBefore: balance.cbGCO2eq,
          cbAfter: balance.cbGCO2eq
        };
      })
    );

    const pool = Pool.create(year, members);
    return await this.poolRepository.createPool(pool);
  }
}