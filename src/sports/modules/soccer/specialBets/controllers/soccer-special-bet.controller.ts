import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SoccerSpecialBetService } from '../service/soccer-special-bet.service';
import { SoccerSpecialBet } from 'src/schema';

@Controller('soccer-special-bet')
export class SoccerSpecialBetController {
  constructor(
    private readonly soccerSpecialBetService: SoccerSpecialBetService,
  ) {}

  @Post()
  create(@Body() dto: SoccerSpecialBet) {
    return this.soccerSpecialBetService.create(dto);
  }

  @Get()
  findAll() {
    return this.soccerSpecialBetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.soccerSpecialBetService.findOne(id);
  }

  @Get('player/:playerId')
  findByPlayerId(@Param('playerId') playerId: string) {
    return this.soccerSpecialBetService.findByPlayerId(playerId);
  }

  @Get('bet/:specialBetId') // Route for finding by BetsOptions ID
  findBySpecialBetId(@Param('specialBetId') specialBetId: string) {
    return this.soccerSpecialBetService.findBySpecialBetId(specialBetId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.soccerSpecialBetService.delete(id);
  }
}
