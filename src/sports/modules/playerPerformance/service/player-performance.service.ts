import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PlayerPerformanceRepository } from '../repository/player-performance.repository';
import { PlayerPerformance } from 'src/schema';

@Injectable()
export class PlayerPerformanceService {
  constructor(private readonly playerPerformanceRepo: PlayerPerformanceRepository) {}

  async create(entity: PlayerPerformance) {
    const team = new PlayerPerformance(entity.id, entity.cricketMatchId,entity.cricketPlayerId,entity.runs,entity.wickets,entity.catches);
    try {
      return await this.playerPerformanceRepo.create(team);
    } catch (error) {
      if (error.code === '23505' || error.number === 2627) {
        throw new ConflictException('The Player performance ID already exists');
      }
      throw error;
    }
  }

  findAll() {
    return this.playerPerformanceRepo.findAll();
  }

  async findOne(id: string) {
    const team = await this.playerPerformanceRepo.findOne(id);
    if (!team) {
      throw new NotFoundException('Player performance not found');
    }
    return team;
  }

  async delete(id: string): Promise<void> {
    const team = await this.playerPerformanceRepo.findOne(id);
    if (!team) {
      throw new NotFoundException('Player performance not found');
    }
    await this.playerPerformanceRepo.delete(id);
  }
}
