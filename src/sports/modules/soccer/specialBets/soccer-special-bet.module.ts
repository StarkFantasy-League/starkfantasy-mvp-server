import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoccerSpecialBetController } from './controllers/soccer-special-bet.controller';
import { SoccerSpecialBetRepository } from './repository/soccer-special-bet.repository';
import { SoccerSpecialBetService } from './service/soccer-special-bet.service';
import { SoccerSpecialBet, BetsOptions, SoccerPlayer } from 'src/schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([SoccerSpecialBet, BetsOptions, SoccerPlayer]),
  ],
  controllers: [SoccerSpecialBetController],
  providers: [SoccerSpecialBetRepository, SoccerSpecialBetService],
  exports: [SoccerSpecialBetService],
})
export class SoccerSpecialBetModule {}
