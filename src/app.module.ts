import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskTeamService } from './sports/modules/job/team-cron.service';
import { CricketMatchModule } from './sports/modules/match/match.module';
import { getDatabaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CricketTeamModule } from './sports/modules/team/team.module';
import { CricketPlayerModule } from './sports/modules/player/player.module';
import { PlayerPerformanceModule } from './sports/modules/playerPerformance/player-performance.module';
import { PoolModule } from './sports/modules/pools/pools.module';
import { SportmonksModule } from './sports/modules/API/api.module';
import { TaskPlayerService } from './sports/modules/job/player-cron.service';
import { TaskMatchService } from './sports/modules/job/match-cron.service';
import { TaskPlayerPerformance } from './sports/modules/job/player-performance-cron.service';
import { SpecialBetModule } from './sports/modules/SpecialBets/special-bets.module';
import { PlayerHistoryModule } from './sports/modules/PlayerHistorial/player-history.module';
import { TaskPlayerHistory } from './sports/modules/job/player-history-cron.service';
import { SoccerPoolModule } from './sports/modules/soccer/pool/soccer-pool.module';
import { SoccerSpecialBetModule } from './sports/modules/soccer/specialBets/soccer-special-bet.module';
import { SoccerPlayerModule } from './sports/modules/soccer/player/soccer-player.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    CricketMatchModule,
    CricketTeamModule,
    CricketPlayerModule,
    PlayerPerformanceModule,    PoolModule,
    SportmonksModule,
    SpecialBetModule,
    PlayerHistoryModule,
    SoccerPoolModule,
    SoccerSpecialBetModule,
    SoccerPlayerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TaskTeamService,
    TaskPlayerService,
    TaskMatchService,
    TaskPlayerPerformance,
    TaskPlayerHistory,
  ],
})
export class AppModule {}
