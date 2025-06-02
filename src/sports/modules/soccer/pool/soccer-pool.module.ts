import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoccerPoolRepository } from './repository/soccer-pool.repository';
import { SoccerPoolService } from './service/soccer-pool.service';
import { SoccerPoolController } from './controllers/soccer-pool.controller';
import { SoccerPool } from 'src/schema';

@Module({
  imports: [TypeOrmModule.forFeature([SoccerPool])],
  controllers: [SoccerPoolController],
  providers: [SoccerPoolRepository, SoccerPoolService],
})
export class SoccerPoolModule {}
