import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CricketTeamRepository } from '../repository/team.repository';
import { CricketTeam } from 'src/schema';

@Injectable()
export class CricketTeamService {
  constructor(private readonly teamRepo: CricketTeamRepository) {}

  async create(teamData: CricketTeam) {
    const team = new CricketTeam(teamData.id, teamData.name, teamData.image_path);
    try {
      return await this.teamRepo.create(team);
    } catch (error) {
      if (error.code === '23505' || error.number === 2627) {
        throw new ConflictException('The team ID already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<CricketTeam[]> {
    return this.teamRepo.findAll();
  }

  async findOne(id: string): Promise<CricketTeam | null> {
    const team = await this.teamRepo.findOne(id);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  async update(id: string, teamData: Partial<CricketTeam>): Promise<CricketTeam> {
    const existingTeam = await this.teamRepo.findOne(id);
    if (!existingTeam) {
      throw new NotFoundException('Team not found');
    }
    const updatedTeam = Object.assign(existingTeam, teamData);
    try {
      return await this.teamRepo.update(id, updatedTeam);
    } catch (error) {
      if (error.code === '23505' || error.number === 2627) {
        throw new ConflictException('The team ID already exists');
      }
      throw error;
    }
  }


  async delete(id: string): Promise<void> {
    const team = await this.teamRepo.findOne(id);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    await this.teamRepo.delete(id);
  }
}
