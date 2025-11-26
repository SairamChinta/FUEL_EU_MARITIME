
export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbGCO2eq: number;
  isSurplus: boolean;
  isDeficit: boolean;
}

export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGCO2eq: number;
  createdAt: string;
}

export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface Pool {
  id: string;
  year: number;
  members: PoolMember[];
  poolTotal: number;
}