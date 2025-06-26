import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CricketPoolRepository } from '../repository/pool.repository';
import { CricketPool, CricketPoolStatus } from 'src/schema';

@Injectable()
export class CricketPoolService {
  constructor(private readonly poolRepo: CricketPoolRepository) {}

  async create(entity: CricketPool) {
    const team = new CricketPool(entity.cricketMatchId, entity.id);
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

  async updatePoolResults(id: string, match: any): Promise<CricketPool> {
    const pool = await this.poolRepo.findOne(id);
    if (!pool) {
      throw new NotFoundException('Pool not found');
    }

    // Update the pool results based on the match data
    const localTeam = match.localteam_id;
    const visitorTeam = match.visitorteam_id;

    pool.homeResult = match.scoreboards.find(
      (scoreboard) => scoreboard.team_id === localTeam && scoreboard.type === 'total',
    )?.total || 0;
    pool.awayResult = match.scoreboards.find(
      (scoreboard) => scoreboard.team_id === visitorTeam && scoreboard.type === 'total',
    )?.total || 0;
    pool.status = CricketPoolStatus.Finished; // Assuming the match is finished

    return this.poolRepo.update(pool);
  }

}
