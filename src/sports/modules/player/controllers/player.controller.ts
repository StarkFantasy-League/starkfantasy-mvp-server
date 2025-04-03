import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CricketPlayerService } from '../service/player.service';
import { CricketPlayer } from "src/schema";


@Controller('cricket-player')
export class CricketPlayerController{
    constructor (private readonly playerService: CricketPlayerService){}

@Post()
create (@Body() dto: CricketPlayer){
    return this.playerService.create(dto);
}

@Get()
findAll(){
    return this.playerService.findAll();
}

@Get (':id')
findOne(@Param ('id') id:string){
    return this.playerService.findOne(id);
}

@Delete (':id')
delete (@Param('id') id:string){
return this.playerService.delete(id);
}
}

