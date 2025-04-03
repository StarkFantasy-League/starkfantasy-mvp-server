import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerPerformance } from "src/schema";

@Injectable()
export class PlayerPerformanceRepository{
     constructor(
        @InjectRepository(PlayerPerformance)
        private readonly repo: Repository<PlayerPerformance>,
     ) {}

     create(pool: PlayerPerformance){
        return this.repo.insert(pool);
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