
import { BankingRepository, BankEntry } from '../../ports/BankingRepository';
import { prisma } from '../../infrastructure/database';

export class PrismaBankingRepository implements BankingRepository {
  async getBankedAmount(shipId: string, year: number): Promise<number> {
    const result = await prisma.bankEntry.aggregate({
      where: { shipId, year },
      _sum: { amountGCO2eq: true }
    });
    
    return result._sum.amountGCO2eq || 0;
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const bankEntry = await prisma.bankEntry.create({
      data: {
        shipId,
        year,
        amountGCO2eq: amount
      }
    });

    return {
      id: bankEntry.id,
      shipId: bankEntry.shipId,
      year: bankEntry.year,
      amountGCO2eq: bankEntry.amountGCO2eq,
      createdAt: bankEntry.createdAt
    };
  }

  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const records = await prisma.bankEntry.findMany({
      where: { shipId, year },
      orderBy: { createdAt: 'desc' }
    });

    return records.map(record => ({
      id: record.id,
      shipId: record.shipId,
      year: record.year,
      amountGCO2eq: record.amountGCO2eq,
      createdAt: record.createdAt
    }));
  }

  async applyBanked(fromShipId: string, toShipId: string, year: number, amount: number): Promise<{ applied: number; fromNewBalance: number; toNewBalance: number }> {
    // Validate available banked amount for source
    const available = await this.getBankedAmount(fromShipId, year);
    if (amount > available) {
      throw new Error('Amount exceeds available banked surplus');
    }

    // Create a negative bank entry for the source to reduce its bank
    await prisma.bankEntry.create({
      data: { shipId: fromShipId, year, amountGCO2eq: -Math.abs(amount) }
    });

    // Create a positive bank entry for the target so it benefits from the applied amount
    await prisma.bankEntry.create({
      data: { shipId: toShipId, year, amountGCO2eq: Math.abs(amount) }
    });

    const fromNew = await this.getBankedAmount(fromShipId, year);
    const toNew = await this.getBankedAmount(toShipId, year);

    return {
      applied: amount,
      fromNewBalance: fromNew,
      toNewBalance: toNew
    };
  }
}