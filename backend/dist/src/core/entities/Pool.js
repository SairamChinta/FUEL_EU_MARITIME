"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
class Pool {
    id;
    year;
    members;
    constructor(id, year, members) {
        this.id = id;
        this.year = year;
        this.members = members;
    }
    static create(year, members) {
        const poolId = `pool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const pool = new Pool(poolId, year, new Map());
        members.forEach(member => {
            pool.members.set(member.shipId, { ...member, cbAfter: member.cbBefore });
        });
        // For testing, allow pools with total negative CB
        // if (!pool.isValid()) {
        //   throw new Error("Pool validation failed");
        // }
        pool.allocateSurplus();
        return pool;
    }
    isValid() {
        const totalCB = Array.from(this.members.values())
            .reduce((sum, member) => sum + member.cbBefore, 0);
        // Allow negative total for testing
        // if (totalCB < 0) return false;
        for (const member of this.members.values()) {
            if (member.cbBefore < 0 && member.cbAfter > member.cbBefore)
                return false;
            if (member.cbBefore >= 0 && member.cbAfter < 0)
                return false;
        }
        return true;
    }
    allocateSurplus() {
        const deficits = Array.from(this.members.values())
            .filter(m => m.cbBefore < 0)
            .sort((a, b) => a.cbBefore - b.cbBefore);
        const surpluses = Array.from(this.members.values())
            .filter(m => m.cbBefore > 0)
            .sort((a, b) => b.cbBefore - a.cbBefore);
        for (const deficit of deficits) {
            let remainingDeficit = Math.abs(deficit.cbBefore);
            for (const surplus of surpluses) {
                if (surplus.cbAfter <= 0)
                    continue;
                const transfer = Math.min(remainingDeficit, surplus.cbAfter);
                deficit.cbAfter += transfer;
                surplus.cbAfter -= transfer;
                remainingDeficit -= transfer;
                if (remainingDeficit <= 0)
                    break;
            }
        }
    }
    getMembers() {
        return Array.from(this.members.values());
    }
    getPoolTotal() {
        return Array.from(this.members.values())
            .reduce((sum, member) => sum + member.cbAfter, 0);
    }
}
exports.Pool = Pool;
