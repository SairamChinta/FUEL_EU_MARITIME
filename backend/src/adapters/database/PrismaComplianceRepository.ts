import { ComplianceBalance } from '../../core/entities/ComplianceBalance';
import { ComplianceRepository } from '../../ports/ComplianceRepository';
//@ts-ignore
import { prisma } from '../../infrastructure/database';

export class PrismaComplianceRepository implements ComplianceRepository {
  async saveComplianceBalance(balance: ComplianceBalance): Promise<void> {
    await prisma.shipCompliance.upsert({
      where: {
        shipId_year: {
          shipId: balance.shipId,
          year: balance.year
        }
      },
      update: {
        cbGCO2eq: balance.cbGCO2eq
      },
      create: {
        shipId: balance.shipId,
        year: balance.year,
        cbGCO2eq: balance.cbGCO2eq
      }
    });
  }

  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const compliance = await prisma.shipCompliance.findFirst({
      where: { shipId, year }
    });

    if (!compliance) return null;

    return new ComplianceBalance(
      compliance.shipId,
      compliance.year,
      compliance.cbGCO2eq
    );
  }
}