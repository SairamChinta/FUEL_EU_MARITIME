
import { Request, Response } from 'express';
import { PrismaPoolRepository } from '../database/PrismaPoolRepository';
import { PrismaComplianceRepository } from '../database/PrismaComplianceRepository';
import { CreatePool } from '../../core/usecases/CreatePool';

const poolRepository = new PrismaPoolRepository();
const complianceRepository = new PrismaComplianceRepository();
const createPool = new CreatePool(poolRepository, complianceRepository);

export class PoolController {
  static async createPool(req: Request, res: Response) {
    try {
      const { year, shipIds } = req.body;
      
      if (!year || !shipIds || !Array.isArray(shipIds)) {
        return res.status(400).json({ error: 'year and shipIds array are required' });
      }

      const pool = await createPool.execute(parseInt(year), shipIds);
      
      res.json({
        id: pool.id,
        year: pool.year,
        members: pool.getMembers(),
        poolTotal: pool.getPoolTotal()
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create pool' });
    }
  }
}