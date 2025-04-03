import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Cron('0 * * * * *')
  handleCron() {
    this.logger.debug('Called every minute');
  }

  /**
    El primero es segundos, segundo minuto, tercero horas (se dispara a las 9 pm), cuarto el dia del mes, quinto el mes y el ultimo el dia de la semana (1, lunes)
   * 0 0 21 * * 0
   */
  @Cron('0 0 21 * * 1') // Todos los lunes a las 9:00 PM
  handleWeeklyCron() {
    this.logger.log('📅 Tarea semanal ejecutada: Cada 7 días a las 9:00 PM');
  }
}
