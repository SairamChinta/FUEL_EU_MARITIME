import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import { app } from '../infrastructure/server';

describe('Integration - basic endpoints', () => {
  it('GET /compliance/cb without params returns 400', async () => {
    const res = await request(app).get('/compliance/cb');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /banking/apply without body returns 400', async () => {
    const res = await request(app).post('/banking/apply').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /pools creates a pool (happy path, mocked repos)', async () => {
    // Reset modules and mock repository implementations before loading server
    vi.resetModules();

    vi.mock('../adapters/database/PrismaComplianceRepository', async () => {
      return {
        PrismaComplianceRepository: class {
          async getAdjustedComplianceBalance(shipId: string, year: number) {
            return { shipId, year, cbGCO2eq: shipId === 'SHIP003' ? 50 : -20, isSurplus: shipId === 'SHIP003', isDeficit: shipId !== 'SHIP003' };
          }
        }
      } as any;
    });

    vi.mock('../adapters/database/PrismaPoolRepository', async () => {
      return {
        PrismaPoolRepository: class {
          async createPool(_pool: any) {
            const members = [ { shipId: 'SHIP003', cbBefore: 50, cbAfter: 20 }, { shipId: 'SHIP002', cbBefore: -30, cbAfter: 0 } ];
            return { id: 'pool_test', year: 2024, getMembers: () => members, getPoolTotal: () => 30 } as any;
          }
        }
      } as any;
    });

    const { app: appWithMocks } = await import('../infrastructure/server');
    const res = await request(appWithMocks).post('/pools').send({ year: 2024, shipIds: ['SHIP003', 'SHIP002'] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('members');
  });

  it('POST /banking/apply applies banked surplus (happy path, mocked repos)', async () => {
    vi.resetModules();

    vi.mock('../adapters/database/PrismaComplianceRepository', async () => {
      return {
        PrismaComplianceRepository: class {
          // first call is for target, ensure target has deficit
          async getAdjustedComplianceBalance(shipId: string, year: number) {
            return { shipId, year, cbGCO2eq: shipId === 'SHIP002' ? -30 : 50, isSurplus: shipId !== 'SHIP002', isDeficit: shipId === 'SHIP002' };
          }
        }
      } as any;
    });

    vi.mock('../adapters/database/PrismaBankingRepository', async () => {
      return {
        PrismaBankingRepository: class {
          async applyBanked(fromShipId: string, toShipId: string, year: number, amount: number) {
            return { applied: amount, fromNewBalance: 25, toNewBalance: -5 };
          }
        }
      } as any;
    });

    const { app: appWithMocks } = await import('../infrastructure/server');
    const res = await request(appWithMocks).post('/banking/apply').send({ fromShipId: 'SHIP003', toShipId: 'SHIP002', year: 2024, amount: 25 });
    expect(res.status).toBe(200);
    expect(res.body.applied).toBe(25);
  });
});
