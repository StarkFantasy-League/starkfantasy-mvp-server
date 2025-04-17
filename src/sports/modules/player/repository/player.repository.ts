import { Injectable, ConflictException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { CricketPlayer } from "src/schema";

@Injectable()
export class CricketPlayerRepository{
     constructor(
        @InjectRepository(CricketPlayer)
        private readonly repo: Repository<CricketPlayer>,
     ) {}

  async create(player: CricketPlayer) {
    const existing = await this.repo.findOne({ where: { id: player.id } });
    if (existing) {
      throw new ConflictException('The player ID already exists');
    }

    return this.repo.save(player);
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