"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingController = void 0;
const PrismaBankingRepository_1 = require("../database/PrismaBankingRepository");
const PrismaComplianceRepository_1 = require("../database/PrismaComplianceRepository");
const BankSurplus_1 = require("../../core/usecases/BankSurplus");
const bankingRepository = new PrismaBankingRepository_1.PrismaBankingRepository();
const complianceRepository = new PrismaComplianceRepository_1.PrismaComplianceRepository();
const bankSurplus = new BankSurplus_1.BankSurplus(bankingRepository, complianceRepository);
class BankingController {
    static async bankSurplus(req, res) {
        try {
            const { shipId, year } = req.body;
            if (!shipId || !year) {
                return res.status(400).json({ error: 'shipId and year are required' });
            }
            const result = await bankSurplus.execute(shipId, parseInt(year));
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to bank surplus' });
        }
    }
    static async getBankRecords(req, res) {
        try {
            const { shipId, year } = req.query;
            if (!shipId || !year) {
                return res.status(400).json({ error: 'shipId and year are required' });
            }
            const records = await bankingRepository.getBankRecords(shipId, parseInt(year));
            res.json(records);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to get bank records' });
        }
    }
}
exports.BankingController = BankingController;
