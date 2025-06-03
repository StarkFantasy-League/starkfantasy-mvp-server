import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SoccerSpecialBet } from 'src/schema';

@Injectable()
export class SoccerSpecialBetRepository {
  constructor(
    @InjectRepository(SoccerSpecialBet)
    private readonly repo: Repository<SoccerSpecialBet>,
  ) {}

  create(soccerSpecialBet: SoccerSpecialBet) {
    return this.repo.insert(soccerSpecialBet);
  }

  findAll() {
    return this.repo.find();
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async findByPlayerId(playerId: string): Promise<SoccerSpecialBet[]> {
    return this.repo.find({
      where: { playerId: playerId },
    });
  }

  async findBySpecialBetId(specialBetId: string): Promise<SoccerSpecialBet[]> {
    return this.repo.find({
      where: { specialBetId: specialBetId },
    });
  }
}
