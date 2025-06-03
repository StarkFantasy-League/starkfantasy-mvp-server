import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoccerPlayer, SoccerTeam } from 'src/schema';
import { SoccerPlayerRepository } from './repository/soccer-player.repository';
import { SoccerPlayerService } from './service/soccer-player.service';
import { SoccerPlayerController } from './controllers/soccer-player.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SoccerPlayer, SoccerTeam])],
  controllers: [SoccerPlayerController],
  providers: [SoccerPlayerRepository, SoccerPlayerService],
  exports: [SoccerPlayerService],
})
export class SoccerPlayerModule {}
