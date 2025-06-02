import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SoccerPool } from 'src/schema';

@Injectable()
export class SoccerPoolRepository {
  constructor(
    @InjectRepository(SoccerPool)
    private readonly repo: Repository<SoccerPool>,
  ) {}

  create(pool: SoccerPool) {
    return this.repo.insert(pool);
  }

  findAll() {
    return this.repo.find();
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}
