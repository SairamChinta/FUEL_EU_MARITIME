
export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGCO2eq: number;
  createdAt: Date;
}

export interface BankingRepository {
  getBankedAmount(shipId: string, year: number): Promise<number>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry>;
  getBankRecords(shipId: string, year: number): Promise<BankEntry[]>;
}