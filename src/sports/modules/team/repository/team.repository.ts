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

  async create(teamData: CricketTeam): Promise<CricketTeam> {
    const existing = await this.repo.findOne({ where: { id: teamData.id } });
    if (existing) {
      throw new ConflictException('The team ID already exists');
    }

    return this.repo.save(teamData);
  }

  async findAll(): Promise<CricketTeam[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<CricketTeam | null> {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, teamData: Partial<CricketTeam>): Promise<CricketTeam> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      throw new ConflictException('The team ID does not exist');
    }

    Object.assign(existing, teamData);
    return this.repo.save(existing);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
