import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerPerformanceController } from './controllers/player-performance.controller';
import { PlayerPerformanceRepository } from './repository/player-performance.repository';
import { PlayerPerformanceService } from './service/player-performance.service';
import { PlayerPerformance } from 'src/schema';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerPerformance])],
  controllers: [PlayerPerformanceController],
  providers: [PlayerPerformanceRepository, PlayerPerformanceService],
      exports: [PlayerPerformanceService], 
})
export class PlayerPerformanceModule {}
