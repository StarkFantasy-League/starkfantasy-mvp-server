import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CricketTeamRepository } from '../repository/team.repository';
import { CricketTeam } from 'src/schema';

@Injectable()
export class CricketTeamService {
  constructor(private readonly teamRepo: CricketTeamRepository) {}

  async create(entity: CricketTeam) {
    const team = new CricketTeam(entity.id, entity.name,entity.image_path);
    try {
      return await this.teamRepo.create(team);
    } catch (error) {
      if (error.code === '23505' || error.number === 2627) {
        throw new ConflictException('The team ID already exists');
      }
      throw error;
    }
  }

  findAll() {
    return this.teamRepo.findAll();
  }

  async findOne(id: string) {
    const team = await this.teamRepo.findOne(id);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  async delete(id: string): Promise<void> {
    const team = await this.teamRepo.findOne(id);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    await this.teamRepo.delete(id);
  }
}
