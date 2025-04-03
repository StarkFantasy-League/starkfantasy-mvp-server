import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { CricketPlayer } from "src/schema";

@Injectable()
export class CricketPlayerRepository{
     constructor(
        @InjectRepository(CricketPlayer)
        private readonly repo: Repository<CricketPlayer>,
     ) {}

     create(player: CricketPlayer){
        return this.repo.insert(player);
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