import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { SoccerPoolRepository } from '../repository/soccer-pool.repository';
import { SoccerPool } from 'src/schema';

@Injectable()
export class SoccerPoolService {
  constructor(private readonly poolRepo: SoccerPoolRepository) {}

  async create(entity: SoccerPool) {
    const pool = new SoccerPool(entity.id, entity.matchId);
    try {
      return await this.poolRepo.create(pool);
    } catch (error) {
      if (error.code === '23505' || error.number === 2627) {
        throw new ConflictException('The pool ID already exists');
      }
      throw error;
    }
  }

  findAll() {
    return this.poolRepo.findAll();
  }

  async findOne(id: string) {
    const pool = await this.poolRepo.findOne(id);
    if (!pool) {
      throw new NotFoundException('pool not found');
    }
    return pool;
  }

  async delete(id: string): Promise<void> {
    const pool = await this.poolRepo.findOne(id);
    if (!pool) {
      throw new NotFoundException('pool not found');
    }
    await this.poolRepo.delete(id);
  }
}
