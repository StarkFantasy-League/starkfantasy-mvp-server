import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PlayerPerformanceService } from '../service/player-performance.service'; 
import { PlayerPerformance } from "src/schema";


@Controller('player-performance')
export class PlayerPerformanceController{
    constructor (private readonly poolService: PlayerPerformanceService){}

@Post()
create (@Body() dto: PlayerPerformance){
    return this.poolService.create(dto);
}

@Get()
findAll(){
    return this.poolService.findAll();
}

@Get (':id')
findOne(@Param ('id') id:string){
    return this.poolService.findOne(id);
}
@Get ('player/:playerId')
findPlayer(@Param ('playerId') id:string){
    return this.poolService.findByPlayerId(id);
}

@Delete (':id')
delete (@Param('id') id:string){
return this.poolService.delete(id);
}
}

