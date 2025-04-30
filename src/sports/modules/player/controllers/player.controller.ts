import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CricketPlayerService } from '../service/player.service';
import { CricketPlayer } from 'src/schema';
import {
  PlayerStats,
  PlayerRadarStats,
  PlayerTableViewStats,
} from 'src/types/player.types';

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
  getPlayerStats(@Query('position') position?: string): Promise<PlayerStats[]> {
    return this.playerService.getPlayerStats(position);
  }

  @Get('radar/:id')
  getPlayerRadarStats(@Param('id') id: string): Promise<PlayerRadarStats> {
    return this.playerService.getPlayerRadarStats(id);
  }
  @Get('table-stats')
  getPlayerTableStats(): Promise<PlayerTableViewStats[]> {
    return this.playerService.getPlayerTableStats();
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
