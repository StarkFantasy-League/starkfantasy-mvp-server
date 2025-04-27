import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CricketPlayerRepository } from '../repository/player.repository';
import { CricketPlayer } from 'src/schema';
import { PlayerStats, PlayerRadarStats } from 'src/types/player.types';

@Injectable()
export class CricketPlayerService {
  constructor(private readonly repo: CricketPlayerRepository) {}

  async create(entity: CricketPlayer): Promise<CricketPlayer> {
    const playerToCreate = new CricketPlayer(
      entity?.id,
      entity?.teamId,
      entity?.firstName,
      entity?.lastName,
      entity?.position,
      entity?.image_path,
    );
    try {
      return await this.repo.create(playerToCreate);
    } catch (error) {
      if (error.code === '23505' || error.number === 2627) {
        throw new ConflictException('The player ID already exists');
      }
      throw error;
    }
  }

  findAll(): Promise<CricketPlayer[]> {
    return this.repo.findAll();
  }

  async findOne(id: string): Promise<CricketPlayer> {
    const player = await this.repo.findOne(id);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  async delete(id: string): Promise<void> {
    const player = await this.repo.findOne(id);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    await this.repo.delete(id);
  }

  async getPlayerStats(): Promise<PlayerStats[]> {
    try {
      const players = await this.repo.findAll();
      const totalMatches = await this.repo.getTotalMatches();

      if (!players || players.length === 0) {
        return [];
      }

      const playerStats: PlayerStats[] = [];
      for (const player of players) {
        try {
          const team = await this.repo.findTeamById(player.teamId);
          const performances = await this.repo.getPlayerPerformances(player.id);
          const history = await this.repo.getPlayerHistory(player.id);

          const matchesPlayed = performances.length;
          const selectedPercentage =
            totalMatches > 0 ? (matchesPlayed / totalMatches) * 100 : 0;

          const totalPerformancePoints = performances.reduce(
            (sum, p) => sum + (p.points || 0),
            0,
          );
          const rewardRate =
            matchesPlayed > 0
              ? (totalPerformancePoints / matchesPlayed) * 0.1
              : 0;

          const totalPoints = history.reduce(
            (sum, h) => sum + (h.points || 0),
            0,
          );

          playerStats.push({
            id: player.id,
            player_name: `${player.firstName} ${player.lastName}`,
            player_team: team?.name || 'Unknown',
            image_path: player.image_path,
            selected_percentage: Number(selectedPercentage.toFixed(2)),
            reward_rate: Number(rewardRate.toFixed(2)),
            points: totalPoints,
          });
        } catch (error) {
          console.error(
            `Error processing player ${player.id} (${player.firstName} ${player.lastName}):`,
            error,
          );
          continue;
        }
      }

      return playerStats;
    } catch (error) {
      console.error('Unexpected error in getPlayerStats:', error);
      throw error;
    }
  }

  async getPlayerRadarStats(id: string): Promise<PlayerRadarStats> {
    const player = await this.repo.findOne(id);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    const team = await this.repo.findTeamById(player.teamId);
    const performances = await this.repo.getPlayerPerformances(id);
    const history = await this.repo.getPlayerHistory(id);

    const avgRuns =
      performances.length > 0
        ? performances.reduce((sum, p) => sum + (p.runs || 0), 0) /
          performances.length
        : 0;
    const avgCatches =
      performances.length > 0
        ? performances.reduce((sum, p) => sum + (p.catches || 0), 0) /
          performances.length
        : 0;
    const avgWickets =
      performances.length > 0
        ? performances.reduce((sum, p) => sum + (p.wickets || 0), 0) /
          performances.length
        : 0;
    const avgHistoryRuns =
      history.length > 0
        ? history.reduce((sum, h) => sum + (h.runs || 0), 0) / history.length
        : 0;
    const avgHistoryPoints =
      history.length > 0
        ? history.reduce((sum, h) => sum + (h.points || 0), 0) / history.length
        : 0;

    const goals = Math.min(avgRuns * 2, 100);
    const assists = Math.min(avgCatches * 20, 100);
    const hitting = Math.min(avgHistoryRuns * 2, 100);
    const speed = Math.min(avgWickets * 20, 100);
    const dribbling = Math.min(avgHistoryPoints * 1.5, 100);

    return {
      image_path: team?.image_path || 'Unknown Team Image',
      player_name: `${player.firstName} ${player.lastName}`,
      stats: {
        goals: Number(goals.toFixed(2)),
        assists: Number(assists.toFixed(2)),
        hitting: Number(hitting.toFixed(2)),
        speed: Number(speed.toFixed(2)),
        dribbling: Number(dribbling.toFixed(2)),
      },
    };
  }
}
