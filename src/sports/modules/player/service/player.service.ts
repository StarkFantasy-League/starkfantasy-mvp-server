import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CricketPlayerRepository } from '../repository/player.repository';
import { CricketPlayer } from 'src/schema';

@Injectable()
export class CricketPlayerService {
  constructor(private readonly teamRepo: CricketPlayerRepository) {}

  async create(entity: CricketPlayer) {
    const team = new CricketPlayer(entity.id,entity.teamId, entity.firstName,entity.lastName,entity.position,entity.image_path);
    try {
      return await this.teamRepo.create(team);
    } catch (error) {
      if (error.code === '23505' || error.number === 2627) {
        throw new ConflictException('The player ID already exists');
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
      throw new NotFoundException('Player not found');
    }
    return team;
  }

  async delete(id: string): Promise<void> {
    const team = await this.teamRepo.findOne(id);
    if (!team) {
      throw new NotFoundException('Player not found');
    }
    await this.teamRepo.delete(id);
  }
}
