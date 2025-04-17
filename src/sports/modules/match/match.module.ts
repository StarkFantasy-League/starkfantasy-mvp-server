import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CricketMatch } from "src/schema";
import { CricketMatchRepository } from './repository/match.repository';
import { CricketMatchService } from './service/match.service';
import { CrickerMatchController } from './controllers/match.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CricketMatch])],
  controllers: [CrickerMatchController],
  providers: [CricketMatchRepository, CricketMatchService],
    exports: [CricketMatchService], 
})
export class CricketMatchModule {}
