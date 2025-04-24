import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { SpecialBet } from "src/schema";

@Injectable()
export class SpecialBetRepository{
     constructor(
        @InjectRepository(SpecialBet)
        private readonly repo: Repository<SpecialBet>,
     ) {}

     create(pool: SpecialBet){
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

     async findByPlayerId(playerId: string): Promise<SpecialBet[]> {
      return this.repo.find({
        where: { playerId: playerId },
      });

      
    }

    async findByBet(betId: string): Promise<SpecialBet[]> {
      return this.repo.find({
        where: { specialBetId: betId },
      });
    
}
}