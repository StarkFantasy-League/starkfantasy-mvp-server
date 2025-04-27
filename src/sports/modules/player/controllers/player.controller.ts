import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CricketPlayerService } from '../service/player.service';
import { CricketPlayer } from 'src/schema';
import { PlayerStats, PlayerRadarStats } from 'src/types/player.types';

@Controller('cricket-player')
export class CricketPlayerController {
  constructor(private readonly playerService: CricketPlayerService) {}

  @Post()
  create(@Body() dto: CricketPlayer): Promise<CricketPlayer> {
    return this.playerService.create(dto);
  }

  @Get()
  findAll(): Promise<CricketPlayer[]> {
    return this.playerService.findAll();
  }

  @Get('stats')
  getPlayerStats(): Promise<PlayerStats[]> {
    return this.playerService.getPlayerStats();
  }

  @Get('radar/:id')
  getPlayerRadarStats(@Param('id') id: string): Promise<PlayerRadarStats> {
    return this.playerService.getPlayerRadarStats(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CricketPlayer> {
    return this.playerService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.playerService.delete(id);
  }
}
