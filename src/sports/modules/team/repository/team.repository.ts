import { Injectable, ConflictException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { CricketTeam } from "src/schema";

@Injectable()
export class CricketTeamRepository {
  constructor(
    @InjectRepository(CricketTeam)
    private readonly repo: Repository<CricketTeam>,
  ) {}

  async create(team: CricketTeam) {
    const existing = await this.repo.findOne({ where: { id: team.id } });
    if (existing) {
      throw new ConflictException('The team ID already exists');
    }

    return this.repo.save(team);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
