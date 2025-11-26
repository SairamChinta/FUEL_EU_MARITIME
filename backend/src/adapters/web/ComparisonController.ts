
import { Request, Response } from 'express';
import { PrismaRouteRepository } from '../database/PrismaRouteRepository';

const routeRepository = new PrismaRouteRepository();

export class ComparisonController {
  static async getComparison(req: Request, res: Response) {
    try {
      const comparisonData = await routeRepository.getComparisonData();
      res.json(comparisonData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get comparison data' });
    }
  }
}