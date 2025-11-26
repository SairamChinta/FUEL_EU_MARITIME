"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPoolRepository = void 0;
const Pool_1 = require("../../core/entities/Pool");
const database_1 = require("../../infrastructure/database");
class PrismaPoolRepository {
    async createPool(pool) {
        const createdPool = await database_1.prisma.pool.create({
            data: {
                id: pool.id,
                year: pool.year,
                members: {
                    create: pool.getMembers().map(member => ({
                        shipId: member.shipId,
                        cbBefore: member.cbBefore,
                        cbAfter: member.cbAfter
                    }))
                }
            },
            include: {
                members: true
            }
        });
        const membersMap = new Map();
        createdPool.members.forEach(member => {
            membersMap.set(member.shipId, {
                shipId: member.shipId,
                cbBefore: member.cbBefore,
                cbAfter: member.cbAfter
            });
        });
        return new Pool_1.Pool(createdPool.id, createdPool.year, membersMap);
    }
}
exports.PrismaPoolRepository = PrismaPoolRepository;
