import { ComplianceBalance } from '../core/entities/ComplianceBalance';

export interface ComplianceRepository {
  saveComplianceBalance(balance: ComplianceBalance): Promise<void>;
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance | null>;
}