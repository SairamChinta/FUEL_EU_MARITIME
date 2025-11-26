
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

  // Alias endpoint for assignment: GET /compliance/cb?shipId&year
  static async getCB(req: Request, res: Response) {
    // call calculateCompliance directly to avoid losing `this` when used as an express handler
    return ComplianceController.calculateCompliance(req, res);
  }

  static async adjustedCB(req: Request, res: Response) {
    try {
      const { shipId, year } = req.query;
      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      const parsedYear = parseInt(year as string);

      const adjusted = await complianceRepository.getAdjustedComplianceBalance(shipId as string, parsedYear);

      res.json({
        shipId: adjusted.shipId,
        year: adjusted.year,
        cbGCO2eq: adjusted.cbGCO2eq,
        isSurplus: adjusted.isSurplus,
        isDeficit: adjusted.isDeficit
      });
    } catch (error) {
      console.error('Adjusted CB error:', error);
      res.status(500).json({ error: 'Failed to get adjusted compliance balance' });
    }
  }
}