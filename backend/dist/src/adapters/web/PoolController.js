"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolController = void 0;
const PrismaPoolRepository_1 = require("../database/PrismaPoolRepository");
const PrismaComplianceRepository_1 = require("../database/PrismaComplianceRepository");
const CreatePool_1 = require("../../core/usecases/CreatePool");
const poolRepository = new PrismaPoolRepository_1.PrismaPoolRepository();
const complianceRepository = new PrismaComplianceRepository_1.PrismaComplianceRepository();
const createPool = new CreatePool_1.CreatePool(poolRepository, complianceRepository);
class PoolController {
    static async createPool(req, res) {
        try {
            const { year, shipIds } = req.body;
            if (!year || !shipIds || !Array.isArray(shipIds)) {
                return res.status(400).json({ error: 'year and shipIds array are required' });
            }
            console.log('Creating pool with:', { year, shipIds });
            const pool = await createPool.execute(parseInt(year), shipIds);
            console.log('Pool created successfully:', pool);
            res.json({
                id: pool.id,
                year: pool.year,
                members: pool.getMembers(),
                poolTotal: pool.getPoolTotal()
            });
        }
        catch (error) {
            console.error('Pool creation error:', error);
            res.status(500).json({ error: 'Failed to create pool' });
        }
    }
}
exports.PoolController = PoolController;
