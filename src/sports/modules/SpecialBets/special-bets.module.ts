import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialBetController } from './controllers/special-bet.controller';
import { SpecialBetRepository } from './repository/special-bet.repository';
import { SpecialBetService } from './service/special-bet.service';
import { SpecialBet } from 'src/schema';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialBet])],
  controllers: [SpecialBetController],
  providers: [SpecialBetRepository, SpecialBetService],
  exports: [SpecialBetService],
})
export class SpecialBetModule {}
