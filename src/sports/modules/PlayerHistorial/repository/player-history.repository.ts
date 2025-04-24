import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { CricketPlayerHistorial } from "src/schema";

@Injectable()
export class PlayerHistoryRepository {
  constructor(
    @InjectRepository(CricketPlayerHistorial)
    private readonly repo: Repository<CricketPlayerHistorial>,
  ) {}

  create(historial: CricketPlayerHistorial) {
    return this.repo.insert(historial);
  }

  findAll() {
    return this.repo.find({    relations: ['player']});

  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  update(id: string, data: Partial<CricketPlayerHistorial>) {
    return this.repo.update(id, data);
  }

  async addPtsByPlayerId(playerId: string, pointsToAdd: number) {
    const record = await this.repo.findOne({ where: { playerId } });
    if (!record) return null;
    record.points += pointsToAdd;
    return this.repo.save(record);
  }

  async addRunsByPlayerId(playerId: string, runsToAdd: number) {
    const record = await this.repo.findOne({ where: { playerId } });
    if (!record) return null;
    record.runs += runsToAdd;
    return this.repo.save(record);
  }

  async addWicketsByPlayerId(playerId: string, wicketsToAdd: number) {
    const record = await this.repo.findOne({ where: { playerId } });
    if (!record) return null;
    record.wickets += wicketsToAdd;
    return this.repo.save(record);
  }
}
