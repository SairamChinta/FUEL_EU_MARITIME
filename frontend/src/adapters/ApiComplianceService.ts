
import { ComplianceService } from '../ports/ComplianceService';
import { ComplianceBalance, BankEntry, Pool } from '../core/entities/Compliance';
import axios, { AxiosError } from 'axios';
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

  async applyBank(fromShipId: string, toShipId: string, year: number, amount: number): Promise<{ applied: number; fromNewBalance: number; toNewBalance: number }> {
    const response = await httpClient.post<{ applied: number; fromNewBalance: number; toNewBalance: number }>('/banking/apply', {
      fromShipId,
      toShipId,
      year,
      amount
    });

    return response.data;
  }

  async createPool(year: number, shipIds: string[]): Promise<Pool> {
    try {
      const response = await httpClient.post<Pool>('/pools', { year, shipIds });
      return response.data;
    } catch (err) {
      // Convert axios timeout / connection errors into helpful messages for the UI
      if (axios.isAxiosError(err)) {
        const ae = err as AxiosError;
        if (ae.code === 'ECONNREFUSED') {
          throw new Error('Unable to reach backend at http://localhost:3001 — is the backend dev server running?');
        }

        if (ae.code === 'ECONNABORTED' || (ae.message && ae.message.includes('timeout'))) {
          throw new Error('Request timed out while creating pool — the backend may be busy or unreachable.');
        }
      }

      // Re-throw original error if we can't map it
      throw err;
    }
  }
}