import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CricketTeamService } from '../service/team.service';
import { CricketTeam } from "src/schema";


@Controller('cricket-team')
export class CricketTeamController{
    constructor (private readonly teamService: CricketTeamService){}

    @Post()
    async create (@Body() teamData: CricketTeam): Promise<CricketTeam> {
        return this.teamService.create(teamData);
    }

    @Get()
    async findAll(): Promise<CricketTeam[]> {
        return this.teamService.findAll();
    }

    @Get (':id')
    async findOne(@Param ('id') id:string): Promise<CricketTeam | null> {
        return this.teamService.findOne(id);
    }

    @Put (':id')
    async update (@Param('id') id: string, @Body() teamData: Partial<CricketTeam>): Promise<CricketTeam> {
        return this.teamService.update(id, teamData);
    }

    @Delete (':id')
    async delete (@Param('id') id:string): Promise<void> {
        return this.teamService.delete(id);
    }
}

