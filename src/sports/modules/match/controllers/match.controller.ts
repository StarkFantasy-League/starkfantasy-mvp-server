import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CricketMatchService } from '../service/match.service';
import { CricketMatch } from "src/schema";


@Controller('cricket-match')
export class CrickerMatchController{
    constructor (private readonly matchService: CricketMatchService){}

@Post()
create (@Body() dto: CricketMatch){
    return this.matchService.create(dto);
}

@Get()
findAll(){
    return this.matchService.findAll();
}

@Get (':id')
findOne(@Param ('id') id:string){
    return this.matchService.findOne(id);
}

@Delete (':id')
delete (@Param('id') id:string){
return this.matchService.delete(id);
}
}

