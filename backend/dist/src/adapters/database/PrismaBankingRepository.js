"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaBankingRepository = void 0;
const database_1 = require("../../infrastructure/database");
class PrismaBankingRepository {
    async getBankedAmount(shipId, year) {
        const result = await database_1.prisma.bankEntry.aggregate({
            where: { shipId, year },
            _sum: { amountGCO2eq: true }
        });
        return result._sum.amountGCO2eq || 0;
    }
    async bankSurplus(shipId, year, amount) {
        const bankEntry = await database_1.prisma.bankEntry.create({
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
    async getBankRecords(shipId, year) {
        const records = await database_1.prisma.bankEntry.findMany({
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
}
exports.PrismaBankingRepository = PrismaBankingRepository;
