import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { CricketMatch } from "src/schema";

@Injectable()
export class CricketMatchRepository{
     constructor(
        @InjectRepository(CricketMatch)
        private readonly repo: Repository<CricketMatch>,
     ) {}

     create(match: CricketMatch){
        return this.repo.insert(match);
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