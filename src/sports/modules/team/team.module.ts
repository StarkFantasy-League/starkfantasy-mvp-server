import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CricketTeam } from "src/schema";
import { CricketTeamRepository } from './repository/team.repository';
import { CricketTeamService } from './service/team.service';
import { CricketTeamController } from './controllers/team.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CricketTeam])],
  controllers: [CricketTeamController],
  providers: [CricketTeamRepository, CricketTeamService],
})
export class CricketTeamModule {}
