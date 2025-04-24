import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerHistoryRepository } from './repository/player-history.repository';
import { PlayerServiceHistory } from './service/player-history.service';
import { PlayerHistoryController } from './controllers/player-history.controller';
import { CricketPlayerHistorial } from 'src/schema';

@Module({
  imports: [TypeOrmModule.forFeature([CricketPlayerHistorial])],
  controllers: [PlayerHistoryController],
  providers: [PlayerHistoryRepository, PlayerServiceHistory],
        exports: [PlayerServiceHistory], 
})
export class PlayerHistoryModule {}
