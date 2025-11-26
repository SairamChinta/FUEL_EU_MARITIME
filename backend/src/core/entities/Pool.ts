
export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export class Pool {
  constructor(
    public readonly id: string,
    public readonly year: number,
    private members: Map<string, PoolMember>
  ) {}

  static create(year: number, members: PoolMember[]): Pool {
    const pool = new Pool(crypto.randomUUID(), year, new Map());
    
    members.forEach(member => {
      pool.members.set(member.shipId, { ...member, cbAfter: member.cbBefore });
    });

    if (!pool.isValid()) {
      throw new Error("Pool validation failed");
    }

    pool.allocateSurplus();

    return pool;
  }

  private isValid(): boolean {
    const totalCB = Array.from(this.members.values())
      .reduce((sum, member) => sum + member.cbBefore, 0);
    
    if (totalCB < 0) return false;

    for (const member of this.members.values()) {
      if (member.cbBefore < 0 && member.cbAfter > member.cbBefore) return false;
      if (member.cbBefore >= 0 && member.cbAfter < 0) return false;
    }

    return true;
  }

  private allocateSurplus(): void {
    const deficits = Array.from(this.members.values())
      .filter(m => m.cbBefore < 0)
      .sort((a, b) => a.cbBefore - b.cbBefore);

    const surpluses = Array.from(this.members.values())
      .filter(m => m.cbBefore > 0)
      .sort((a, b) => b.cbBefore - a.cbBefore);

    for (const deficit of deficits) {
      let remainingDeficit = Math.abs(deficit.cbBefore);

      for (const surplus of surpluses) {
        if (surplus.cbAfter <= 0) continue;

        const transfer = Math.min(remainingDeficit, surplus.cbAfter);
        
        deficit.cbAfter += transfer;
        surplus.cbAfter -= transfer;
        remainingDeficit -= transfer;

        if (remainingDeficit <= 0) break;
      }
    }
  }

  getMembers(): PoolMember[] {
    return Array.from(this.members.values());
  }

  getPoolTotal(): number {
    return Array.from(this.members.values())
      .reduce((sum, member) => sum + member.cbAfter, 0);
  }
}