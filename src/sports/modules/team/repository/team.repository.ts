import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { CricketTeam } from "src/schema";

@Injectable()
export class CricketTeamRepository{
     constructor(
        @InjectRepository(CricketTeam)
        private readonly repo: Repository<CricketTeam>,
     ) {}

     create(team: CricketTeam){
        return this.repo.insert(team);
     }

     findAll (){
        return this.repo.find();
     }
     delete (id: string){
      return this.repo.delete(id);
     }
     findOne(id: string){
        return this.repo.findOne({where: {id}});
     }
}