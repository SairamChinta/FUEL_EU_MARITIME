
import { Pool, PoolMember } from '../../core/entities/Pool';
import { PoolRepository } from '../../ports/PoolRepository';
import { prisma } from '../../infrastructure/database';

export class PrismaPoolRepository implements PoolRepository {
  async createPool(pool: Pool): Promise<Pool> {
    const createdPool = await prisma.pool.create({
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

    const membersMap = new Map<string, PoolMember>();
    createdPool.members.forEach(member => {
      membersMap.set(member.shipId, {
        shipId: member.shipId,
        cbBefore: member.cbBefore,
        cbAfter: member.cbAfter
      });
    });

    return new Pool(createdPool.id, createdPool.year, membersMap);
  }
}