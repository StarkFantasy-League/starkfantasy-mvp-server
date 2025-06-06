import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SportmonksService } from '../API/sportmonks.service';
import { CricketMatchService } from '../match/service/match.service';
import { CricketMatch } from 'src/schema';

@Injectable()
export class TaskMatchService {
  private readonly logger = new Logger(TaskMatchService.name);

  constructor(
    private readonly sportmonksService: SportmonksService,
    private readonly cricketMatchService: CricketMatchService,
  ) {}

  @Cron('0 0 3 7 3 *') // 3:00 AM, 7 de marzo, cada año (Antes de comenzar la temporada)
  async updateMatchsForSeason() {
    try {
      const matches = await this.sportmonksService.getSeasonMatches();
      this.logger.log(`✅ Partidos IPL obtenidos (${matches.length}):`);

      for (const match of matches) {
        const matchId = match.id.toString();
        const exists = await this.cricketMatchService
          .findOne(matchId)
          .catch(() => null);
        const localteamId = match.localteam_id.toString();
        const visitorteamId = match.visitorteam_id.toString();
        if (!exists) {
          const cricketMatch = new CricketMatch(
            matchId,
            localteamId,
            visitorteamId,
            match.starting_at,
          );
          await this.cricketMatchService.create(cricketMatch);
          this.logger.log(
            `🟢 Partido insertado de: ${match.localteam_id} vrs ${match.visitorteam_id}`,
          );
        } else {
          this.logger.debug(`🔁 Ya existe: ${match.id}`);
        }
      }
    } catch (error) {
      this.logger.error(
        '❌ Error al obtener partidos IPL desde Sportmonks:',
        error,
      );
    }
  }

  @Cron('0 0 3 20 2 *') // 3:00 AM, 20 de febrero, todos los años
  async deleteMatchs() {
    try {
      const allMatchs = await this.cricketMatchService.findAll();

      for (const match of allMatchs) {
        await this.cricketMatchService.delete(match.id);
        this.logger.log(`🗑️ partido eliminado: ${match.matchDate}`);
      }

      this.logger.log(
        `✅ Todos los partidos han sido eliminados (${allMatchs.length})`,
      );
    } catch (error) {
      this.logger.error('❌ Error al eliminar los partidos:', error);
    }
  }
}
