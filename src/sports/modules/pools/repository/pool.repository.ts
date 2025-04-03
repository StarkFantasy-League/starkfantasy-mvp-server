import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { CricketPool } from "src/schema";

@Injectable()
export class CricketPoolRepository{
     constructor(
        @InjectRepository(CricketPool)
        private readonly repo: Repository<CricketPool>,
     ) {}

     create(pool: CricketPool){
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