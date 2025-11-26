
import { ComplianceService } from '../ports/ComplianceService';
import { ComplianceBalance, BankEntry, Pool } from '../core/entities/Compliance';
import { httpClient } from '../infrastructure/http-client';

export class ApiComplianceService implements ComplianceService {
  async calculateCompliance(shipId: string, year: number): Promise<ComplianceBalance> {
    const response = await httpClient.get<ComplianceBalance>('/compliance/calculate', {
      params: { shipId, year }
    });
    return response.data;
  }

  async getAdjustedCompliance(shipId: string, year: number): Promise<ComplianceBalance> {
    const response = await httpClient.get<ComplianceBalance>('/compliance/adjusted-cb', {
      params: { shipId, year }
    });
    return response.data;
  }

  async bankSurplus(shipId: string, year: number): Promise<{ banked: number; newBalance: number }> {
    const response = await httpClient.post<{ banked: number; newBalance: number }>('/banking/bank', {
      shipId, year
    });
    return response.data;
  }

  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const response = await httpClient.get<BankEntry[]>('/banking/records', {
      params: { shipId, year }
    });
    return response.data;
  }

  async createPool(year: number, shipIds: string[]): Promise<Pool> {
    const response = await httpClient.post<Pool>('/pools', { year, shipIds });
    return response.data;
  }
}