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
  PlayerRadarStats,
  PlayerTableViewStats,
  PaginatedPlayerStats,
  HomeData,
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

  @Get('home-data')
  async getHomeData(): Promise<HomeData> {
    console.log('Controller: Received request for /cricket-player/home-data');
    return this.playerService.getHomeData();
  }

  @Get('stats')
  getPlayerStats(
    @Query('position') position?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginatedPlayerStats> {
    return this.playerService.getPlayerStats(
      position,
      Number(page),
      Number(limit),
    );
  }

  @Get('radar/:id')
  getPlayerRadarStats(@Param('id') id: string): Promise<PlayerRadarStats> {
    return this.playerService.getPlayerRadarStats(id);
  }

  @Get('table-stats')
  getPlayerTableStats(): Promise<PlayerTableViewStats[]> {
    console.log('Controller: Received request for /cricket-player/home-data');
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
