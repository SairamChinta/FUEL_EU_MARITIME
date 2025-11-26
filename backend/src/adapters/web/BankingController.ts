
import { Request, Response } from 'express';
import { PrismaBankingRepository } from '../database/PrismaBankingRepository';
import { PrismaComplianceRepository } from '../database/PrismaComplianceRepository';
import { BankSurplus } from '../../core/usecases/BankSurplus';
import { ApplyBanked } from '../../core/usecases/ApplyBanked';

const bankingRepository = new PrismaBankingRepository();
const complianceRepository = new PrismaComplianceRepository();
const bankSurplus = new BankSurplus(bankingRepository, complianceRepository);
const applyBanked = new ApplyBanked(bankingRepository, complianceRepository);

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

  static async applyBanked(req: Request, res: Response) {
    try {
      const { fromShipId, toShipId, year, amount } = req.body;

      if (!fromShipId || !toShipId || !year || !amount) {
        return res.status(400).json({ error: 'fromShipId, toShipId, year and amount are required' });
      }

      const parsedYear = parseInt(year);
      const parsedAmount = Number(amount);

      const result = await applyBanked.execute(fromShipId, toShipId, parsedYear, parsedAmount);
      res.json(result);
    } catch (error) {
      console.error('Apply banked error:', error);
      res.status(400).json({ error: (error as any)?.message || 'Failed to apply banked surplus' });
    }
  }
}