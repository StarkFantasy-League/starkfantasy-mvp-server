import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CricketPoolRepository } from '../repository/pool.repository'; 
import { CricketPool } from 'src/schema';

@Injectable()
export class CricketPoolService {
  constructor(private readonly poolRepo: CricketPoolRepository) {}

  async create(entity: CricketPool) {
    const team = new CricketPool(entity.id, entity.cricketMatchId);
    try {
      return await this.poolRepo.create(team);
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
    const team = await this.poolRepo.findOne(id);
    if (!team) {
      throw new NotFoundException('pool not found');
    }
    return team;
  }

  async delete(id: string): Promise<void> {
    const team = await this.poolRepo.findOne(id);
    if (!team) {
      throw new NotFoundException('pool not found');
    }
    await this.poolRepo.delete(id);
  }
}
