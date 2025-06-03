import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { SoccerPlayerRepository } from '../repository/soccer-player.repository';
import { SoccerPlayer } from 'src/schema';

@Injectable()
export class SoccerPlayerService {
  constructor(private readonly playerRepo: SoccerPlayerRepository) {}

  async create(entity: SoccerPlayer): Promise<SoccerPlayer> {
    const playerToCreate = new SoccerPlayer(
      entity?.id,
      entity?.teamId,
      entity?.firstName,
      entity?.lastName,
      entity?.position,
      entity?.image_path,
    );
    try {
      const existingPlayer = await this.playerRepo.findOne(playerToCreate.id);
      if (existingPlayer) {
        throw new ConflictException('The player ID already exists');
      }
      const newPlayer = await this.playerRepo.create(playerToCreate);
      console.log('Player created successfully:', newPlayer);
      return newPlayer;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        ((error as any).code === '23505' || (error as any).number === 2627)
      ) {
        throw new ConflictException('The player ID already exists');
      }
      console.error('Error creating player:', error);
      throw error;
    }
  }

  async findAll(): Promise<SoccerPlayer[]> {
    return this.playerRepo.findAll();
  }

  async findOne(id: string): Promise<SoccerPlayer> {
    const player = await this.playerRepo.findOne(id);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  async update(id: string, playerData: Partial<SoccerPlayer>): Promise<SoccerPlayer> {
    const existingPlayer = await this.playerRepo.findOne(id);
    if (!existingPlayer) {
      throw new NotFoundException('Player not found');
    }
    try {
      return await this.playerRepo.update(id, playerData);
    } catch (error) {
      if (error.code === '23505' || error.number === 2627) {
        throw new ConflictException('The player information conflicts with an existing record');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<any> {
    const player = await this.playerRepo.findOne(id);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    await this.playerRepo.delete(id);
    return { message: 'Player deleted successfully' };
  }
}
