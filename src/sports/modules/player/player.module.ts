import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CricketPlayer } from "src/schema";
import { CricketPlayerController } from './controllers/player.controller';
import { CricketPlayerRepository } from './repository/player.repository';
import { CricketPlayerService } from './service/player.service';

@Module({
  imports: [TypeOrmModule.forFeature([CricketPlayer])],
  controllers: [CricketPlayerController],
  providers: [CricketPlayerRepository, CricketPlayerService],
  exports: [CricketPlayerService], 
})
export class CricketPlayerModule {}
