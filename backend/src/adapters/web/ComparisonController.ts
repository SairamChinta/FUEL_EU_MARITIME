
import { Request, Response } from 'express';
import { PrismaRouteRepository } from '../database/PrismaRouteRepository';

const routeRepository = new PrismaRouteRepository();

export class ComparisonController {
  static async getComparison(req: Request, res: Response) {
    try {
      const comparisonData = await routeRepository.getComparisonData();
      
      // Convert baseline Route instance to plain object
      const cleanBaseline = {
        routeId: comparisonData.baseline.routeId,
        vesselType: comparisonData.baseline.vesselType,
        fuelType: comparisonData.baseline.fuelType,
        year: comparisonData.baseline.year,
        ghgIntensity: comparisonData.baseline.ghgIntensity,
        fuelConsumption: comparisonData.baseline.fuelConsumption,
        distance: comparisonData.baseline.distance,
        totalEmissions: comparisonData.baseline.totalEmissions,
        isBaseline: comparisonData.baseline.isBaseline
      };

      const response = {
        baseline: cleanBaseline,
        comparisons: comparisonData.comparisons
      };
      
      res.json(response);
    } catch (error) {
      console.error('Comparison error:', error);
      res.status(500).json({ error: 'Failed to get comparison data' });
    }
  }
}