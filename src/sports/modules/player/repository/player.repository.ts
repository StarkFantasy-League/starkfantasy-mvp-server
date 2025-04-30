import { Injectable, ConflictException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import {
  CricketPlayer,
  CricketTeam,
  CricketMatch,
  PlayerPerformance,
  CricketPlayerHistorial,
} from 'src/schema';

@Injectable()
export class CricketPlayerRepository {
  constructor(
    @InjectRepository(CricketPlayer)
    private readonly playerRepo: Repository<CricketPlayer>,
    @InjectRepository(CricketTeam)
    private readonly teamRepo: Repository<CricketTeam>,
    @InjectRepository(CricketMatch)
    private readonly matchRepo: Repository<CricketMatch>,
    @InjectRepository(PlayerPerformance)
    private readonly performanceRepo: Repository<PlayerPerformance>,
    @InjectRepository(CricketPlayerHistorial)
    private readonly historyRepo: Repository<CricketPlayerHistorial>,
  ) {}

  async create(player: CricketPlayer) {
    const existing = await this.playerRepo.findOne({
      where: { id: player.id },
    });
    if (existing) {
      throw new ConflictException('The player ID already exists');
    }
    return this.playerRepo.save(player);
  }

  findAll() {
    return this.playerRepo.find();
  }

  delete(id: string) {
    return this.playerRepo.delete(id);
  }

  findOne(id: string) {
    return this.playerRepo.findOne({ where: { id } });
  }

  async findTeamById(teamId: string) {
    try {
      const team = await this.teamRepo.findOne({ where: { id: teamId } });
      return team;
    } catch (error) {
      console.error(`Error fetching team for teamId ${teamId}:`, error);
      return null;
    }
  }

  async getTotalMatches() {
    try {
      const count = await this.matchRepo.count();
      return count;
    } catch (error) {
      console.error('Error fetching total matches:', error);
      return 0;
    }
  }

  async getPlayerPerformances(playerId: string) {
    try {
      const performances = await this.performanceRepo.find({
        where: { cricketPlayerId: playerId },
      });
      return performances;
    } catch (error) {
      console.error(
        `Error fetching performances for player ${playerId}:`,
        error,
      );
      return [];
    }
  }

  async getPlayerHistory(playerId: string) {
    try {
      const history = await this.historyRepo.find({ where: { playerId } });
      return history;
    } catch (error) {
      console.error(`Error fetching history for player ${playerId}:`, error);
      return [];
    }
  }
}