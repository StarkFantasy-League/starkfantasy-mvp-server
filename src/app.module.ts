import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './sports/modules/job/cron.service';
import { CricketMatchModule } from './sports/modules/match/match.module';
import { databaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CricketTeamModule } from './sports/modules/team/team.module';
import { CricketPlayerModule } from './sports/modules/player/player.module';
import { PlayerPerformanceModule } from './sports/modules/playerPerformance/player-performance.module';
import { PoolModule } from './sports/modules/pools/pools.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig), 
    CricketMatchModule,
    CricketTeamModule,
    CricketPlayerModule,
    PlayerPerformanceModule,
    PoolModule
  ],
  controllers: [AppController],
  providers: [AppService, TaskService],
})
export class AppModule {}
