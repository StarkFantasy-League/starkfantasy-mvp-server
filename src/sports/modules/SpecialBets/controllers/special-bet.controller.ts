import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SpecialBetService } from '../service/special-bet.service';
import { SpecialBet } from 'src/schema';

@Controller('special-bet')
export class SpecialBetController {
  constructor(private readonly poolService: SpecialBetService) {}

  @Post()
  create(@Body() dto: SpecialBet) {
    return this.poolService.create(dto);
  }

  @Get()
  findAll() {
    return this.poolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poolService.findOne(id);
  }
  @Get('player/:playerId')
  findPlayer(@Param('playerId') id: string) {
    return this.poolService.findByPlayerId(id);
  }

  @Get('bet/:betId')
  findBet(@Param('betId') id: string) {
    return this.poolService.findByBet(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.poolService.delete(id);
  }
}
