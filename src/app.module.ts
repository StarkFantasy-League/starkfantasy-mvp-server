import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskTeamService } from './sports/modules/job/team-cron.service';
import { CricketMatchModule } from './sports/modules/match/match.module';
import { databaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CricketTeamModule } from './sports/modules/team/team.module';
import { CricketPlayerModule } from './sports/modules/player/player.module';
import { PlayerPerformanceModule } from './sports/modules/playerPerformance/player-performance.module';
import { PoolModule } from './sports/modules/pools/pools.module';
import { SportmonksModule } from './sports/modules/API/api.module';
import { TaskPlayerService } from './sports/modules/job/player-cron.service';
import { TaskMatchService } from './sports/modules/job/match-cron.service';
import { TaskPlayerPerformance } from './sports/modules/job/player-performance-cron.service';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig), 
    CricketMatchModule,
    CricketTeamModule,
    CricketPlayerModule,
    PlayerPerformanceModule,
    PoolModule,
    SportmonksModule
  ],
  controllers: [AppController],
  providers: [AppService, TaskTeamService, TaskPlayerService, TaskMatchService, TaskPlayerPerformance],
})
export class AppModule {}
