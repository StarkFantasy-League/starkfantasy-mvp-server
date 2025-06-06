import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SportmonksService } from '../API/sportmonks.service';
import { PlayerPerformanceService } from '../playerPerformance/service/player-performance.service';
import { CricketMatchService } from '../match/service/match.service';
import { PlayerPerformance } from 'src/schema';
import * as dayjs from 'dayjs';
import {
  calculateBattingPoints,
  calculateBowlingPoints,
} from '../Util/cricket-points.util';

@Injectable()
export class TaskPlayerPerformance {
  private readonly logger = new Logger(TaskPlayerPerformance.name);

  constructor(
    private readonly sportmonksService: SportmonksService,
    private readonly playerPerformanceService: PlayerPerformanceService,
    private readonly cricketMatchService: CricketMatchService,
  ) {}

  private async getMatchesFromLastWeek(): Promise<any[]> {
    let filteredMatches: any[] = [];

    try {
      const allGames = await this.cricketMatchService.findAll();

      const today = dayjs();
      const sevenDaysAgo = today.subtract(8, 'day');
      const todayPlusOne = today.add(0, 'day');

      filteredMatches = allGames.filter((perf) => {
        const matchDate = dayjs(perf.matchDate);
        return (
          matchDate.isAfter(sevenDaysAgo) && matchDate.isBefore(todayPlusOne)
        );
      });
    } catch (error) {
      this.logger.error(
        '❌ Error al obtener partidos de la semana pasada:',
        error,
      );
    }

    return filteredMatches;
  }

  @Cron('0 46 19 * * 1') // Lunes a las 19:46 (7:46 PM)
  async getPlayerPerformancesForWeek() {
    const matches = await this.getMatchesFromLastWeek();
    this.logger.log(
      `🗂️ Se encontraron ${matches.length} partidos para el resumen semanal`,
    );

    const catchesMap = await this.calculateCatchesForWeek();

    for (const p of matches) {
      this.logger.log(`🔍 ID: ${p.id} - Fecha: ${p.matchDate}`);

      try {
        const matchDetails =
          await this.sportmonksService.getPerformancesByMatch(p.id);

        const playerStats = new Map<
          number,
          { runs: number; wickets: number; catches: number }
        >();

        matchDetails.batting?.forEach((b) => {
          const playerId = b.player_id;
          const runs = b.score || 0;

          const existing = playerStats.get(playerId) || {
            runs: 0,
            wickets: 0,
            catches: 0,
          };
          existing.runs += runs;
          playerStats.set(playerId, existing);
        });

        matchDetails.bowling?.forEach((b) => {
          const playerId = b.player_id;
          const wickets = b.wickets || 0;

          const existing = playerStats.get(playerId) || {
            runs: 0,
            wickets: 0,
            catches: 0,
          };
          existing.wickets += wickets;
          playerStats.set(playerId, existing);
        });

        playerStats.forEach((stats, playerId) => {
          const totalCatches = catchesMap.get(playerId) || 0;
          stats.catches = totalCatches;
        });

        for (const [playerId, stats] of playerStats.entries()) {
          const batting = matchDetails.batting?.find(
            (b) => b.player_id === playerId,
          );
          const bowling = matchDetails.bowling?.find(
            (b) => b.player_id === playerId,
          );

          const runs = stats.runs;
          const sixes = batting?.six_x || 0;
          const notOut = batting?.score_not_out || false;

          const wickets = stats.wickets;
          const maidens = bowling?.medians || 0;

          const battingPoints = calculateBattingPoints(runs, sixes, notOut);
          const bowlingPoints = calculateBowlingPoints(wickets, maidens);
          const catchesPoints = stats.catches * 8;

          const totalPoints = battingPoints + bowlingPoints + catchesPoints;

          const performance = new PlayerPerformance(
            p.id.toString(),
            playerId.toString(),
            runs,
            wickets,
            stats.catches,
            totalPoints,
          );

          await this.playerPerformanceService.create(performance);
          this.logger.log(`✅ Registrado correctamente`);
        }
        this.logger.log(`✅ Solicitud completada`);
      } catch (error) {
        this.logger.error(
          `❌ Error al obtener detalles para el partido ${p.id}`,
          error,
        );
      }
    }
  }

  private async calculateCatchesForWeek(): Promise<Map<number, number>> {
    const matches = await this.getMatchesFromLastWeek();
    const catchesMap = new Map<number, number>();

    this.logger.log(`🗂️ Calculando catches en ${matches.length} partidos`);

    for (const p of matches) {
      this.logger.log(`🔍 Procesando partido ID: ${p.id}`);

      try {
        const matchDetails =
          await this.sportmonksService.getPerformancesByMatch(p.id);

        matchDetails.batting?.forEach((b) => {
          if (b.catch_stump_player_id) {
            const currentCatches = catchesMap.get(b.catch_stump_player_id) || 0;
            catchesMap.set(b.catch_stump_player_id, currentCatches + 1);
          }
        });
      } catch (error) {
        this.logger.error(
          `❌ Error al obtener detalles para el partido ${p.id}`,
          error,
        );
      }
    }

    catchesMap.forEach((catches, playerId) => {
      this.logger.log(
        `🧤 Jugador ${playerId} hizo ${catches} catches en la semana`,
      );
    });

    return catchesMap;
  }

  //  @Cron('0 0 3 10 1 *') // 3:00 AM, 10 de enero, todos los años
  async deletePlayerPerformances() {
    try {
      const allPerformances = await this.playerPerformanceService.findAll();

      for (const playerPerformance of allPerformances) {
        await this.playerPerformanceService.delete(playerPerformance.id);
        this.logger.log(`🗑️ Performance eliminado: ${playerPerformance.id}`);
      }

      this.logger.log(
        `✅ Todos los performance han sido eliminados (${allPerformances.length})`,
      );
    } catch (error) {
      this.logger.error('❌ Error al eliminar los performance:', error);
    }
  }
}
