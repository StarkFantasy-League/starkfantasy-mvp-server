import { Injectable, ConflictException } from '@nestjs/common';
import { Repository, FindManyOptions, MoreThan } from 'typeorm';
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

  async findAll(
    position?: string,
    page = 1,
    limit = 10,
  ): Promise<[CricketPlayer[], number]> {
    const findOptions: FindManyOptions<CricketPlayer> = {};

    if (position) {
      findOptions.where = { position: position };
    }

    // Pagination options
    const skip = (page - 1) * limit;
    findOptions.skip = skip;
    findOptions.take = limit;

    return this.playerRepo.findAndCount(findOptions);
  }

  async findAllPlayers(position?: string): Promise<CricketPlayer[]> {
    const findOptions: FindManyOptions<CricketPlayer> = {};
    if (position) {
      findOptions.where = { position: position };
    }
    return this.playerRepo.find(findOptions);
  }

  delete(id: string) {
    return this.playerRepo.delete(id);
  }

  findOne(id: string): Promise<CricketPlayer | null> {
    return this.playerRepo.findOne({ where: { id } });
  }

  async getAllTeams(): Promise<CricketTeam[]> {
    try {
      const teams = await this.teamRepo.find();
      return teams;
    } catch (error) {
      console.error('Error fetching all teams:', error);
      return [];
    }
  }

  async findTeamById(teamId: string): Promise<CricketTeam | null> {
    try {
      const team = await this.teamRepo.findOne({ where: { id: teamId } });
      return team;
    } catch (error) {
      console.error(`Error fetching team for teamId ${teamId}:`, error);
      return null;
    }
  }

  async getTotalMatches(): Promise<number> {
    try {
      const count = await this.matchRepo.count();
      return count;
    } catch (error) {
      console.error('Error fetching total matches:', error);
      return 0;
    }
  }

  async getAllPlayerPerformances(): Promise<PlayerPerformance[]> {
    try {
      const performances = await this.performanceRepo.find();
      return performances;
    } catch (error) {
      console.error('Error fetching all player performances:', error);
      return [];
    }
  }

  async getPlayerPerformances(playerId: string): Promise<PlayerPerformance[]> {
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

  async getAllPlayerHistory(): Promise<CricketPlayerHistorial[]> {
    try {
      const history = await this.historyRepo.find();
      return history;
    } catch (error) {
      console.error('Error fetching all player history:', error);
      return [];
    }
  }

  async getPlayerHistory(playerId: string): Promise<CricketPlayerHistorial[]> {
    try {
      const history = await this.historyRepo.find({ where: { playerId } });
      return history;
    } catch (error) {
      console.error(`Error fetching history for player ${playerId}:`, error);
      return [];
    }
  }

  async getUpcomingMatches(): Promise<CricketMatch[]> {
    try {
      const now = new Date();
      const upcomingMatches = await this.matchRepo.find({
        where: {
          matchDate: MoreThan(now),
        },
        relations: ['homeTeam', 'awayTeam'],
        order: {
          matchDate: 'ASC',
        },
      });
      return upcomingMatches;
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      return [];
    }
  }
}
