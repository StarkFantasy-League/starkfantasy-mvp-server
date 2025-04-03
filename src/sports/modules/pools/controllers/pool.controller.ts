import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CricketPoolService } from '../service/pool.service'; 
import { CricketPool } from "src/schema";


@Controller('cricket-pool')
export class CricketPoolController{
    constructor (private readonly poolService: CricketPoolService){}

@Post()
create (@Body() dto: CricketPool){
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

@Delete (':id')
delete (@Param('id') id:string){
return this.poolService.delete(id);
}
}

