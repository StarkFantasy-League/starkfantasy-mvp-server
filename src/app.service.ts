import { Injectable } from '@nestjs/common';
import { TaskMatchService } from './sports/modules/job/match-cron.service';
import { TaskPlayerService } from './sports/modules/job/player-cron.service';
import { TaskPlayerPerformance } from './sports/modules/job/player-performance-cron.service';
import { TaskTeamService } from './sports/modules/job/team-cron.service';

@Injectable()
export class AppService {

  constructor(
    private readonly matchCronService: TaskMatchService,
    private readonly playerCronService: TaskPlayerService,
    private readonly performanceService: TaskPlayerPerformance,
    private readonly teamCronService: TaskTeamService
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  async load() {
    await this.teamCronService.updateSeasonTeams();
    await this.playerCronService.UpdatePlayersBySeason();
    await this.matchCronService.updateMatchsForSeason();
    await this.performanceService.getPlayerPerformancesForWeek();
  }
}
