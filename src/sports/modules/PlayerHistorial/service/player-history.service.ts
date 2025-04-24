import { Injectable, NotFoundException } from '@nestjs/common';
import { PlayerHistoryRepository } from '../repository/player-history.repository'; 
import { CricketPlayerHistorial } from 'src/schema';

@Injectable()
export class PlayerServiceHistory {
  constructor(private readonly repo: PlayerHistoryRepository) {}

  async create(entity: CricketPlayerHistorial) {
    const historial = new CricketPlayerHistorial(
      entity.playerId,
      entity.runs,
      entity.catches,
      entity.wickets,
      entity.points
    );
    try {
      return await this.repo.create(historial);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.repo.findAll();
  }

  async findOne(id: string) {
    const historial = await this.repo.findOne(id);
    if (!historial) {
      throw new NotFoundException('player history not found');
    }
    return historial;
  }

  async delete(id: string): Promise<void> {
    const historial = await this.repo.findOne(id);
    if (!historial) {
      throw new NotFoundException('player history not found');
    }
    await this.repo.delete(id);
  }

  // 🟢 Añadir puntos (pts) por playerId
  async addPts(playerId: string, pts: number) {
    const updated = await this.repo.addPtsByPlayerId(playerId, pts);
    if (!updated) {
      throw new NotFoundException('player history not found');
    }
    return updated;
  }

  // 🟢 Añadir runs por playerId
  async addRuns(playerId: string, runs: number) {
    const updated = await this.repo.addRunsByPlayerId(playerId, runs);
    if (!updated) {
      throw new NotFoundException('player history not found');
    }
    return updated;
  }

  // 🟢 Añadir wickets por playerId
  async addWickets(playerId: string, wickets: number) {
    const updated = await this.repo.addWicketsByPlayerId(playerId, wickets);
    if (!updated) {
      throw new NotFoundException('player history not found');
    }
    return updated;
  }
}
