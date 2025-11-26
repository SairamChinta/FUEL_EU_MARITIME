"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceController = void 0;
const PrismaRouteRepository_1 = require("../database/PrismaRouteRepository");
const PrismaComplianceRepository_1 = require("../database/PrismaComplianceRepository");
const CalculateComplianceBalance_1 = require("../../core/usecases/CalculateComplianceBalance");
const routeRepository = new PrismaRouteRepository_1.PrismaRouteRepository();
const complianceRepository = new PrismaComplianceRepository_1.PrismaComplianceRepository();
const calculateCB = new CalculateComplianceBalance_1.CalculateComplianceBalance(routeRepository, complianceRepository);
class ComplianceController {
    static async calculateCompliance(req, res) {
        try {
            const { shipId, year } = req.query;
            if (!shipId || !year) {
                return res.status(400).json({ error: 'shipId and year are required' });
            }
            console.log('Calculating compliance for:', { shipId, year });
            const balance = await calculateCB.execute(shipId, parseInt(year));
            console.log('Compliance calculation result:', balance);
            res.json({
                shipId: balance.shipId,
                year: balance.year,
                cbGCO2eq: balance.cbGCO2eq,
                isSurplus: balance.isSurplus,
                isDeficit: balance.isDeficit
            });
        }
        catch (error) {
            console.error('Compliance calculation error:', error);
            res.status(500).json({ error: 'Failed to calculate compliance balance' });
        }
    }
}
exports.ComplianceController = ComplianceController;
