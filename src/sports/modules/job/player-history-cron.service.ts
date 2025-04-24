import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SportmonksService } from '../API/sportmonks.service';
import { PlayerServiceHistory } from '../PlayerHistorial/service/player-history.service';
import * as dayjs from 'dayjs';
import { CricketPlayerHistorial } from 'src/schema';
import { calculateBattingPoints, calculateBowlingPoints } from '../Util/cricket-points.util';

@Injectable()
export class TaskPlayerHistory {
  private readonly logger = new Logger(TaskPlayerHistory.name);

  constructor(
    private readonly sportmonksService: SportmonksService,
    private readonly playerHistoryService: PlayerServiceHistory
  ) {}

  async generatePlayerHistory() {
    try {
      const matches = await this.sportmonksService.getSeasonMatches();
      const matchesByWeek = this.groupMatchesByWeek(matches);
      const playerTotals = new Map<number, { runs: number, wickets: number, catches: number, points: number }>();
      for (const [weekKey, weekMatches] of Object.entries(matchesByWeek)) {
        const playerWeekly = new Map<number, { runs: number, wickets: number, catches: number, points: number }>();
        for (const match of weekMatches) {
          const matchDetails = await this.sportmonksService.getPerformancesByMatch(match.id);
          matchDetails.batting?.forEach(b => {
            const playerId = b.player_id;
            const runs = b.score || 0;
            const sixes = b.six_x || 0;
            const catchs = b.catch_stump_player_id ? 1 : 0;
            const notOut = b.score_not_out || false;
            const existing = playerWeekly.get(playerId) || { runs: 0, wickets: 0, catches: 0, points: 0 };
            existing.runs += runs;
            existing.catches += catchs;
            existing.points += calculateBattingPoints(runs, sixes, notOut);
            playerWeekly.set(playerId, existing);
          });
          matchDetails.bowling?.forEach(b => {
            const playerId = b.player_id;
            const wickets = b.wickets || 0;
            const maidens = b.medians || 0;

            const existing = playerWeekly.get(playerId) || { runs: 0, wickets: 0, catches: 0, points: 0 };
            existing.wickets += wickets;
            existing.points += calculateBowlingPoints(wickets, maidens);
            playerWeekly.set(playerId, existing);
          });
        }
        for (const [playerId, weeklyStats] of playerWeekly.entries()) {
          const total = playerTotals.get(playerId) || { runs: 0, wickets: 0, catches: 0, points: 0 };
          total.runs += weeklyStats.runs;
          total.wickets += weeklyStats.wickets;
          total.catches += weeklyStats.catches;
          total.points += weeklyStats.points;
          playerTotals.set(playerId, total);
        }
        this.logger.log(`📊 Semana ${weekKey} procesada`);
      }

      for (const [playerId, stats] of playerTotals.entries()) {
        const historial = new CricketPlayerHistorial(
            playerId.toString(),
            stats.runs,
            stats.wickets,
            stats.catches,
            stats.points 
          );
          
          await this.playerHistoryService.create(historial);
          

        this.logger.log(`📥 Historial creado para el jugador ${playerId} con ${stats.points} puntos`);
      }

    } catch (error) {
      this.logger.error('❌ Error generando historial de jugadores:', error);
    }
  }

  private groupMatchesByWeek(matches: any[]): Record<string, any[]> {
    const byWeek: Record<string, any[]> = {};
    matches.forEach(m => {
      const weekKey = dayjs(m.starting_at).startOf('week').format('YYYY-[W]WW');
      if (!byWeek[weekKey]) byWeek[weekKey] = [];
      byWeek[weekKey].push(m);
    });
    return byWeek;
  }

}
