"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaComplianceRepository = void 0;
const ComplianceBalance_1 = require("../../core/entities/ComplianceBalance");
const database_1 = require("../../infrastructure/database");
class PrismaComplianceRepository {
    async saveComplianceBalance(balance) {
        await database_1.prisma.shipCompliance.upsert({
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
    async getComplianceBalance(shipId, year) {
        const compliance = await database_1.prisma.shipCompliance.findFirst({
            where: { shipId, year }
        });
        if (!compliance)
            return null;
        return new ComplianceBalance_1.ComplianceBalance(compliance.shipId, compliance.year, compliance.cbGCO2eq);
    }
    async getAdjustedComplianceBalance(shipId, year) {
        const baseBalance = await this.getComplianceBalance(shipId, year);
        if (!baseBalance) {
            throw new Error(`No compliance balance found for ship ${shipId} in year ${year}`);
        }
        const bankedAmount = await database_1.prisma.bankEntry.aggregate({
            where: { shipId, year },
            _sum: { amountGCO2eq: true }
        });
        const adjustedCB = baseBalance.cbGCO2eq - (bankedAmount._sum.amountGCO2eq || 0);
        return new ComplianceBalance_1.ComplianceBalance(shipId, year, adjustedCB);
    }
}
exports.PrismaComplianceRepository = PrismaComplianceRepository;
