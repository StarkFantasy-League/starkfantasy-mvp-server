import { Injectable, NotFoundException } from '@nestjs/common';
import { SoccerSpecialBetRepository } from '../repository/soccer-special-bet.repository';
import { SoccerSpecialBet } from 'src/schema';

@Injectable()
export class SoccerSpecialBetService {
  constructor(
    private readonly soccerSpecialBetRepo: SoccerSpecialBetRepository,
  ) {}

  async create(entity: SoccerSpecialBet) {
    const newSoccerSpecialBet = new SoccerSpecialBet(
      entity.specialBetId,
      entity.playerId,
    );
    try {
      return await this.soccerSpecialBetRepo.create(newSoccerSpecialBet);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.soccerSpecialBetRepo.findAll();
  }

  async findOne(id: string) {
    const soccerSpecialBet = await this.soccerSpecialBetRepo.findOne(id);
    if (!soccerSpecialBet) {
      throw new NotFoundException('Soccer special bet not found');
    }
    return soccerSpecialBet;
  }

  async delete(id: string): Promise<void> {
    const soccerSpecialBet = await this.soccerSpecialBetRepo.findOne(id);
    if (!soccerSpecialBet) {
      throw new NotFoundException('Soccer special bet not found');
    }
    await this.soccerSpecialBetRepo.delete(id);
  }

  async findByPlayerId(playerId: string): Promise<SoccerSpecialBet[]> {
    const bets = await this.soccerSpecialBetRepo.findByPlayerId(playerId);
    if (!bets || bets.length === 0) {
      throw new NotFoundException(
        `No soccer special bets found for player ID: ${playerId}`,
      );
    }
    return bets;
  }

  async findBySpecialBetId(specialBetId: string): Promise<SoccerSpecialBet[]> {
    const bets =
      await this.soccerSpecialBetRepo.findBySpecialBetId(specialBetId);
    if (!bets || bets.length === 0) {
      throw new NotFoundException(
        `No soccer special bets found for special bet ID: ${specialBetId}`,
      );
    }
    return bets;
  }
}
