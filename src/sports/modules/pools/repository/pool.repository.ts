import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { CricketPool } from "src/schema";

@Injectable()
export class CricketPoolRepository {
   constructor(
      @InjectRepository(CricketPool)
      private readonly repo: Repository<CricketPool>,
   ) { }

   async create(pool: CricketPool) {
      // validate matched Id is not registered already
      if (!pool.cricketMatchId) {
         throw new Error('Cricket Match ID is required');
      }
      if (!pool.id) {
         throw new Error('Pool ID is required');
      }
      // check if the pool already exists
      let existing = await this.repo.findOne({ where: { cricketMatchId: pool.cricketMatchId } });
      if (existing) {
         throw new Error('Pool for this match already exists');
      }
      return this.repo.insert(pool);
   }

   findAll() {
      return this.repo.find({
         relations: ['match'], // This will join the CricketMatch entity
      });
   }
   delete(id: string) {
      return this.repo.delete(id);
   }
   findOne(id: string) {
      return this.repo.findOne({ where: { id } });
   }
   update(pool: CricketPool) {
      return this.repo.save(pool);
   }
}