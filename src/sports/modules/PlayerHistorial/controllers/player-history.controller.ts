import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CricketPlayerHistorial } from 'src/schema';
import { PlayerServiceHistory } from '../service/player-history.service';

@Controller('player-history')
export class PlayerHistoryController {
  constructor(private readonly playerHistoryService: PlayerServiceHistory) {}

  @Post()
  create(@Body() dto: CricketPlayerHistorial) {
    return this.playerHistoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.playerHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerHistoryService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.playerHistoryService.delete(id);
  }

  @Patch('add-pts/:playerId')
  addPts(@Param('playerId') playerId: string, @Body('pts') pts: number) {
    return this.playerHistoryService.addPts(playerId, pts);
  }


  @Patch('add-runs/:playerId')
  addRuns(@Param('playerId') playerId: string, @Body('runs') runs: number) {
    return this.playerHistoryService.addRuns(playerId, runs);
  }
  @Patch('add-wickets/:playerId')
  addWickets(@Param('playerId') playerId: string, @Body('wickets') wickets: number) {
    return this.playerHistoryService.addWickets(playerId, wickets);
  }
}
