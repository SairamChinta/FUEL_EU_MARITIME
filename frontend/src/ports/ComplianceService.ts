import { ComplianceBalance, BankEntry, Pool } from '../core/entities/Compliance';

export interface ComplianceService {
  calculateCompliance(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedCompliance(shipId: string, year: number): Promise<ComplianceBalance>;
  bankSurplus(shipId: string, year: number): Promise<{ banked: number; newBalance: number }>;
  getBankRecords(shipId: string, year: number): Promise<BankEntry[]>;
  createPool(year: number, shipIds: string[]): Promise<Pool>;
}