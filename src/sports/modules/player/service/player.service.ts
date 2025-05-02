import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CricketPlayerRepository } from '../repository/player.repository';
import {
  CricketPlayer,
  PlayerPerformance,
  CricketPlayerHistorial,
  CricketTeam,
} from 'src/schema';
import {
  PlayerStats,
  PlayerRadarStats,
  PlayerTableViewStats,
  PaginatedPlayerStats,
  HomeData,
} from 'src/types/player.types';

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

  async findAll(): Promise<CricketPlayer[]> {
    const [players] = await this.repo.findAll();
    return players;
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

  async getPlayerStats(
    position?: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedPlayerStats> {
    try {
      const [players, totalPlayers] = await this.repo.findAll(
        position,
        page,
        limit,
      );

      const [totalMatches, allPerformances, allHistory, allTeams] =
        await Promise.all([
          this.repo.getTotalMatches(),
          this.repo.getAllPlayerPerformances(),
          this.repo.getAllPlayerHistory(),
          this.repo.getAllTeams(),
        ]);

      if (!players || players.length === 0) {
        return {
          data: [],
          total: 0,
          page,
          limit,
        };
      }

      const performancesMap = new Map<string, PlayerPerformance[]>();
      for (const perf of allPerformances) {
        if (!performancesMap.has(perf.cricketPlayerId)) {
          performancesMap.set(perf.cricketPlayerId, []);
        }
        performancesMap.get(perf.cricketPlayerId)!.push(perf);
      }

      const historyMap = new Map<string, CricketPlayerHistorial[]>();
      for (const hist of allHistory) {
        if (!historyMap.has(hist.playerId)) {
          historyMap.set(hist.playerId, []);
        }
        historyMap.get(hist.playerId)!.push(hist);
      }

      const teamsMap = new Map<string, CricketTeam>();
      for (const team of allTeams) {
        teamsMap.set(team.id, team);
      }

      const playerStats: PlayerStats[] = [];
      for (const player of players) {
        try {
          const team = teamsMap.get(player.teamId);
          const performances = performancesMap.get(player.id) || [];

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

          const totalPointsFromPerformances = performances.reduce(
            (sum, p) => sum + (p.points || 0),
            0,
          );

          const totalRuns = performances.reduce(
            (sum, p) => sum + (p.runs || 0),
            0,
          );

          playerStats.push({
            id: player.id,
            player_name: `${player.firstName} ${player.lastName}`,
            player_team: team?.name || 'Unknown',
            image_path: player.image_path,
            selected_percentage: Number(selectedPercentage.toFixed(2)),
            reward_rate: Number(rewardRate.toFixed(2)),
            points: totalPointsFromPerformances,
            runs: totalRuns,
          });
        } catch (error: unknown) {
          console.error(
            `Error processing player ${player.id} (${player.firstName} ${player.lastName}):`,
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
            error,
          );
          continue;
        }
      }

      return {
        data: playerStats,
        total: totalPlayers,
        page,
        limit,
      };
    } catch (error: unknown) {
      console.error('Unexpected error in getPlayerStats:', error);
      throw error;
    }
  }

  async getPlayerRadarStats(id: string): Promise<PlayerRadarStats> {
    const player = await this.repo.findOne(id);
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const [team, performances, history] = await Promise.all([
      this.repo.findTeamById(player.teamId),
      this.repo.getPlayerPerformances(id),
      this.repo.getPlayerHistory(id),
    ]);

    const totalRuns = performances.reduce((sum, p) => sum + (p.runs || 0), 0);

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

    const runs = totalRuns;
    const assists = Math.min(avgCatches * 20, 100);
    const hitting = Math.min(avgHistoryRuns * 2, 100);
    const speed = Math.min(avgWickets * 20, 100);
    const dribbling = Math.min(avgHistoryPoints * 1.5, 100);

    return {
      image_path: player?.image_path || 'Unknown Team Image',
      team_name: team?.name || 'Unknown Team',
      player_name: `${player.firstName} ${player.lastName}`,
      stats: {
        runs: Number(runs.toFixed(2)),
        assists: Number(assists.toFixed(2)),
        hitting: Number(hitting.toFixed(2)),
        speed: Number(speed.toFixed(2)),
        dribbling: Number(dribbling.toFixed(2)),
      },
    };
  }

  async getPlayerTableStats(
    position?: string,
  ): Promise<PlayerTableViewStats[]> {
    try {
      const [players] = await this.repo.findAll(position);

      const [totalMatches, allPerformances, allHistory, allTeams] =
        await Promise.all([
          this.repo.getTotalMatches(),
          this.repo.getAllPlayerPerformances(),
          this.repo.getAllPlayerHistory(),
          this.repo.getAllTeams(),
        ]);

      if (!players || players.length === 0) {
        return [];
      }

      const performancesMap = new Map<string, PlayerPerformance[]>();
      for (const perf of allPerformances) {
        if (!performancesMap.has(perf.cricketPlayerId)) {
          performancesMap.set(perf.cricketPlayerId, []);
        }
        performancesMap.get(perf.cricketPlayerId)!.push(perf);
      }

      const historyMap = new Map<string, CricketPlayerHistorial[]>();
      for (const hist of allHistory) {
        if (!historyMap.has(hist.playerId)) {
          historyMap.set(hist.playerId, []);
        }
        historyMap.get(hist.playerId)!.push(hist);
      }

      const teamsMap = new Map<string, CricketTeam>();
      for (const team of allTeams) {
        teamsMap.set(team.id, team);
      }

      const playerTableStats: PlayerTableViewStats[] = [];

      const ESTIMATED_MINUTES_PER_MATCH = 120;

      for (const player of players) {
        try {
          const team = teamsMap.get(player.teamId);
          const performances = performancesMap.get(player.id) || [];
          const history = historyMap.get(player.id) || [];

          const matchesPlayed = performances.length;

          const estimatedMinutesPlayed =
            matchesPlayed * ESTIMATED_MINUTES_PER_MATCH;

          const selectedPercentage =
            totalMatches > 0 ? (matchesPlayed / totalMatches) * 100 : 0;

          const totalPerformancePoints = performances.reduce(
            (sum, p) => sum + (p.points || 0),
            0,
          );
          const pointsPerMatch =
            matchesPlayed > 0 ? totalPerformancePoints / matchesPlayed : 0;

          const totalPerformanceRuns = performances.reduce(
            (sum, p) => sum + (p.runs || 0),
            0,
          );

          const totalPerformanceWickets = performances.reduce(
            (sum, p) => sum + (p.wickets || 0),
            0,
          );

          const totalHistoryPoints = history.reduce(
            (sum, h) => sum + (h.points || 0),
            0,
          );
          const avgPerformancePoints =
            matchesPlayed > 0 ? totalPerformancePoints / matchesPlayed : 0;

          const basePrice =
            totalHistoryPoints +
            avgPerformancePoints * 5 +
            totalPerformanceRuns * 0.1 +
            totalPerformanceWickets * 10;

          const price = Math.max(basePrice, 20);

          playerTableStats.push({
            id: player.id,
            position: player?.position,
            player_name: `${player.firstName} ${player.lastName}`,
            player_team: team?.name || 'Unknown Team',
            image_path: player.image_path,
            price: Number(price.toFixed(2)),
            pointsPerMatch: Number(pointsPerMatch.toFixed(2)),
            selectedPercentage: Number(selectedPercentage.toFixed(2)),
            totalRuns: totalPerformanceRuns,
            totalWickets: totalPerformanceWickets,
            minutesPlayed: estimatedMinutesPlayed,
          });
        } catch (error: unknown) {
          console.error(
            `Error processing player ${player.id} (${player.firstName} ${player.lastName}) for table stats:`,
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
            error,
          );
          continue;
        }
      }

      return playerTableStats;
    } catch (error: unknown) {
      console.error('Unexpected error in getPlayerTableStats:', error);
      throw error;
    }
  }

  async getHomeData(): Promise<HomeData> {
    try {
      const [
        allPlayers,
        allPerformances,
        allHistory,
        allTeams,
        upcomingMatches,
      ] = await Promise.all([
        this.repo.findAll(),
        this.repo.getAllPlayerPerformances(),
        this.repo.getAllPlayerHistory(),
        this.repo.getAllTeams(),
        this.repo.getUpcomingMatches(),
      ]);

      const [players] = allPlayers;

      if (!players || players.length === 0) {
        return {
          topPlayers: [],
          upcomingMatches:
            upcomingMatches.map((match) => ({
              id: match.id,
              homeTeamId: match.homeTeamId,
              awayTeamId: match.awayTeamId,
              matchDate: match.matchDate,
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              pool: match.pool,
            })) || [],
        };
      }

      const performancesMap = new Map<string, PlayerPerformance[]>();
      for (const perf of allPerformances) {
        if (!performancesMap.has(perf.cricketPlayerId)) {
          performancesMap.set(perf.cricketPlayerId, []);
        }
        performancesMap.get(perf.cricketPlayerId)!.push(perf);
      }

      const historyMap = new Map<string, CricketPlayerHistorial[]>();
      for (const hist of allHistory) {
        if (!historyMap.has(hist.playerId)) {
          historyMap.set(hist.playerId, []);
        }
        historyMap.get(hist.playerId)!.push(hist);
      }

      const teamsMap = new Map<string, CricketTeam>();
      for (const team of allTeams) {
        teamsMap.set(team.id, team);
      }

      const allPlayerStats: PlayerStats[] = [];
      for (const player of players) {
        try {
          const team = teamsMap.get(player.teamId);
          const performances = performancesMap.get(player.id) || [];

          const totalPointsFromPerformances = performances.reduce(
            (sum, p) => sum + (p.points || 0),
            0,
          );

          const totalRuns = performances.reduce(
            (sum, p) => sum + (p.runs || 0),
            0,
          );

          allPlayerStats.push({
            id: player.id,
            player_name: `${player.firstName} ${player.lastName}`,
            player_team: team?.name || 'Unknown',
            image_path: player.image_path,
            points: totalPointsFromPerformances,
            runs: totalRuns,
            selected_percentage: 0,
            reward_rate: 0,
          });
        } catch (error: unknown) {
          console.error(
            `Error calculating points/runs for player ${player.id} (${player.firstName} ${player.lastName}) for home data:`,
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
            error,
          );
          continue;
        }
      }

      const topPlayers = allPlayerStats
        .sort((a, b) => b.runs - a.runs)
        .slice(0, 5);

      return {
        topPlayers: topPlayers,
        upcomingMatches:
          upcomingMatches.map((match) => ({
            id: match.id,
            homeTeamId: match.homeTeamId,
            awayTeamId: match.awayTeamId,
            matchDate: match.matchDate,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            pool: match.pool,
          })) || [],
      };
    } catch (error: unknown) {
      console.error('Unexpected error in getHomeData:', error);
      throw error;
    }
  }
}
