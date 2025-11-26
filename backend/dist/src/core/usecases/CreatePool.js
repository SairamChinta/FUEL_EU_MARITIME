"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePool = void 0;
const Pool_1 = require("../entities/Pool");
class CreatePool {
    poolRepository;
    complianceRepository;
    constructor(poolRepository, complianceRepository) {
        this.poolRepository = poolRepository;
        this.complianceRepository = complianceRepository;
    }
    async execute(year, shipIds) {
        if (shipIds.length < 2) {
            throw new Error('At least 2 ships are required to create a pool');
        }
        const members = await Promise.all(shipIds.map(async (shipId) => {
            const balance = await this.complianceRepository.getAdjustedComplianceBalance(shipId, year);
            return {
                shipId,
                cbBefore: balance.cbGCO2eq,
                cbAfter: balance.cbGCO2eq
            };
        }));
        const pool = Pool_1.Pool.create(year, members);
        return await this.poolRepository.createPool(pool);
    }
}
exports.CreatePool = CreatePool;
