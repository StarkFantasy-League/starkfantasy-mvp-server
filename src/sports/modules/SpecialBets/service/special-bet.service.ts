import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { SpecialBetRepository } from '../repository/special-bet.repository';
import { SpecialBet } from 'src/schema';

@Injectable()
export class SpecialBetService {
  constructor(private readonly specialBetRepo: SpecialBetRepository) {}

  async create(entity: SpecialBet) {
    const team = new SpecialBet(entity.specialBetId, entity.playerId);
    try {
      return await this.specialBetRepo.create(team);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.specialBetRepo.findAll();
  }

  async findOne(id: string) {
    const team = await this.specialBetRepo.findOne(id);
    if (!team) {
      throw new NotFoundException('Special bet not found');
    }
    return team;
  }

  async delete(id: string): Promise<void> {
    const team = await this.specialBetRepo.findOne(id);
    if (!team) {
      throw new NotFoundException('Special bet not found');
    }
    await this.specialBetRepo.delete(id);
  }

  async findByPlayerId(playerId: string): Promise<SpecialBet[]> {
    const bets = await this.specialBetRepo.findByPlayerId(playerId);

    if (!bets || bets.length === 0) {
      throw new NotFoundException(`No bets found for player ID: ${playerId}`);
    }

    return bets;
  }

  async findByBet(betId: string): Promise<SpecialBet[]> {
    const bets = await this.specialBetRepo.findByBet(betId);

    if (!bets || bets.length === 0) {
      throw new NotFoundException(`No performances found for bet ID: ${betId}`);
    }

    return bets;
  }
}
