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
    return this.repo.find({ relations: ['player'] });
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

  async addGoalsByPlayerId(playerId: string, goalsToAdd: number) {
    const record = await this.repo.findOne({ where: { playerId } });
    if (!record) return null;
    record.goals += goalsToAdd;
    return this.repo.save(record);
  }

  async addAssistsByPlayerId(playerId: string, assistsToAdd: number) {
    const record = await this.repo.findOne({ where: { playerId } });
    if (!record) return null;
    record.assists += assistsToAdd;
    return this.repo.save(record);
  }

  async addCleanSheetByPlayerId(playerId: string, cleanSheetToAdd: number) {
    const record = await this.repo.findOne({ where: { playerId } });
    if (!record) return null;
    record.clean_sheet += cleanSheetToAdd;
    return this.repo.save(record);
  }

  async addYellowCardByPlayerId(playerId: string, yellowCardToAdd: number) {
    const record = await this.repo.findOne({ where: { playerId } });
    if (!record) return null;
    record.yellow_card += yellowCardToAdd;
    return this.repo.save(record);
  }

  async addRedCardByPlayerId(playerId: string, redCardToAdd: number) {
    const record = await this.repo.findOne({ where: { playerId } });
    if (!record) return null;
    record.red_card += redCardToAdd;
    return this.repo.save(record);
  }
}
