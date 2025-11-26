
import { Pool } from '../core/entities/Pool';

export interface PoolRepository {
  createPool(pool: Pool): Promise<Pool>;
}