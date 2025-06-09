import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SportmonksService } from '../API/sportmonks.service';
import { CricketPlayerService } from '../player/service/player.service';
import { CricketPlayer } from 'src/schema';

@Injectable()
export class TaskPlayerService {
  private readonly logger = new Logger(TaskPlayerService.name);

  constructor(
    private readonly sportmonksService: SportmonksService,
    private readonly cricketPlayerService: CricketPlayerService,
  ) {}

  @Cron('0 0 3 2 3 *') // 3:00 AM, 2 de marzo, cada año (Antes de comenzar la temporada)
  async UpdatePlayersBySeason() {
    try {
      const players =
        await this.sportmonksService.getAllPlayersFromStoredTeams();
      this.logger.log(`✅ Jugadores IPL obtenidos (${players.length}):`);

      for (const player of players) {
        const playerId = player.id.toString();
        const exists = await this.cricketPlayerService
          .findOne(playerId)
          .catch(() => null);
        const teamId = player.teamId.toString();
        if (!exists) {
          const cricketPlayer = new CricketPlayer(
            playerId,
            teamId,
            player.firstname,
            player.lastname,
            player.positionName,
            player.image_path,
          );
          await this.cricketPlayerService.create(cricketPlayer);
          this.logger.log(`🟢 jugador insertado: ${player.firstname}`);
        } else {
          this.logger.debug(`🔁 Ya existe: ${player.name}`);
        }
      }
    } catch (error) {
      this.logger.error(
        '❌ Error al obtener jugadores IPL desde Sportmonks:',
        error,
      );
    }
  }

  @Cron('0 0 3 1 2 *') // 3:00 AM, 1 de febrero, todos los años
  async deletePlayersForNewSeason() {
    try {
      const allPlayers = await this.cricketPlayerService.findAll();

      for (const player of allPlayers) {
        await this.cricketPlayerService.delete(player.id);
        this.logger.log(`🗑️ jugador eliminado: ${player.firstName}`);
      }

      this.logger.log(
        `✅ Todos los jugadores han sido eliminados (${allPlayers.length})`,
      );
    } catch (error) {
      this.logger.error('❌ Error al eliminar los jugadores:', error);
    }
  }
}
