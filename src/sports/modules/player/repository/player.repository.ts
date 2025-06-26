/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, ConflictException } from '@nestjs/common';
import { Repository, FindManyOptions, MoreThanOrEqual } from 'typeorm';
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

  /**
   * This method retrieves upcoming matches for the current week,
   * starting from April 18, 2025.
   * @returns A list of upcoming matches for the current week, starting from April 18, 2025.
   */
  async getUpcomingMatches(): Promise<CricketMatch[]> {
    try {
      const baseDate = new Date('2025-04-18T00:00:00.000Z');
      const systemLaunchDate = new Date('2025-06-03T00:00:00.000Z');

      const now = new Date();
      const msPerWeek = 7 * 24 * 60 * 60 * 1000;
      const timeDiff = now.getTime() - systemLaunchDate.getTime();
      const weeksPassed = Math.floor(timeDiff / msPerWeek);

      // Get all matches from the repository in year 2025
      const allMatches = await this.matchRepo.find({
        where: {
          matchDate: MoreThanOrEqual(new Date('2025-01-01')),
        },
        relations: ['homeTeam', 'awayTeam'],
        order: {
          matchDate: 'ASC',
        },
      });

      const validMatches = allMatches.filter(
        (match) => match.matchDate && match.id, // Ensure matchDate and id are defined
      );

      if (validMatches.length === 0) {
        return [];
      }

      const weeklyChunks: CricketMatch[][] = [];
      let chunkStart = new Date(baseDate);

      const maxWeeks = 20;

      for (let week = 0; week < maxWeeks; week++) {
        const chunkEnd = new Date(chunkStart.getTime() + msPerWeek);

        const weekMatches = validMatches.filter((match) => {
          const matchDate = new Date(match.matchDate);
          return matchDate >= chunkStart && matchDate < chunkEnd;
        });

        if (weekMatches.length > 0) {
          weeklyChunks.push(weekMatches);
        }
        chunkStart = new Date(chunkEnd);

        if (validMatches.length > 0) {
          const lastMatchDate = new Date(
            validMatches[validMatches.length - 1].matchDate,
          );
          if (chunkStart > new Date(lastMatchDate.getTime() + msPerWeek)) {
            break;
          }
        }
      }

      if (weeklyChunks.length === 0) {
        return [];
      }
      const weekIndex = weeksPassed % weeklyChunks.length;
      const selectedWeek = weeklyChunks[weekIndex] || [];

      return selectedWeek;
    } catch (error) {
      return [];
    }
  }
}
