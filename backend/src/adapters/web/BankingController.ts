
import { Request, Response } from 'express';
import { PrismaBankingRepository } from '../database/PrismaBankingRepository';
import { PrismaComplianceRepository } from '../database/PrismaComplianceRepository';
import { BankSurplus } from '../../core/usecases/BankSurplus';

const bankingRepository = new PrismaBankingRepository();
const complianceRepository = new PrismaComplianceRepository();
const bankSurplus = new BankSurplus(bankingRepository, complianceRepository);

export class BankingController {
  static async bankSurplus(req: Request, res: Response) {
    try {
      const { shipId, year } = req.body;
      
      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      const result = await bankSurplus.execute(shipId, parseInt(year));
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to bank surplus' });
    }
  }

  static async getBankRecords(req: Request, res: Response) {
    try {
      const { shipId, year } = req.query;
      
      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      const records = await bankingRepository.getBankRecords(
        shipId as string,
        parseInt(year as string)
      );
      
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get bank records' });
    }
  }
}