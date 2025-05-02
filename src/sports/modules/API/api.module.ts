import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SportmonksService } from './sportmonks.service';
import { CricketTeamModule } from '../team/team.module';

@Module({
  imports: [HttpModule, CricketTeamModule],
  providers: [SportmonksService],
  exports: [SportmonksService],
})
export class SportmonksModule {}
