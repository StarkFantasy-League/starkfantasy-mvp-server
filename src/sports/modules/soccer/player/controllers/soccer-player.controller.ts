import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { SoccerPlayerService } from '../service/soccer-player.service';
import { SoccerPlayer } from 'src/schema';

@Controller('soccer-player')
export class SoccerPlayerController {
  constructor(private readonly playerService: SoccerPlayerService) {}

  @Post()
  create(@Body() dto: SoccerPlayer): Promise<SoccerPlayer> {
    return this.playerService.create(dto);
  }

  @Get()
  findAll(): Promise<SoccerPlayer[]> {
    return this.playerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SoccerPlayer> {
    return this.playerService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() playerData: Partial<SoccerPlayer>): Promise<SoccerPlayer> {
    return this.playerService.update(id, playerData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.playerService.delete(id);
  }
}
