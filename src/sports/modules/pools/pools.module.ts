import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CricketPoolRepository } from './repository/pool.repository';
import { CricketPoolService } from './service/pool.service';
import { CricketPoolController } from './controllers/pool.controller';
import { CricketPool } from 'src/schema';

@Module({
  imports: [TypeOrmModule.forFeature([CricketPool])],
  controllers: [CricketPoolController],
  providers: [CricketPoolRepository, CricketPoolService],
})
export class PoolModule {}
