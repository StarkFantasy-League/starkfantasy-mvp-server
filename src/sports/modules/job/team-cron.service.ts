import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SportmonksService } from '../API/sportmonks.service'; 
import { CricketTeamService } from '../team/service/team.service';
import { CricketTeam } from 'src/schema';

@Injectable()
export class TaskTeamService {
  private readonly logger = new Logger(TaskTeamService.name);

  constructor(    private readonly sportmonksService: SportmonksService,
    private readonly cricketTeamService: CricketTeamService) {}


    
  @Cron('0 0 3 1 3 *') // 3:00 AM, 1 de marzo, cada año (Antes de comenzar la temporada)
  async updateSeasonTeams() {
    try {
      const teams = await this.sportmonksService.getIPLTEams();
      this.logger.log(`✅ Equipos IPL obtenidos (${teams.length}):`);
      
      for (const team of teams) {
      
        const teamId = team.id.toString();
        const exists = await this.cricketTeamService.findOne(teamId).catch(() => null);
      
        if (!exists) {
          const cricketTeam = new CricketTeam(teamId, team.name,team.image_path); 
          await this.cricketTeamService.create(cricketTeam);
          this.logger.log(`🟢 Equipo insertado: ${team.name}`);
        } else {
          this.logger.debug(`🔁 Ya existe: ${team.name}`);
        }
      }
      
        
    } catch (error) {
      this.logger.error('❌ Error al obtener equipos IPL desde Sportmonks:', error);
    }
  }
  
  @Cron('0 0 3 25 2 *') // 3:00 AM, 25 de febrero, todos los años
  async deleteAllCricketTeams() {
  
    try {
      const allTeams = await this.cricketTeamService.findAll(); 
  
      for (const team of allTeams) {
        await this.cricketTeamService.delete(team.id);
        this.logger.log(`🗑️ Equipo eliminado: ${team.name}`);
      }
  
      this.logger.log(`✅ Todos los equipos han sido eliminados (${allTeams.length})`);
    } catch (error) {
      this.logger.error('❌ Error al eliminar los equipos:', error);
    }
  }


}
