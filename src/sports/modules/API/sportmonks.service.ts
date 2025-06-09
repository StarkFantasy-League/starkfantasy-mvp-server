import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CricketTeamService } from '../team/service/team.service';

@Injectable()
export class SportmonksService {
  private readonly baseUrl = 'https://cricket.sportmonks.com/api/v2.0';
  private readonly apiToken = 'M58LT1HVTbcX4Oq2ONusQIdLLVPkQLRtU7AMQWHcKY4XDMvUPP16NseXnF5P';

  constructor(
    private readonly httpService: HttpService,
    private readonly cricketTeamService: CricketTeamService
  ) { }

  // Obtener el ID de la temporada, para no tener que cambiarlo manualmente cada vez que se reinicie la liga
  private async getLatestIPLSeasonId(): Promise<number> {
    const url = `${this.baseUrl}/seasons?api_token=${this.apiToken}&filter[league_id]=1&sort=-id`;
    const response$ = this.httpService.get(url);
    const response = await lastValueFrom(response$);
    return response.data.data[0].id;
  }
  //Obtener los equipos de la liga ACTUAL
  async getIPLTEams(): Promise<any> {
    const seasonId = await this.getLatestIPLSeasonId();
    const url = `${this.baseUrl}/seasons/${seasonId}?api_token=${this.apiToken}&include=teams`;
    const response$ = this.httpService.get(url);
    const response = await lastValueFrom(response$);
    return response.data.data.teams;

  }

  // Obtener la posicion por el ID
  private async getPosition(id: number): Promise<any> {
    const url = `${this.baseUrl}/positions/${id}?api_token=${this.apiToken}`;
    const response$ = this.httpService.get(url);
    const response = await lastValueFrom(response$);
    return response.data;
  }


  //Obtener los jugadores por los equipos
  async getAllPlayersFromStoredTeams(): Promise<any[]> {
    const teams = await this.cricketTeamService.findAll();
    const allPlayers: any[] = [];
    const targetSeasonId = await this.getLatestIPLSeasonId();

    for (const team of teams) {
      const url = `${this.baseUrl}/teams/${team.id}?api_token=${this.apiToken}&include=squad`;
      const response$ = this.httpService.get(url);

      try {
        const response = await lastValueFrom(response$);
        const squad = response.data.data.squad || [];

        for (const player of squad) {
          if (player.squad?.season_id === targetSeasonId) {
            const positionId = player.position?.id;

            let positionName = 'Unknown';
            if (positionId) {
              try {
                const positionData = await this.getPosition(positionId);
                positionName = positionData.data?.name || 'Unknown';
              } catch (err) {
                console.warn(`⚠️ No se pudo obtener la posición del jugador ${player.id}:`, err.message);
              }
            }

            allPlayers.push({
              ...player,
              teamId: team.id,
              positionName: positionName,
            });
          }
        }

      } catch (error) {
        console.error(`❌ Error al obtener jugadores del equipo ${team.name} (${team.id}):`, error.message);
      }
    }

    return allPlayers;
  }

  //Obtener los partidos 
  async getSeasonMatches(): Promise<any> {
    const seasonId = await this.getLatestIPLSeasonId();
    const url = `${this.baseUrl}/fixtures?api_token=${this.apiToken}&filter[season_id]=${seasonId}`;
    const response$ = this.httpService.get(url);
    const response = await lastValueFrom(response$);
    return response.data.data;

  }

  //Obtener las actuaciones por fecha
  async getPerformancesByMatch(id: number): Promise<any> {
    const seasonId = await this.getLatestIPLSeasonId();
    const url = `${this.baseUrl}/fixtures/${id}?api_token=${this.apiToken}&filter[season_id]=${seasonId}&include=batting,bowling`;
    const response$ = this.httpService.get(url);
    const response = await lastValueFrom(response$);
    return response.data.data;
  }

}
