import { Injectable, NotFoundException } from '@nestjs/common';
import { PlayerHistoryRepository } from '../repository/player-history.repository'; 
import { CricketPlayerHistorial } from 'src/schema';

@Injectable()
export class PlayerServiceHistory {
  constructor(private readonly repo: PlayerHistoryRepository) {}

  async create(entity: CricketPlayerHistorial) {
    const historial = new CricketPlayerHistorial(
      entity.playerId,
      entity.goals,
      entity.assists,
      entity.clean_sheet,
      entity.yellow_card,
      entity.red_card
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

  async update(id: string, data: Partial<CricketPlayerHistorial>) {
    const historial = await this.repo.findOne(id);
    if (!historial) {
      throw new NotFoundException('player history not found');
    }
    await this.repo.update(id, data);
    return this.repo.findOne(id);
  }

  // 🟢 Añadir goles por playerId
  async addGoals(playerId: string, goals: number) {
    const updated = await this.repo.addGoalsByPlayerId(playerId, goals);
    if (!updated) {
      throw new NotFoundException('player history not found');
    }
    return updated;
  }

  // 🟢 Añadir asistencias por playerId
  async addAssists(playerId: string, assists: number) {
    const updated = await this.repo.addAssistsByPlayerId(playerId, assists);
    if (!updated) {
      throw new NotFoundException('player history not found');
    }
    return updated;
  }

  // 🟢 Añadir clean sheets por playerId
  async addCleanSheet(playerId: string, cleanSheet: number) {
    const updated = await this.repo.addCleanSheetByPlayerId(playerId, cleanSheet);
    if (!updated) {
      throw new NotFoundException('player history not found');
    }
    return updated;
  }

  // 🟢 Añadir tarjetas amarillas por playerId
  async addYellowCard(playerId: string, yellowCard: number) {
    const updated = await this.repo.addYellowCardByPlayerId(playerId, yellowCard);
    if (!updated) {
      throw new NotFoundException('player history not found');
    }
    return updated;
  }

  // 🟢 Añadir tarjetas rojas por playerId
  async addRedCard(playerId: string, redCard: number) {
    const updated = await this.repo.addRedCardByPlayerId(playerId, redCard);
    if (!updated) {
      throw new NotFoundException('player history not found');
    }
    return updated;
  }
}
