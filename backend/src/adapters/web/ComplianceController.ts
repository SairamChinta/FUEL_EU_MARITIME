
import { Request, Response } from 'express';
import { PrismaRouteRepository } from '../database/PrismaRouteRepository';
import { PrismaComplianceRepository } from '../database/PrismaComplianceRepository';
import { CalculateComplianceBalance } from '../../core/usecases/CalculateComplianceBalance';

const routeRepository = new PrismaRouteRepository();
const complianceRepository = new PrismaComplianceRepository();
const calculateCB = new CalculateComplianceBalance(routeRepository, complianceRepository);

export class ComplianceController {
  static async calculateCompliance(req: Request, res: Response) {
    try {
      const { shipId, year } = req.query;
      
      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      console.log('Calculating compliance for:', { shipId, year });

      const balance = await calculateCB.execute(
        shipId as string,
        parseInt(year as string)
      );

      console.log('Compliance calculation result:', balance);

      res.json({
        shipId: balance.shipId,
        year: balance.year,
        cbGCO2eq: balance.cbGCO2eq,
        isSurplus: balance.isSurplus,
        isDeficit: balance.isDeficit
      });
    } catch (error) {
      console.error('Compliance calculation error:', error);
      res.status(500).json({ error: 'Failed to calculate compliance balance' });
    }
  }
}