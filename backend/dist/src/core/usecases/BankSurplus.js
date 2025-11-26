"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankSurplus = void 0;
class BankSurplus {
    bankingRepository;
    complianceRepository;
    constructor(bankingRepository, complianceRepository) {
        this.bankingRepository = bankingRepository;
        this.complianceRepository = complianceRepository;
    }
    async execute(shipId, year) {
        const balance = await this.complianceRepository.getAdjustedComplianceBalance(shipId, year);
        if (balance.cbGCO2eq <= 0) {
            throw new Error('Cannot bank deficit compliance balance');
        }
        await this.bankingRepository.bankSurplus(shipId, year, balance.cbGCO2eq);
        const newBalance = await this.complianceRepository.getAdjustedComplianceBalance(shipId, year);
        return {
            banked: balance.cbGCO2eq,
            newBalance: newBalance.cbGCO2eq
        };
    }
}
exports.BankSurplus = BankSurplus;
