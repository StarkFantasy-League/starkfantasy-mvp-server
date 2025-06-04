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

  @Patch('add-goals/:playerId')
  addGoals(@Param('playerId') playerId: string, @Body('goals') goals: number) {
    return this.playerHistoryService.addGoals(playerId, goals);
  }

  @Patch('add-assists/:playerId')
  addAssists(@Param('playerId') playerId: string, @Body('assists') assists: number) {
    return this.playerHistoryService.addAssists(playerId, assists);
  }

  @Patch('add-clean-sheet/:playerId')
  addCleanSheet(@Param('playerId') playerId: string, @Body('clean_sheet') cleanSheet: number) {
    return this.playerHistoryService.addCleanSheet(playerId, cleanSheet);
  }

  @Patch('add-yellow-card/:playerId')
  addYellowCard(@Param('playerId') playerId: string, @Body('yellow_card') yellowCard: number) {
    return this.playerHistoryService.addYellowCard(playerId, yellowCard);
  }

  @Patch('add-red-card/:playerId')
  addRedCard(@Param('playerId') playerId: string, @Body('red_card') redCard: number) {
    return this.playerHistoryService.addRedCard(playerId, redCard);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<CricketPlayerHistorial>) {
    return this.playerHistoryService.update(id, data);
  }
}
