import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CricketTeamService } from '../service/team.service';
import { CricketTeam } from "src/schema";


@Controller('cricket-team')
export class CricketTeamController{
    constructor (private readonly teamService: CricketTeamService){}

@Post()
create (@Body() dto: CricketTeam){
    return this.teamService.create(dto);
}

@Get()
findAll(){
    return this.teamService.findAll();
}

@Get (':id')
findOne(@Param ('id') id:string){
    return this.teamService.findOne(id);
}

@Delete (':id')
delete (@Param('id') id:string){
return this.teamService.delete(id);
}
}

